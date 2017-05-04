/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { IndicatorTableComponent } from './indicator-table.component';

let comp: IndicatorTableComponent;
let fixture: ComponentFixture<IndicatorTableComponent>;

describe('IndicatorTableComponent', () => {
  beforeEach(async(() => {
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
  it('should create a table instance', async(() => {
    expect(comp).toBeTruthy();
  }));
}
