import axios from 'axios';
import { Log4js, LoggerCatrgoryType } from '../../../core/log4js';
import { ProducerIfc } from '../producer-ifc';

/**
 * 定义http client消费者
 */
export class HttpProducer<T> implements ProducerIfc<T> {
  /**
   * 定义logger
   *
   * @private
   */
  private logger = new Log4js('HttpProducer' as LoggerCatrgoryType);
  constructor(public url: string) {}
  /**
   * 实现消费者接口，发送数据
   * @param data 数据
   * @returns 成功则返回true，失败返回false
   */
  send(data: T): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .post(this.url, data)
        .then((response) => {
          if (response.status === 200) {
            this.logger.info('send success');
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch((error) => {
          this.logger.error('error', error);
          resolve(false);
        });
    });
  }
}
