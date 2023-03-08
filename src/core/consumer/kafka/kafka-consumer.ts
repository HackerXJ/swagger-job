import { ConsumerGroup } from 'kafka-node';
import { from, NEVER, Observable, of, Subject } from 'rxjs';
import { ConfluentSubResolveStrategy } from 'wisrtoni40-confluent-schema/lib';
import { KafkaConsumerOption } from '.';
import { Log4js, LoggerCatrgoryType } from '../../log4js';
import { ConsumerIfc } from '../consumer-ifc';

export class KafkaConsumer<P> implements ConsumerIfc<P> {
  protected logger = new Log4js('KafkaConsumer' as LoggerCatrgoryType);
  private subject: Subject<P> = new Subject<P>();
  private consumer: ConsumerGroup | undefined;
  constructor(
    private useKafka2: boolean,
    private option: KafkaConsumerOption,
    private resolver?: ConfluentSubResolveStrategy
  ) {
    this.connectKafka();
  }
  /**
   *
   * @returns 将kafka数据，通过Observable持续返回
   */
  consumerData(): Observable<P> {
    return this.subject.asObservable();
  }

  /**
   * 处理接受到的kafka data
   * @param kafkaData Kafka data Object
   */
  kafkaReceive(kafkaData: any) {
    // let data = this.useKafka2 ? await this.resolver.resolve(kafkadata.value)
    this.transferKafkaData(kafkaData).subscribe((data) =>
      this.subject.next(data as P)
    );
  }
  /**
   * 如果kafka consumer报错，一直重连
   * @param error kafka consumer error info
   */
  consumerError(error: any) {
    this.logger.error(error);
    this.consumer?.close((err) => {});
    this.connectKafka();
  }

  /**
   * 根据KafkaConsumerOption连接到kafka node
   */
  connectKafka() {
    this.consumer = new ConsumerGroup(
      {
        kafkaHost: this.option.kafkaHost,
        groupId: this.option.groupId,
        sessionTimeout: 15000,
        protocol: ['roundrobin'],
        encoding: 'buffer',
        fromOffset: 'latest',
        outOfRangeOffset: 'latest',
        sasl: this.useKafka2
          ? {
              mechanism: 'plain',
              username: this.option.username,
              password: this.option.password,
            }
          : undefined,
      },
      this.option.topic
    );
    this.consumer.on('message', this.kafkaReceive.bind(this));
    this.consumer.on('error', this.consumerError.bind(this));
  }

  /**
   * 将kafka data buffer转化成Object
   * @param kafkaData ：kafka data buffer
   * @returns kafka data Object
   */
  transferKafkaData(kafkaData: any): Observable<any> {
    try {
      if (this.useKafka2 && this.resolver) {
        return from(this.resolver.resolve(kafkaData.value));
      } else {
        return of(JSON.parse(kafkaData.value));
      }
    } catch (error) {
      return NEVER;
    }
  }
}
