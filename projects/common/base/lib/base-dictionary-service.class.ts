import { BaseApiService } from './base-api-service.class';
import { DicItem, IDictionaryStore } from './base.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import * as _ from 'lodash';

/**
 * 所有数据字典 service 的需要继承此类
 */
export abstract class BaseDictionaryService<T extends DicItem = DicItem> extends BaseApiService {
  abstract dicUrl: string;

  abstract store: IDictionaryStore<T>;

  /**
   * 子类提供如发送 http 请求，获取数据的逻辑。
   * @param  type 字典类型
   * @returns  字典列表
   */
  abstract requestData(type: string): Observable<any[]>;

  /**
   * 服务器返回字典列表后将能过此方法进行转换
   * @param items 获取的数据
   */
  abstract transform(items: any[]): T[];

  /**
   * 根据字典项名称获取字典项值
   * @param type 字典类型
   * @param label 字典项名称
   */
  getValue(type: string, label: string): Observable<string> {
    return this.getDic(type).pipe(
      map(items => items.find(item => item.label && item.label.toString() === label)),
      map(item => item.value)
    );
  }

  /**
   * 根据字典项值获取字典项名称
   * @param type 字典类型
   * @param value 字典项值
   */
  getLabel(type: string, value: any): Observable<string> {
    return this.getDic(type).pipe(
      map(items => items.find(item => _.isEqual(item.value, value))),
      map(item => item.label)
    );
  }

  /**
   * 获取字典
   * @param type 字典类型
   */
  getDic(type: string): Observable<T[]> {
    if (this.store[type] == null) {
      this.store[type] = new BehaviorSubject<T[]>([]);
      this.requestData(type).pipe(
        map(resp => this.transform(resp)),
        tap(
          resp => this.store[type].next(resp),
          () => (this.store[type] = null)
        )
      );
    }

    return this.store[type].pipe(filter(items => Array.isArray(items) && items.length > 0));
  }
}
