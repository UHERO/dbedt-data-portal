/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CategorySidebarComponent } from './category-sidebar.component';

describe('CategorySidebarComponent', () => {
  let component: CategorySidebarComponent;
  let fixture: ComponentFixture<CategorySidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategorySidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategorySidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
