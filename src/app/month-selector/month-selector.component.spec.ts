/* eslint-disable @typescript-eslint/no-unused-vars */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { MonthSelectorComponent } from './month-selector.component';

let comp: MonthSelectorComponent;
let fixture: ComponentFixture<MonthSelectorComponent>;

describe('MonthSelectorComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        MonthSelectorComponent,
      ],
      imports: [
        FormsModule
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(MonthSelectorComponent);
        comp = fixture.componentInstance;
      });
  }));
  tests();
});

function tests() {
  it('should create a month selector instance', waitForAsync(() => {
    comp.months = ['01', '02', '03', '04'];
    comp.selectedMonth = comp.months[0];
    fixture.detectChanges();
    expect(comp).toBeTruthy();
  }));
}
