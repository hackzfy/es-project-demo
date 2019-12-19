import { Base } from './base.class';
import { Injector } from '@angular/core';

/**
 * 所有指令应该继承此类
 */
export abstract class BaseDirective extends Base {
  protected constructor(protected injector: Injector) {
    super(injector);
  }
}
