import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseService } from '../base-service.class';

/**
 * 对请求头进行处理
 */
@Injectable()
export class HttpHeaderInterceptor extends BaseService implements HttpInterceptor {
  constructor(protected injector: Injector) {
    super(injector);
  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const headers = { 'X-Requested-With': 'XMLHttpRequest' };
    const clone = req.clone({
      setHeaders: headers,
    });
    return next.handle(req);
  }
}
