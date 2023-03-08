/**
 * 生产数据接口
 */
export interface ProducerIfc<T> {
  /**
   * 发送数据
   * @param data 数据
   */
  send(data: T): Promise<boolean>;
}
