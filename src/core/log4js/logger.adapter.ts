/**
 * 專案名稱： swagger-init
 * 檔案說明： 日誌設定
 * 部門代號： SWRD HC3521
 * @author Hacker Xu
 * @contact Hacker Xu@wistronits.com
 * -----------------------------------------------------------------------------
 * @NOTE
 */

/**
 * 抽象日誌轉接器
 */
export interface LoggerAdapter {
  /**
   * 一般日誌
   *
   * @method public
   * @param args 日誌參數
   */
  log(...args: any[]): void;
  /**
   * TRACE級別日誌
   *
   * @method public
   * @param message 日誌內文
   * @param args    日誌參數
   */
  trace(message: any, ...args: any[]): void;
  /**
   * DEBUG級別日誌
   *
   * @method public
   * @param message 日誌內文
   * @param args    日誌參數
   */
  debug(message: any, ...args: any[]): void;
  /**
   * INFO級別日誌
   *
   * @method public
   * @param message 日誌內文
   * @param args    日誌參數
   */
  info(message: any, ...args: any[]): void;
  /**
   * WARN級別日誌
   *
   * @method public
   * @param message 日誌內文
   * @param args    日誌參數
   */
  warn(message: any, ...args: any[]): void;
  /**
   * ERROR級別日誌
   *
   * @method public
   * @param message 日誌內文
   * @param args    日誌參數
   */
  error(message: any, ...args: any[]): void;
  /**
   * FATAL級別日誌
   *
   * @method public
   * @param message 日誌內文
   * @param args    日誌參數
   */
  fatal(message: any, ...args: any[]): void;
  /**
   * MARK級別日誌
   *
   * @method public
   * @param message 日誌內文
   * @param args    日誌參數
   */
  mark(message: any, ...args: any[]): void;
}
