/* eslint-disable @typescript-eslint/no-unused-vars */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GeoSelectorComponent } from './geo-selector.component';

let comp: GeoSelectorComponent;
let fixture: ComponentFixture<GeoSelectorComponent>;

describe('GeoSelectorComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule ],
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
  it('should create an region selector instance', waitForAsync(() => {
    expect(comp).toBeTruthy();
  }));
}