import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { ApiService } from '../api.service';
import { CategoryTree } from '../category-tree';
import { TREE_ACTIONS, IActionMapping } from 'angular2-tree-component';

const actionMapping:IActionMapping = {
    mouse: {
      click: TREE_ACTIONS.TOGGLE_SELECTED_MULTI
    }
}

@Component({
  selector: 'app-category-sidebar',
  templateUrl: './category-sidebar.component.html',
  styleUrls: ['./category-sidebar.component.scss']
})
export class CategorySidebarComponent implements OnInit {
  private categories: CategoryTree;
  private ids: Array<any> = [];
  private error: string;
  @Output() selectedCatIds = new EventEmitter();

  constructor(private _apiService: ApiService) { }

  ngOnInit() {
    this._apiService.fetchCategories().subscribe((cats) => {
      console.log('categories', cats);
      this.categories = cats;
    },
    (error) => {
      this.error = error;
    });
  }

  customOptions = {
    actionMapping
  }

  onEvent(e) {
    console.log('active node event', e);
    if (!e.node.hasChildren) {
      this.ids.push(e.node.id);
      this.selectedCatIds.emit(this.ids);
    }
  }
}
