/* tslint:disable:no-unused-variable */

import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { Component, Directive, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { ApiService } from './api.service';
import { MockApiService } from '../testing/mockapi-service';
import { HelperService } from './helper.service';

@Component({ selector: 'app-category-sidebar', template: '' })
class CategorySidebarStubComponent { }

@Directive({
  selector: 'Tree'
})
class MockTreeDirective {
  @Input() nodes;
  @Input() options;
}

@Directive({
  selector: 'app-geo-selector'
})
class MockGeoSelectorDirective {
  @Input() regions;
  @Input() selectedGeos;
}

@Directive({
  selector: 'app-freq-selector'
})
class MockFreqSelectorDirective {
  @Input() freqs;
  @Input() selectedFreqs;
}

@Directive({
  selector: 'app-year-selector'
})
class MockYearSelectorDirective {
  @Input() years;
  @Input() selectedYear;
  @Input() rangeLabel;
}

@Directive({
  selector: 'app-quarter-selector'
})
class MockQuarterSelectorDirective {
  @Input() quarters;
  @Input() selectedQuarter;
}

@Directive({
  selector: 'app-month-selector'
})
class MockMonthSelectorDirective {
  @Input() months;
  @Input() selectedMonth;
}

@Directive({
  selector: 'app-indicator-table'
})
class MockIndicatorTableDirective {
  @Input() dateArray;
  @Input() tableData;
  @Input() datesSelected;
}
let comp: AppComponent;
let fixture: ComponentFixture<AppComponent>

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        CategorySidebarStubComponent,
        MockGeoSelectorDirective,
        MockFreqSelectorDirective,
        MockYearSelectorDirective,
        MockQuarterSelectorDirective,
        MockMonthSelectorDirective,
        MockIndicatorTableDirective,
        MockTreeDirective
      ],
      imports: [
        FormsModule
      ],
      providers: [
        { provide: ApiService, useClass: MockApiService },
        HelperService
      ]
    })
    .compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(AppComponent);
      comp = fixture.componentInstance;
    });
  }));
  tests();
});

function tests() {
  it('should create the app', async(() => {
    expect(comp).toBeTruthy();
  }));
}