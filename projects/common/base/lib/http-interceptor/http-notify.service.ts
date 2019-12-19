import { Injectable, Injector } from '@angular/core';
import { BaseService } from '../base-service.class';
import { HttpError } from './http-error.class';
import { Subject } from 'rxjs';
import { IResponse } from './http-interceptor.model';
import { throttleTime } from 'rxjs/operators';

/**
 *
 */
@Injectable({ providedIn: 'root' })
export class HttpNotifyService extends BaseService {
  isOpen = false;
  loginNotify$ = new Subject<HttpError>();

  constructor(protected injector: Injector) {
    super(injector);

    this.loginNotify$.pipe(throttleTime(5000)).subscribe(error => {
      this.modal.closeAll();
      // tslint:disable-next-line
      if (!window['SESSION_TIMEOUT']) {
        // tslint:disable-next-line
        window['SESSION_TIMEOUT'] = true;
      }
      window.alert(error.message || '登录超时，请重新登录');
      window.top.location.href = error.body.url;
    });
  }

  notifyLogin(error: HttpError<IResponse>) {
    this.loginNotify$.next(error);
  }

  notifyCustomServerError(error: HttpError<IResponse>) {}

  notifyHttpOriginError(error: HttpError) {
    if (!this.isOpen) {
      this.message.error(error.message);
      this.isOpen = true;
      setTimeout(() => (this.isOpen = false), 500);
    }
  }
}
