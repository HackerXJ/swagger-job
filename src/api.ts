const express = require("express");
import * as swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from './asset/swagger.json';
import { Log4js, LoggerCatrgoryType } from './core/log4js';

export class Api {
  /**
   * 日誌
   */
  protected logger = new Log4js('[API]' as LoggerCatrgoryType);
  /**
   * API Server
   * 
   */
  private readonly server = express();
  public static instance = new Api();
  //private apiService = new ApiService();
  private constructor() { }
  /**
   * 啟動API Server3
   * @method public
   * @param port API端口
   */
  public start(port = 3000): void {
    this.initHandle();
    this.server.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    this.logger.info(`Listen api port ${port}`);
    this.server.listen(port);
  }


  /**
  * http template 
  * @param req 请求参数
  * @param res 返回结果
  */
  private initHandle() {
    this.server.get('/history/handle', async (req: any, res: any) => {
      let startDateString = req.query.startDate;
      let endDateString = req.query.endDate;
      this.logger.info("startDateString", startDateString);
      this.logger.info("endDateString", endDateString);
      res.send('success');
    });
  }
}
