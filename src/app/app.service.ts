import { Injectable, Injector } from '@angular/core';
import { BaseModuleService } from '@common/base';

@Injectable({ providedIn: 'root' })
export class AppService extends BaseModuleService {
  constructor(protected injector: Injector) {
    super(injector);
  }
}
