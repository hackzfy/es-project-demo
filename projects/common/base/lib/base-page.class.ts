import { Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BaseComponent } from './base-component.class';
import { BaseModuleService } from './base-module-service.class';

/**
 * 所有的页面级组件都需要继承 BasePageComponent。
 * BasePageComponent 有一个抽象属性：moduleService.继承后必须实例化此属性。
 * 所有和 UI 展示有关的逻辑写在 component 中，与数据获取有关的逻辑由 moduleService 提供。实现数据逻辑与表现逻辑的分层。
 * 继承后可以通过在 BasePageComponent 中添加属性和方法来统一管理所有的页面级组件。
 */
export abstract class BasePage extends BaseComponent {
  protected abstract moduleService: BaseModuleService;
  protected route: ActivatedRoute;
  protected router: Router;

  protected constructor(protected injector: Injector) {
    super(injector);
    this.route = injector.get(ActivatedRoute);
    this.router = injector.get(Router);
  }

  /**
   * prevent we from injecting HttpClient into component.
   * All http requests should be placed in service.
   */
  protected http() {}
}
