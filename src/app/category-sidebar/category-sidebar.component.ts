import { Component, OnInit, OnDestroy, Input, Output, OnChanges, EventEmitter, ViewChild, ViewEncapsulation } from '@angular/core';

import { ApiService } from '../api.service';
import { CategoryTree } from '../category-tree';
import { TREE_ACTIONS, IActionMapping, TreeComponent, TreeNode } from 'angular2-tree-component';

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
  private subCategories; // Subscription to categories
  private nodes;
  private ids: Array<any> = [];
  private error: string;
  private options;
  // Emit ids of selected categories to app.component
  @Output() selectedCatIds = new EventEmitter();
  @Input() reset;
  @ViewChild(TreeComponent)
  private tree: TreeComponent

  constructor(private _apiService: ApiService) { }

  ngOnInit() {
    this.subCategories = this._apiService.fetchCategories().subscribe((categories) => {
      categories.forEach((category) => {
        category.children.forEach((child) => {
          child.hasChildren = true;
        });
      });
      this.nodes = categories
    });

    this.options = {
      getChildren: (node: TreeNode) => {
        let children = [];
        return this._apiService.fetchCategoryMeasures(node.id).toPromise();
      },
      actionMapping
    }
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

  activateNode(e) {
    if (e.node.hasChildren) {
      //e.node.expand();
    }
    if (!e.node.hasChildren) {
      this.ids.push(e.node.id);
      this.selectedCatIds.emit(this.ids);
    }
  }

  deactivateNode(e) {
    if (e.node.hasChildren) {
      //e.node.collapse();
      /* let activeNodes = e.node.treeModel.activeNodes;
      activeNodes.forEach((node) => {
        if (!node.hasChildren) {
          console.log('node', node);
          console.log('focus');
          node.treeModel.focusDrillUp();
          //node.parent.focus(true);
        }
      }); */
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
