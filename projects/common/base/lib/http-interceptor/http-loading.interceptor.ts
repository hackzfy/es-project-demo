import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { HTTP_HEADERS } from './http-interceptor.model';
import { filter, finalize } from 'rxjs/operators';
import { HttpLoadingService } from './http-loading.service';
import { BaseService } from '../base-service.class';

/**
 * http 请求发送时，调用 loading service 显示加载中图标或者做一些其它处理。
 */
@Injectable()
export class HttpLoadingInterceptor extends BaseService implements HttpInterceptor {
  private showStatusChange = new Subject<boolean>();
  private requestCount = 0;

  constructor(protected injector: Injector, private loadingService: HttpLoadingService) {
    super(injector);
    this.loadingService.init(this.showStatusChange.pipe(filter(() => this.requestCount === 0)));
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const show = !req.headers.has(HTTP_HEADERS.NO_LOADING);
    if (show) {
      this.show();
    }
    const clone = req.clone({
      headers: req.headers.delete(HTTP_HEADERS.NO_LOADING),
    });
    return next.handle(clone).pipe(finalize(() => show && this.hide()));
  }

  show() {
    this.showStatusChange.next(true);
    this.requestCount++;
  }

  hide() {
    this.requestCount--;
    this.showStatusChange.next(false);
  }
}
