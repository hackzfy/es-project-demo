# 开发规范

## 命名规则

```$xslt
- 组件：xxx-xxx.component.ts
- 样式：xxx-xxx.component.scss
- 模板：xxx-xxx.component.html
- 服务：xxx-xxx.service.ts
- 枚举：xxx-xxx.enum.ts
- 模型：xxx-xxx.model.ts
- 接口：xxx-xxx.interface.ts
- 类：xxx-xxx.class.ts
- 配置：xxx-xxx.config.ts
```


## 项目目录与路由

     D: 文件夹 F: 文件
     
### 目录结构

```
新模块 D
├── 创建页 D
├── 详情页 D
├── 列表页 D
├── 修改页 D
├── 模块定义 F 
├── 模块路由 F
├── 模块中使用的模型 F
└── 模块服务 F
```
    
**示例**

```
src/app/user
├── create
│   ├── create.component.html
│   ├── create.component.scss
│   ├── create.component.spec.ts
│   └── create.component.ts
├── details
│   ├── details.component.html
│   ├── details.component.scss
│   ├── details.component.spec.ts
│   └── details.component.ts
├── list
│   ├── list.component.html
│   ├── list.component.scss
│   ├── list.component.spec.ts
│   └── list.component.ts
├── update
│   ├── update.component.html
│   ├── update.component.scss
│   ├── update.component.spec.ts
│   └── update.component.ts
├── user-routing.module.ts
├── user.model.ts  存放模型
├── user.module.ts 
└── user.service.ts 模块级 service


```
    
    如果模块中包含子模块，遵循同样的结构。
    
    
### 对应的路由结构

```

const routes = [
  // 用户模块
  {
    path: 'user',
    children: [
      // 用户列表
      { path: 'list', component: UserListComponent },
      // 用户详情
      { path: 'details/:id', component: UserDetailsComponent },
      // 用户信息更新
      { path: 'update/:id', component: UserUpdateComponent },
      // 新增用户
      { path: 'create', component: UserCreateComponent }
    ]
  }
];

```


## 组件开发规范

### 所有的非页面级 component 都要继承 BaseComponent

- 获取对应的属性和方法。
- 避免重复代码。比如 subscription， ngOnDestroy，每个组件都会用到，可以通过继承精简大量代码。
- 统一维护。组件在构造器，初始化，销毁时可以统一执行一些共同的逻辑，这些逻辑在父类中设定， 并且可以根据业务逻辑进行修改，实现组件的统筹管理。

**`base-component.class.ts`**
```

export abstract class BaseComponent extends Base {
  protected constructor(protected injector: Injector) {
    super(injector);
  }
}

```
**`not-a-page.component.ts`**
```

import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from '../public-api';
import { interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'lib-not-a-page',
  template: `
    {{ count }}
  `
})
export class NotAPageComponent extends BaseComponent implements OnInit {
  count: number;

  constructor(protected injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    interval(1000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => (this.count = value));
  }
}


```

### 所有的页面级组件都需要继承 BasePage

- BasePageComponent 有一个抽象属性：moduleService，继承后必须实例化此属性。
- 所有和 UI 展示有关的逻辑写在 component 中，与数据获取有关的逻辑由 moduleService 提供。实现数据与ui 的分层。
- 继承后可以通过在 BasePage 中添加属性和方法来统一管理所有的页面级组件。

**`base-page.class.ts`**

```
export abstract class BasePage extends BaseComponent {
  protected abstract moduleService: BaseModuleService;
  protected route: ActivatedRoute;
  protected router: Router;

  constructor(protected injector: Injector) {
    super(injector);
    this.route = injector.get(ActivatedRoute);
    this.router = injector.get(Router);
  }

}
```

**`a-page.component.ts`**

```
@Component({
  selector: 'lib-a-page',
  template: ``
})
export class APageComponent extends BasePage implements OnInit {
  users: IUser[] = [];

  constructor(
    protected injector: Injector,
    protected moduleService: DemoService
  ) {
    super(injector);
  }

  ngOnInit() {
    this.moduleService.getUsers().subscribe(users => (this.users = users));
  }
}
```

### component 所有的属性必须有初始值

**如果属性是数组类型，则赋值空数组。如果属性是空对象，则赋值为空对象。**

```
@Component({
  selector: 'lib-a-page',
  template: ``
})
export class APageComponent extends BasePage implements OnInit {

  users: IUser[] = [];
  details = {} as IUser;

  constructor(
    protected injector: Injector,
    protected moduleService: DemoService
  ) {
    super(injector);
  }

  ngOnInit() {
    this.moduleService.getUsers().subscribe(users => (this.users = users));
  }
}

```

### 所有不会自动取消的订阅都必须添加 takeUntil 操作符来防止内存泄漏

```
@Component({
  selector: 'lib-not-a-page',
  template: `
    {{ count }}
  `
})
export class NotAPageComponent extends BaseComponent implements OnInit {
  count: number;

  constructor(protected injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    interval(1000)
      .pipe(takeUntil(this.destroy$)) // takeUntil在组件销毁时自动取消订阅
      .subscribe(value => (this.count = value));
  }
}


```

### 所有组件和服务如果覆盖了父类的 ngOnDestroy 方法，必须调用 super.ngOnDestroy

```
export class NotAPageComponent extends BaseComponent implements OnDestroy {

  constructor(protected injector: Injector) {
    super(injector);
  }

  ngOnDestroy() {
    console.log('NotAPageComponent destroyed.');
    super.ngOnDestroy();
  }
}

```

### 任何组件中不得注入 HttpClient，不可以在组件中直接发送 http请求。应该注入相应的 service 来完成。

## Service 开发规范

### 所有的 service 都应该直接或间接的继承 BaseService

```
import { Base } from './base.class';
import { Injector } from '@angular/core';

export abstract class BaseService extends Base {
  constructor(protected injector: Injector) {
    super(injector);
  }
}
```

### 所有发送 http 请求的service 都应该直接或间接的继承 BaseApiService

```
import { BaseService } from './base-service.class';
import { Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/**
 * Service uses httpClient should extend this class.
 */
export abstract class BaseApiService extends BaseService {
  protected http: HttpClient;
  constructor(protected injector: Injector) {
    super(injector);
    this.http = injector.get(HttpClient);
  }
}
```

### 所有为页面级组件提供数据的service 都应该直接或间接的继承 BaseModuleService

```
import { BaseApiService } from './base-api-service.class';
import { Injector } from '@angular/core';

export abstract class BaseModuleService extends BaseApiService {

  protected constructor(protected  injector: Injector) {
    super(injector);
  }
}
```

### 继承的目的

- 项目中service 的统筹管理。
- 减少重复代码。
- service 分类，分层。


## 动态表单 

### @ngx-formly/core

### 使用场景

- 表单项很多。
- 表单项之间有联动关系。
- 表单验证逻辑多。
- 表单项动态增删。

### 使用效果

- 减少 html 代码 90% 以上。
- 表单通过配置生成，只要组件封装好，开发效率很高。
- 表单项动态显隐，表单值回写，处理，都可以很方便的实现。
- 具体使用方法请查看文档：<https://formly.dev/>


## 项目公共代码库

### 使用 git 子模块

### 项目结构

```
A
├──dist
├──projects
│   ├── project1
│   ├── project2
│   ├── project3
│   └── common  (git 子模块）
├──src
```

### 为什么用子模块
- 很多组件，指令，service，工具类，需要跨项目使用。
- 使用传统的 Angular library, 每次修改需要 build, 发布, 并通知项目成员 update 包之后才能看到效果，效率很低。使用子模块后只需要 git pull 直接就能看到效果。
