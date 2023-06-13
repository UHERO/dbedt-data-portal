import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ApiService } from './api.service';
import { HelperService } from './helper.service';
import { AppComponent } from './app.component';
import { CategorySidebarComponent } from './category-sidebar/category-sidebar.component';
import { TreeModule } from '@circlon/angular-tree-component';
import { TreeModule as PrimeTree } from 'primeng/tree';
import { GeoSelectorComponent } from './geo-selector/geo-selector.component';
import { FreqSelectorComponent } from './freq-selector/freq-selector.component';
import { YearSelectorComponent } from './year-selector/year-selector.component';
import { QuarterSelectorComponent } from './quarter-selector/quarter-selector.component';
import { MonthSelectorComponent } from './month-selector/month-selector.component';
import { IndicatorTableComponent } from './indicator-table/indicator-table.component';
import { RequestCache } from './request-cache';
import { CacheInterceptor } from './cache.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    CategorySidebarComponent,
    GeoSelectorComponent,
    FreqSelectorComponent,
    FreqSelectorComponent,
    YearSelectorComponent,
    QuarterSelectorComponent,
    MonthSelectorComponent,
    IndicatorTableComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    TreeModule,
    PrimeTree
  ],
  providers: [
    ApiService,
    HelperService,
    RequestCache,
    { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
