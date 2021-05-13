/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { QuarterSelectorComponent } from './quarter-selector.component';

let comp: QuarterSelectorComponent;
let fixture: ComponentFixture<QuarterSelectorComponent>;

describe('QuarterSelectorComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        QuarterSelectorComponent,
      ],
      imports: [
        FormsModule
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(QuarterSelectorComponent);
        comp = fixture.componentInstance;
      });
  }));
  tests();
});

function tests() {
  it('should create a month selector instance', waitForAsync(() => {
    comp.quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
    comp.selectedQuarter = comp.quarters[0];
    fixture.detectChanges();
    expect(comp).toBeTruthy();
  }));
}
