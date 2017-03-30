/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { GeoSelectorComponent } from './geo-selector.component';

let comp: GeoSelectorComponent;
let fixture: ComponentFixture<GeoSelectorComponent>

describe('GeoSelectorComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        GeoSelectorComponent,
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(GeoSelectorComponent);
        comp = fixture.componentInstance;
      });
  }));
  tests();
});

function tests() {
  it('should create an region selector instance', async(() => {
    expect(comp).toBeTruthy();
  }));
}