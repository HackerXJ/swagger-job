import axios from 'axios';
import { Log4js, LoggerCatrgoryType } from '../log4js';

export class HttpSend {
  private logger = new Log4js('http-send' as LoggerCatrgoryType);

  constructor() {}

  get(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.logger.info('url ', url);
      axios
        .get(url)
        .then((data) => {
          if (data.data) {
            resolve(data.data);
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

  post(url: string, data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.logger.info('url ', url);
      this.logger.info('data ', JSON.stringify(data));
      axios
        .post(url, data)
        .then((response) => {
          if (response.status === 200) {
            resolve(response.data);
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
