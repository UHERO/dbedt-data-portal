import { Component, OnInit, Output, EventEmitter, ViewEncapsulation } from '@angular/core';

import { ApiService } from '../api.service';
import { CategoryTree } from '../category-tree';
import { TREE_ACTIONS, IActionMapping } from 'angular2-tree-component';

const actionMapping: IActionMapping = {
  mouse: {
    click: TREE_ACTIONS.TOGGLE_SELECTED_MULTI
  }
}

@Component({
  selector: 'app-category-sidebar',
  templateUrl: './category-sidebar.component.html',
  styleUrls: ['./category-sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None 
})
export class CategorySidebarComponent implements OnInit {
  private categories: CategoryTree;
  private ids: Array<any> = [];
  private error: string;
  // Emit ids of selected categories to app.component
  @Output() selectedCatIds = new EventEmitter();

  constructor(private _apiService: ApiService) { }

  ngOnInit() {
    this._apiService.fetchCategories().subscribe((cats) => {
      this.categories = cats;
    },
      (error) => {
        this.error = error;
      });
  }

  customOptions = {
    actionMapping
  }

  activateNode(e) {
    if (e.node.hasChildren) {
      console.log('parent selected', e)
      e.node.expand();
    }
    if (!e.node.hasChildren) {
      console.log('child selected', e)
      this.ids.push(e.node.id);
      this.selectedCatIds.emit(this.ids);
    }
  }

  deactivateNode(e) {
    if (e.node.hasChildren) {
      e.node.collapse();
      e.node.children.forEach((child) => {
        if (child.isActive) {
          //e.node.focus();
          child.treeModel.setFocusedNode(e.node);
        }
      });
    }
    if (!e.node.hasChildren) {
      let idIndex = this.ids.indexOf(e.node.id);
      if (idIndex > -1) {
        this.ids.splice(idIndex, 1);
        this.selectedCatIds.emit(this.ids);
      }
    }
  }
}
