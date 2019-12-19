import { Injectable, Injector } from '@angular/core';
import { BaseService } from '../base-service.class';
import { Observable, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class HttpLoadingService extends BaseService {
  public httpLoadingStatus$ = new Subject<boolean>();

  constructor(protected injector: Injector) {
    super(injector);
  }

  /**
   * HttpLoadingService needs a subject to tell the next loading status.
   * @param statusChangeObservable The subject who tells the loading status.
   */
  init(statusChangeObservable: Observable<boolean>) {
    statusChangeObservable.pipe(takeUntil(this.destroy$)).subscribe(this.httpLoadingStatus$);
  }

  /**
   * You have to subscribe the httpLoadingStatus$ in application to set custom loading behaviors through the method.
   * @param observer customer callbacks when http loading status change.
   *
   * @example
   * `app.component.ts`
   * ```ts
   * constructor(private loading: HttpLoadingService){}
   * ngOnInit() {
   *   this.loading.subscribe(status => {
   *     if(status){
   *       this.modal.show('loading...');
   *     }else{
   *       this.modal.hide();
   *     }
   *   })
   * }
   * ```
   */
  subscribe(next?: (value: boolean) => void, error?: (error: any) => void, complete?: () => void): Subscription {
    return this.httpLoadingStatus$.subscribe(next, error, complete);
  }
}
