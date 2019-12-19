import { registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import zh from '@angular/common/locales/zh';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppConfig, httpInterceptors } from '@common/base';
import { NZ_I18N, zh_CN } from 'ng-zorro-antd';

import { environment } from '../../environments/environment';

registerLocaleData(zh);

/**
 * 本项目的核心模块
 */
@NgModule({
  imports: [BrowserModule, BrowserAnimationsModule, HttpClientModule],
  providers: [{ provide: NZ_I18N, useValue: zh_CN }, { provide: AppConfig, useValue: environment }, httpInterceptors],
})
export class AppCoreModule {}
