import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';

// 本项目共享模块
const modules = [CommonModule, FormsModule, ReactiveFormsModule, NgZorroAntdModule];
// 本项目共享组件
const components = [];

/**
 * 本项目的共享模块
 */
@NgModule({
  imports: [modules],
  exports: [modules],
  declarations: [components],
})
export class AppSharedModule {}
