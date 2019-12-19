import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseService } from '../base-service.class';

/**
 * 处理 URL
 */
@Injectable()
export class HttpUrlInterceptor extends BaseService implements HttpInterceptor {
  constructor(protected injector: Injector) {
    super(injector);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(this.processUrl(req));
  }

  processUrl(req: HttpRequest<any>): HttpRequest<any> {
    return req.clone({ url: this.getApiUrl(req.url) });
  }

  getApiUrl(url: string) {
    if (this.appConfig.baseReg && this.appConfig.baseReg.test(url)) {
      url = this.appConfig.baseUrl + url;
    } else {
      if (this.appConfig.urlCommonReg) {
        url = url.replace(this.appConfig.urlCommonReg, (substring, ...args) => {
          if (substring) {
            return '';
          }
          return args[args.length - 1];
        });
        url = this.appConfig.baseUrl + this.appConfig.urlPrefix + url;
      }
    }

    return url.replace(/\/{2,}/g, '/');
  }
}
