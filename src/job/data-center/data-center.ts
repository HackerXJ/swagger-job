import { Observable, Subject } from 'rxjs';
import { EventConstant } from './event-constant';

/**
 * 定义一个数据中转中心，所有数据源都在这里进行注册、发送、消费的过程
 */
export class DataCenter {
  // 定义单例模式
  public static instance = new DataCenter();

  private constructor() { }

  /**
   *
   * event key和data source的匹配关系
   */
  private subjectList: Map<string, Subject<any>> = new Map<
    string,
    Subject<any>
  >();

  /**
   * 为避免数据的生产者和消费者不同步的问题，
   * 所有的数据源都必须先进行初始化动作
   */
  public initDataEvent() {
    this.subjectList.set(
      EventConstant.AOI_FAIL_DATA,
      new Subject<object>()
    );
  }

  /**
   * 生产者获取数据源，就可以往里面发送数据
   * @param key data key
   * @returns data source
   */
  getDataEvent(key: string): Subject<any> {
    let subject = this.subjectList.get(key);
    if (!subject) {
      throw new Error(`getDataEvent error, no event ${key}`);
    }
    return subject;
  }

  /**
   * 消费者获取数据的观察者，处理数据
   * @param key data key
   * @returns data source observer
   */
  registerDataEvent(key: string): Observable<any> {
    let subject = this.subjectList.get(key);
    if (!subject) {
      throw new Error(`registerDataEvent error, no event ${key}`);
    }
    return subject.asObservable();
  }
}
