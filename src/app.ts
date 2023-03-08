import { Log4js, LoggerCatrgoryType } from "./core/log4js";

export class App {
  private logger = new Log4js('App' as LoggerCatrgoryType);
  public static instance = new App();

  private constructor() { }
  public async run() {
    this.logger.info('App start');// 启动Data Center
  }
}
