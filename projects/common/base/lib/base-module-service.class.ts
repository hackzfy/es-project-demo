import { BaseApiService } from './base-api-service.class';
import { Injector } from '@angular/core';

/**
 * 所有模块级服务应该继承此类
 */
export abstract class BaseModuleService extends BaseApiService {
  protected constructor(protected injector: Injector) {
    super(injector);
  }
}
