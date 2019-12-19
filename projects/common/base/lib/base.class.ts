import { Injector, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { AppConfig, IAppConfig } from './app-config.token';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';

/**
 * super class of all directives and services.
 */
export abstract class Base implements OnDestroy {
  protected destroy$ = new Subject();
  public appConfig: IAppConfig;
  protected message: NzMessageService;
  protected modal: NzModalService;
  protected constructor(protected injector: Injector) {
    this.appConfig = injector.get(AppConfig);
    this.message = injector.get(NzMessageService);
    this.modal = injector.get(NzModalService);
    /**
     * 可以在此添加任何你想添加的服务让子类继承。
     */
  }

  /**
   * OnDestroy is called when a directive, pipe or service is destroyed.
   * So both directives and services can extend this method to do some clean up.
   * @see [Lifecycle Hooks] https://angular.io/api/core/OnDestroy
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
