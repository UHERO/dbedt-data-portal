/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { IndicatorTableComponent } from './indicator-table.component';

let comp: IndicatorTableComponent;
let fixture: ComponentFixture<IndicatorTableComponent>;

describe('IndicatorTableComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        IndicatorTableComponent,
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(IndicatorTableComponent);
        comp = fixture.componentInstance;
      });
  }));
  tests();
});

function tests() {
  it('should create a table instance', waitForAsync(() => {
    expect(comp).toBeTruthy();
  }));
}
