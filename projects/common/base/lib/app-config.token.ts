import { InjectionToken } from '@angular/core';

/**
 * It is a copy of the environment.ts.
 * Now we inject it into Base
 * since all directives, services or pipes are subclass of Base,
 * they all get the ability to access environment properties.
 *
 * The reason to do this is:
 * Sometimes we have a shared module used by different projects,
 * it not belongs to any of the projects, therefor should not be included in any of the projects directory, but in a standard directory.
 * eg.  /projects/common , here common is a module include many shared components.
 * the components works almost the same except:
 * 1. The UI plays a little different. Some item should show in project1, but should hide in project2.
 * 2. The Api is different. project1's baseUrl is 'http://example.com/adm', but project2's is 'http://example.com/customer'
 *
 * Since shared components are in a standard folder and not belong to any project,
 * it can't import environment.ts directly,
 * how do they know what to do when it is rendered ?
 *
 * But by inject the AppConfig, they knowns. They don't care about environment any more,
 * all they known is the AppConfig which is set by different projects.
 *
 * @example:
 *
 * ----- project1.core.module -----
 *
 * import {environment} from '../environment;
 *
 * ...
 * providers: [
 *  {provide: AppConfig, useValue: enviroment}
 * ]
 * ...
 * ----- shared-customer.component.ts --------------
 * export class SharedCustomerComponent extends Base{
 *
 *
 * ...
 * constructor(protected injector){
 *    super(injector);
 * }
 * ngOnInit() {
 *    this.title = this.appConfig.projectName;
 *    this.displayInput = this.appConfig.client === 'adm' ? true: false;
 * }
 *
 * ----- shared-customer.service.ts ---------
 * export class SharedCustomerService extends Base {
 *    constructor(protected injector: Injector) {
 *       super(injector);
 *    }
 *    getCustomerList() {
 *      project1's api url: example.com/adm/customer/list
 *      project2's api url: example.com/cus/customer/list
 *      const url = this.appConfig.baseUrl + this.appConfig.client + 'customer/list';
 *      return this.http.get(url);
 *    }
 * }
 * ------ environment.ts -----
 * project1:
 * {
 *    baseUrl: 'example.com',
 *    urlPrefix: 'adm',
 *    client: 'adm'
 * },
 * project2:
 * {
 *    baseUrl: 'example.com',
 *    urlPrefix: 'cus',
 *    client: 'customer'
 * }
 *
 * note: base is not a library, it is most likely a demo.
 * To tell how to organize your code.
 *
 */
export const AppConfig = new InjectionToken<IAppConfig>('app-config');

/**
 * you can add your custom properties.
 */
export interface IAppConfig {
  // 是否为生产环境
  production: boolean;
  // api 统一前缀
  baseUrl: string;
  // 不同项目的url中自定义的拼接路径
  urlPrefix: string;
  // 字典 api 正则
  baseUrlReg: RegExp;
  // 普通 api 正则
  commonUrlReg: RegExp;

  // 其它自定义属性
  [prop: string]: any;
}
