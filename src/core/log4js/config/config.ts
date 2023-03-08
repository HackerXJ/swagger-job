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
 * 日誌設定
 */
export const LOG_CONF = {
  appenders: {
    std: {
      type: 'stdout',
    },
    file: {
      type: 'file',
      filename: 'logs/AppLog/AppLog',
      alwaysIncludePattern: true,
      pattern: 'yyyy-MM-dd.log',
      daysToKeep: 100,
      backups: 100,
      compress: false,
      encoding: 'utf-8',
    },
  },
  categories: {
    default: {
      appenders: ['std', 'file'],
      level: 'all',
    },
    prd: {
      appenders: ['std', 'file'],
      level: 'warn',
    },
  },
};
