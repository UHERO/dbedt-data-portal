/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { YearSelectorComponent } from './year-selector.component';

let comp: YearSelectorComponent;
let fixture: ComponentFixture<YearSelectorComponent>;

describe('YearSelectorComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        YearSelectorComponent,
      ],
      imports: [
        FormsModule
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(YearSelectorComponent);
        comp = fixture.componentInstance;
      });
  }));
  tests();
});

function tests() {
  it('should create a month selector instance', async(() => {
    comp.years = ['2000', '2001', '2002', '2003'];
    comp.selectedYear = comp.years[0];
    fixture.detectChanges();
    expect(comp).toBeTruthy();
  }));
}
