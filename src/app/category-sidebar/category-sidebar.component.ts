import { Component, OnInit, OnDestroy, Input, Output, OnChanges, EventEmitter, ViewChild, ViewEncapsulation } from '@angular/core';

import { ApiService } from '../api.service';
import { CategoryTree } from '../category-tree';
import { TREE_ACTIONS, IActionMapping, TreeComponent } from 'angular2-tree-component';

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
export class CategorySidebarComponent implements OnInit, OnChanges, OnDestroy {
  private categories: CategoryTree;
  private subCategories;
  private ids: Array<any> = [];
  private error: string;
  // Emit ids of selected categories to app.component
  @Output() selectedCatIds = new EventEmitter();
  @Input() reset;
  @ViewChild(TreeComponent)
  private tree: TreeComponent

  constructor(private _apiService: ApiService) { }

  ngOnInit() {
    this.subCategories = this._apiService.fetchCategories().subscribe((cats) => {
      this.categories = cats;
    },
      (error) => {
        this.error = error;
      });
  }

  ngOnChanges() {
    // If reset === true, deactivate and unfocus (blur) nodes
    if (this.reset === true) {
      let active = this.tree.treeModel.activeNodes;
      if (active) {
        active.forEach((node) => {
          node.setIsActive(false);
          node.blur();
        });
      }
    }
  }

  ngOnDestroy() {
    this.subCategories.unsubscribe();
  }

  customOptions = {
    actionMapping
  }

  activateNode(e) {
    if (e.node.hasChildren) {
      e.node.expand();
    }
    if (!e.node.hasChildren) {
      this.ids.push(e.node.id);
      this.selectedCatIds.emit(this.ids);
    }
  }

  deactivateNode(e) {
    if (e.node.hasChildren) {
      e.node.collapse();
      let activeChild = false;
      e.node.children.forEach((child) => {
        if (child.isActive) {
          activeChild = true;
        }
      });
      if (activeChild) {
        e.node.focus();
      } else {
        e.node.blur();
      }
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
