import { Injector } from '@angular/core';
import { BaseModuleService } from './base-module-service.class';

/**
 * 所有页面级 service 应该继承此类。
 * 一般情况页面注入 moduleService 就可以。
 * 但是相对复杂的页面可能需要单独的 service 来服务。
 */
export abstract class BasePageService extends BaseModuleService {
  protected constructor(protected injector: Injector) {
    super(injector);
  }
}
