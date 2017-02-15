import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { ApiService } from './api.service';
import { AppComponent } from './app.component';
import { CategorySidebarComponent } from './category-sidebar/category-sidebar.component';
import { TreeModule } from 'angular2-tree-component';
import { MultiSelectModule } from 'primeng/primeng';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect/src/multiselect-dropdown';
import { GeoSelectorComponent } from './geo-selector/geo-selector.component';
import { FreqSelectorComponent } from './freq-selector/freq-selector.component';

@NgModule({
  declarations: [
    AppComponent,
    CategorySidebarComponent,
    GeoSelectorComponent,
    FreqSelectorComponent,
    FreqSelectorComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    TreeModule,
    MultiSelectModule,
    MultiselectDropdownModule
  ],
  providers: [ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
