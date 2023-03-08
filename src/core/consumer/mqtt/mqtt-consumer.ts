import * as mqtt from 'mqtt';
import { MqttClient } from 'mqtt';
import { Observable, Subject } from 'rxjs';
import { ConsumerIfc } from '../consumer-ifc';
import { MqttData } from './model/mqtt-data';
export class MqttConsumer implements ConsumerIfc<MqttData> {
  client: MqttClient | undefined;
  /**
   * 持续将mqtt数据返回
   *
   * @private
   * @type {Subject<P>}
   */
  private subject: Subject<MqttData> = new Subject<MqttData>();
  constructor(private url: string, private topics: string | string[]) {}

  /**
   * 连接kafka host，并订阅topics
   * @returns 成功则返回true，失败则一直等待
   */
  connect(): Promise<boolean> {
    this.client = mqtt.connect(this.url, {
      rejectUnauthorized: false,
    });
    return new Promise((resolve, reject) => {
      this.client?.on('connect', () => {
        this.client?.subscribe(this.topics);
        this.client?.on('message', (topic: string, message: any) => {
          try {
            var msg = JSON.parse(message.toString());
            this.subject.next(new MqttData(topic, msg));
          } catch (error) {}
        });
        resolve(true);
      });
    });
  }
  /**
   *
   * @returns 将mqtt数据，通过Observable持续返回
   */
  consumerData(): Observable<MqttData> {
    return this.subject.asObservable();
  }
}
