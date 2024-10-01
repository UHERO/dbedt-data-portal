import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ApiService } from './api.service';
import { HelperService } from './helper.service';
import { AppComponent } from './app.component';
import { CategorySidebarComponent } from './category-sidebar/category-sidebar.component';
import { TreeModule } from 'primeng/tree';
import { GeoSelectorComponent } from './geo-selector/geo-selector.component';
import { FreqSelectorComponent } from './freq-selector/freq-selector.component';
import { IndicatorTableComponent } from './indicator-table/indicator-table.component';
import { RequestCache } from './request-cache';
import { CacheInterceptor } from './cache.interceptor';
import { DateRangeSelectorComponent } from './date-range-selector/date-range-selector.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DataTablesModule } from 'angular-datatables';

@NgModule({ declarations: [
        AppComponent,
        CategorySidebarComponent,
        GeoSelectorComponent,
        FreqSelectorComponent,
        FreqSelectorComponent,
        IndicatorTableComponent,
        DateRangeSelectorComponent
    ],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        DataTablesModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        TreeModule,
        FontAwesomeModule
    ],
    providers: [
        ApiService,
        HelperService,
        RequestCache,
        { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true },
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class AppModule { }
