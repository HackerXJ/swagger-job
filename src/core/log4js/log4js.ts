/**
 * 專案名稱： swagger-init
 * 檔案說明： 日誌設定
 * 部門代號： SWRD HC3521
 * @author Hacker Xu
 * @contact Hacker Xu@wistronits.com
 * -----------------------------------------------------------------------------
 * @NOTE
 */


import { configure, getLogger, Logger } from 'log4js';
import { LOG_CONF } from './config';
import { LoggerAdapter } from './logger.adapter';
import { LoggerCatrgoryType } from './models';

/**
 * Log4js日誌
 */
export class Log4js implements LoggerAdapter {
  /**
   * Log4js日誌
   */
  private logger: Logger;

  /**
   * @param type Log4js日誌類別
   */
  constructor(type: LoggerCatrgoryType) {
    configure(LOG_CONF);
    this.logger = getLogger(type);
  }

  /**
   * 一般日誌
   *
   * @method public
   * @param args 日誌參數
   */
  public log(message: any, ...args: any[]): void {
    this.logger.log(message, ...args);
  }

  /**
   * TRACE級別日誌
   *
   * @method public
   * @param message 日誌內文
   * @param args    日誌參數
   */
  public trace(message: any, ...args: any[]): void {
    this.logger.trace(message, ...args);
  }

  /**
   * DEBUG級別日誌
   *
   * @method public
   * @param message 日誌內文
   * @param args    日誌參數
   */
  public debug(message: any, ...args: any[]): void {
    this.logger.debug(message, ...args);
  }

  /**
   * INFO級別日誌
   *
   * @method public
   * @param message 日誌內文
   * @param args    日誌參數
   */
  public info(message: any, ...args: any[]): void {
    this.logger.info(message, ...args);
  }

  /**
   * WARN級別日誌
   *
   * @method public
   * @param message 日誌內文
   * @param args    日誌參數
   */
  public warn(message: any, ...args: any[]): void {
    this.logger.warn(message, ...args);
  }

  /**
   * ERROR級別日誌
   *
   * @method public
   * @param message 日誌內文
   * @param args    日誌參數
   */
  public error(message: any, ...args: any[]): void {
    this.logger.error(message, ...args);
  }

  /**
   * FATAL級別日誌
   *
   * @method public
   * @param message 日誌內文
   * @param args    日誌參數
   */
  public fatal(message: any, ...args: any[]): void {
    this.logger.fatal(message, ...args);
  }

  /**
   * MARK級別日誌
   *
   * @method public
   * @param message 日誌內文
   * @param args    日誌參數
   */
  public mark(message: any, ...args: any[]): void {
    this.logger.mark(message, ...args);
  }
}
