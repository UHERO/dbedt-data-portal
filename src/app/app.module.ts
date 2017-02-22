import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { ApiService } from './api.service';
import { HelperService } from './helper.service';
import { AppComponent } from './app.component';
import { CategorySidebarComponent } from './category-sidebar/category-sidebar.component';
import { TreeModule } from 'angular2-tree-component';
import { MultiSelectModule } from 'primeng/primeng';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect/src/multiselect-dropdown';
import { GeoSelectorComponent } from './geo-selector/geo-selector.component';
import { FreqSelectorComponent } from './freq-selector/freq-selector.component';
import { YearSelectorComponent } from './year-selector/year-selector.component';
import { QuarterSelectorComponent } from './quarter-selector/quarter-selector.component';
import { MonthSelectorComponent } from './month-selector/month-selector.component';
import { IndicatorTableComponent } from './indicator-table/indicator-table.component';
import { DataTablesModule } from 'angular-datatables';

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
    IndicatorTableComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    TreeModule,
    MultiSelectModule,
    MultiselectDropdownModule,
    DataTablesModule
  ],
  providers: [ApiService, HelperService],
  bootstrap: [AppComponent]
})
export class AppModule { }
