import { Injectable, Injector } from '@angular/core';
import {
  HttpEvent,
  HttpEventType,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IResponse } from './http-interceptor.model';
import { HttpError } from './http-error.class';
import { BaseService } from '../base-service.class';

/**
 * 处理服务器返回的数据，改变其结构。
 */
@Injectable()
export class HttpResponseParseInterceptor extends BaseService implements HttpInterceptor {
  constructor(protected injector: Injector) {
    super(injector);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(map(response => this.processResponse(response)));
  }

  processResponse(httpEvent: HttpEvent<any>): HttpEvent<any> {
    if (httpEvent.type === HttpEventType.Response) {
      return this.processData(httpEvent);
    }
    return httpEvent;
  }

  processData(response: HttpResponse<IResponse>) {
    const body = response.body || ({} as IResponse);
    if (body.code === 200 || body.code == null) {
      return response.clone({ body: body.result });
    }
    throw new HttpError(body.code, body.message, body);
  }
}
