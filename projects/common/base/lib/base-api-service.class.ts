import { BaseService } from './base-service.class';
import { Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/**
 * 所有发送 http 请求的 service 需要继承此类。
 */
export abstract class BaseApiService extends BaseService {
  protected http: HttpClient;

  protected constructor(protected injector: Injector) {
    super(injector);
    this.http = injector.get(HttpClient);
  }
}
