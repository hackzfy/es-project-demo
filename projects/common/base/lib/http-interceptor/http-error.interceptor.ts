import { Injectable, Injector } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BaseService } from '../base-service.class';
import { HttpError } from './http-error.class';

/**
 * http 请求发生错误后进行处理
 */
@Injectable()
export class HttpErrorInterceptor extends BaseService implements HttpInterceptor {
  constructor(protected injector: Injector) {
    super(injector);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(catchError(error => this.handleError(error)));
  }

  /**
   * 将错误响应包装为统一格式
   */
  handleError(errorResponse: HttpErrorResponse) {
    const { status: code, error, message } = errorResponse;
    return throwError(new HttpError(code, message, error));
  }
}
