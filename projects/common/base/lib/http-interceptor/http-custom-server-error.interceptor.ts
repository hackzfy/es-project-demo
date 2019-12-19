import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpNotifyService } from './http-notify.service';
import { HttpError } from './http-error.class';
import { BaseService } from '../base-service.class';

/**
 * 在 http-error-interceptor 后，进行自定义错误处理。
 */
@Injectable()
export class HttpCustomServerErrorInterceptor extends BaseService implements HttpInterceptor {
  constructor(protected injector: Injector, protected notify: HttpNotifyService) {
    super(injector);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(catchError(error => this.handleError(error)));
  }

  handleError(error: HttpError) {
    if (error.code === 10013 || error.code === 10015) {
      this.notify.notifyLogin(error);
    } else if (error.code > 11000) {
      this.notify.notifyCustomServerError(error);
    } else {
      this.notify.notifyHttpOriginError(error);
    }
    return throwError(error);
  }
}
