import { Component, Injector, OnInit } from '@angular/core';
import { BasePage, BaseModuleService, HttpLoadingService } from '@common/base';
import { AppService } from './app.service';

@Component({
  selector: 'demo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent extends BasePage implements OnInit {
  title = 'app-demo';
  constructor(
    protected injector: Injector,
    protected moduleService: AppService,
    protected loading: HttpLoadingService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.loading.subscribe(status => {
      if (status) {
        // show loading icon
      } else {
        // hide loding icon
      }
    });
  }
}
