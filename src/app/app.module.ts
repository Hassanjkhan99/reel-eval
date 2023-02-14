import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {en_US, NZ_I18N} from 'ng-zorro-antd/i18n';
import {NzBreadCrumbModule} from 'ng-zorro-antd/breadcrumb';

import {LocationStrategy, PathLocationStrategy, registerLocaleData} from '@angular/common';
import en from '@angular/common/locales/en';

import {AppRoutingModule} from './app-routing.module';
import {TemplateModule} from './shared/template/template.module';
import {SharedModule} from './shared/shared.module';

import {AppComponent} from './app.component';

import {ThemeConstantService} from './shared/services/theme-constant.service';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {JwtInterceptor} from "./shared/interceptor/token.interceptor";
import {NzNotificationModule} from "ng-zorro-antd/notification";
import {NzMessageModule} from "ng-zorro-antd/message";
import {NzCardModule} from "ng-zorro-antd/card";
import {NzTabsModule} from "ng-zorro-antd/tabs";
import {NgChartsModule} from "ng2-charts";
import {NgxPrintModule} from "ngx-print";

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NzBreadCrumbModule,
    TemplateModule,
    SharedModule,
    NgbModule,
    NzNotificationModule,
    NzMessageModule,
    NzCardModule,
    NzTabsModule,
    NgChartsModule,
    HttpClientModule,
    NgxPrintModule
  ],
  providers: [
    {
      provide: NZ_I18N,
      useValue: en_US,
    },
    {
      provide: LocationStrategy,
      useClass: PathLocationStrategy
    },
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    ThemeConstantService
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
