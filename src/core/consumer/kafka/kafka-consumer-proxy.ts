import { Observable } from 'rxjs';
import {
  ConfluentAvroStrategy,
  ConfluentMultiRegistry,
  ConfluentSubResolveStrategy,
} from 'wisrtoni40-confluent-schema/lib';
import { KafkaConsumerOption } from '.';
import { ConsumerIfc } from '../consumer-ifc';
import { KafkaConsumer } from './kafka-consumer';

export class KafkaConsumerProxy<P> implements ConsumerIfc<P> {
  consumer: ConsumerIfc<P> | undefined;
  constructor(
    private useKafka2: boolean,
    private kafkaHost: string,
    private topic: string,
    private groupId: string,
    private registryHost: string = '',
    private username: string = '',
    private password: string = ''
  ) {
    this.initKafka();
  }
  consumerData(): Observable<P> {
    if (this.consumer) {
      return this.consumer.consumerData();
    } else {
      throw new Error('consumer not defined');
    }
  }

  /**
   * 连接kakfa，抓取数据
   */
  private initKafka() {
    if (this.useKafka2) {
      const schemaRegistry = new ConfluentMultiRegistry(this.registryHost);
      const avro = new ConfluentAvroStrategy();
      const resolver = new ConfluentSubResolveStrategy(schemaRegistry, avro);
      this.consumer = new KafkaConsumer<P>(
        this.useKafka2,
        new KafkaConsumerOption(
          this.kafkaHost,
          this.topic,
          this.groupId,
          this.username,
          this.password
        ),
        resolver
      );
    } else {
      this.consumer = new KafkaConsumer<P>(
        this.useKafka2,
        new KafkaConsumerOption(this.kafkaHost, this.topic, this.groupId)
      );
    }
  }
}
