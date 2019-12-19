import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { MessageApi } from '@common/utils';
if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));

/* Date.prototype.toJSON = function() {
  return NeKit.formatDate(this, 'yyyy-MM-dd HH:mm:ss');
} */

MessageApi.initReceiveMessage();
