import { HighLevelProducer, KafkaClient, Producer } from 'kafka-node';
import * as schedule from 'node-schedule';
import {
  ConfluentAvroStrategy,
  ConfluentMultiRegistry,
  ConfluentPubResolveStrategy,
  ProducerResolveStrategy,
} from 'wisrtoni40-confluent-schema/lib';
import { Log4js, LoggerCatrgoryType } from '../../../core/log4js';
import { ProducerIfc } from '../producer-ifc';
import { KafkaProducerOption, KafkaProducerStatus } from './model';

export class KafkaProducer<T> implements ProducerIfc<T[]> {
  protected logger = new Log4js('KafkaProducer' as LoggerCatrgoryType);
  /**
   * 即将需要发送的数据
   */
  kafkaData: T[] = [];

  /**
   * producer当前所处的状态
   */
  status: KafkaProducerStatus = KafkaProducerStatus.INIT;

  /**
   * kafka producer client
   */
  producer: Producer | undefined;

  /**
   * kafka data encoder
   */
  resolver: ProducerResolveStrategy;

  /**
   * 初始化kafka producer的配置
   */
  constructor(private useKafka2: boolean, private option: KafkaProducerOption) {
    const schemaRegistry = new ConfluentMultiRegistry(this.option.registryHost);
    const avro = new ConfluentAvroStrategy();
    this.resolver = new ConfluentPubResolveStrategy(
      schemaRegistry,
      avro,
      this.option.topic
    );
  }

  /**
   * 开始生成kafka producer，并每分钟发一次数据
   * 为避免数据累积暂用过多内存，若数据操过10万条，则丢弃清空
   */
  async start() {
    await this.createProducer();
    this.status = KafkaProducerStatus.READY;
    schedule.scheduleJob('0 * * * * *', () => {
      if (this.kafkaData.length > 0) {
        if (this.kafkaData.length > 100000) {
          this.kafkaData = [];
          return;
        }
        this.sendData();
      }
    });
  }

  /**
   * 生成kafka producer和client
   * 如果成功，则状态置为READY
   * 如果失败，则状态置为ERROR，并重新create
   */
  async createProducer() {
    const kafkaClient = new KafkaClient({
      kafkaHost: this.option.kafkaHost,
      clientId: this.option.groupId,
      connectTimeout: 30000,
      requestTimeout: 30000,
      connectRetryOptions: {
        retries: 5,
        factor: 0,
        minTimeout: 1000,
        maxTimeout: 1000,
        randomize: false,
      },
      sasl: this.useKafka2
        ? {
            mechanism: 'plain',
            username: this.option.username,
            password: this.option.password,
          }
        : undefined,
    });

    this.producer = new HighLevelProducer(kafkaClient, {
      requireAcks: 1,
      ackTimeoutMs: 100,
    });

    return new Promise((resolve, reject) => {
      this.producer?.on('ready', () => {
        this.logger.info(`createProducer success ${this.option.topic} `);
        this.status = KafkaProducerStatus.READY;
        resolve(true);
      });
      this.producer?.on('error', (error: any) => {
        this.logger.error(`createProducer error ${this.option.topic}`, error);
        this.status = KafkaProducerStatus.ERROR;
        this.producer?.close();
        setTimeout(() => {
          this.createProducer();
        }, 3000);
        resolve(false);
      });
    });
  }

  /**
   * 外部调用发送数据的接口，只是将数据暂存，等待schedule发送
   */
  async send(data: T[]): Promise<boolean> {
    this.kafkaData.push(...data);
    return true;
  }

  /**
   * 发送数据，如果当前已经在发送数据了，则直接return，等待下次发送
   * 如果成功，则状态置为READY
   * 如果失败，启动resend机制
   */
  async sendData() {
    if (this.status != KafkaProducerStatus.READY) return;
    this.status = KafkaProducerStatus.BUSY;
    let kafkaDataTemp = this.kafkaData;
    this.kafkaData = [];
    let encodedData = await this.transformData(kafkaDataTemp);
    this.producer?.send(encodedData, (error: any, result: any) => {
      if (error) {
        this.logger.error(`sendData error ${this.option.topic}`, error);
        setTimeout(() => {
          this.resendData(encodedData, 1);
        }, 5000);
      } else {
        this.logger.info(
          `sendData success ${this.option.topic} ${encodedData[0].messages.length}`
        );
        this.status = KafkaProducerStatus.READY;
      }
    });
  }

  /**
   * 重发数据，
   *  如果重发超过3次，直接return，并将状态置为READY
   *  如果重发次数小于2，则重发
   *    重发失败，count++，继续重发
   *    重发成功，状态置为READY
   */
  resendData(data: any, count: number) {
    if (count > 3) {
      this.logger.info(`resend gt 3 fail ${this.option.topic} `);
      this.status = KafkaProducerStatus.READY;
    } else {
      this.producer?.send(data, (error: any, result: any) => {
        if (error) {
          this.logger.error(`resendData error ${this.option.topic}`, error);
          setTimeout(() => {
            this.resendData(data, count + 1);
          }, 3000);
        } else {
          this.logger.info(
            `resendData success ${this.option.topic} ${data[0].messages.length}`
          );
          this.status = KafkaProducerStatus.READY;
        }
      });
    }
  }

  /**
   * 将程序的data转化成kafka需要的format
   */
  async transformData(data: T[]) {
    let processedData;
    if (this.useKafka2) {
      processedData = await this.resolver.resolve(data);
    } else {
      processedData = data.map((item) => JSON.stringify(item));
    }
    return [{ topic: this.option.topic, messages: processedData }];
  }
}
