/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, Directive, Input } from '@angular/core';
import { HttpModule, Http, XHRBackend, BaseRequestOptions, ConnectionBackend, Response, ResponseOptions } from '@angular/http';
import { Observable } from 'rxjs/observable';

import { CategorySidebarComponent } from './category-sidebar.component';
import { TreeModule } from 'angular2-tree-component';
import { TREE_ACTIONS, IActionMapping, TreeComponent, TreeNode } from 'angular2-tree-component';
import { ApiService } from '../api.service';
import { MockApiService } from '../../testing/mockapi-service';
import { HelperService } from '../helper.service';

let comp: CategorySidebarComponent;
let fixture: ComponentFixture<CategorySidebarComponent>;

describe('CategorySidebarComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CategorySidebarComponent,
      ],
      imports: [
        TreeModule
      ],
      providers: [
        { provide: ApiService, useClass: MockApiService },
        HelperService
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(CategorySidebarComponent);
        comp = fixture.componentInstance;
        fixture.detectChanges();
        return fixture.whenStable();
      });
  }));
  tests();
});

function tests() {
  it('should create an instance', async(() => {
    expect(comp).toBeTruthy();
  }));
}
