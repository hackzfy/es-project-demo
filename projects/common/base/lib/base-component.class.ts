import { Injector } from '@angular/core';

import { Base } from './base.class';

/**
 * 所有非页面级组件需要继承此类。
 */
export abstract class BaseComponent extends Base {
  protected constructor(protected injector: Injector) {
    super(injector);
  }
}
