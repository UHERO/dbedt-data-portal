/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FreqSelectorComponent } from './freq-selector.component';

let comp: FreqSelectorComponent;
let fixture: ComponentFixture<FreqSelectorComponent>;

describe('FreqSelectorComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        FreqSelectorComponent,
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(FreqSelectorComponent);
        comp = fixture.componentInstance;
      });
  }));
  tests();
});

function tests() {
  it('should create an frequency selector instance', async(() => {
    expect(comp).toBeTruthy();
  }));
}
