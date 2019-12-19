/**
 * 所有 project 通用的模型在此声明，实现复用。
 */
import { BehaviorSubject } from 'rxjs';

export interface IDictionaryStore<T> {
  [key: string]: BehaviorSubject<T[]>;
}

export interface DicItem {
  label: string;
  value: any;

  [key: string]: any;
}
