import { Observable } from 'rxjs';

/**
 * 定义消费者接口
 */
export interface ConsumerIfc<P> {
  /**
   * 抓取数据消费
   */
  consumerData(): Observable<P>;
}
