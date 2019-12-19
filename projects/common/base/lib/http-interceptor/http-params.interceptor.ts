import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseService } from '../base-service.class';
declare var NeKit: any;
/**
 * 请求参数处理
 */
@Injectable()
export class HttpParamsInterceptor extends BaseService implements HttpInterceptor {
  constructor(protected injector: Injector) {
    super(injector);
  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(this.processParameters(req));
  }

  processParameters(req: HttpRequest<any>) {
    if (req.method === 'GET' && req.params != null) {
      return req.clone({
        params: this.processGetParams(req.params),
      });
    }
    return req.clone();
  }

  processGetParams(params: HttpParams) {
    const result: any = { r: Math.random() };

    params.keys().reduce((acc, key) => {
      const values = params.getAll(key);
      acc[key] = values.length > 1 ? values : values[0];
      return acc;
    }, result);

    return new HttpParams({ fromString: NeKit.serialize(result) });
  }
}
