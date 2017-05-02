import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild, ViewEncapsulation } from '@angular/core';

import { ApiService } from '../api.service';
import { Category } from '../category';
import { TREE_ACTIONS, IActionMapping, TreeComponent, TreeNode } from 'angular2-tree-component';

const actionMapping: IActionMapping = {
  mouse: {
    click: TREE_ACTIONS.TOGGLE_SELECTED_MULTI,
    expanderClick: TREE_ACTIONS.TOGGLE_SELECTED_MULTI
  }
};

@Component({
  selector: 'app-category-sidebar',
  templateUrl: './category-sidebar.component.html',
  styleUrls: ['./category-sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CategorySidebarComponent implements OnInit, OnDestroy {
  private categories: Array<Category>;
  private subCategories; // Subscription to categories
  public nodes;
  private ids: Array<any> = [];
  private error: string;
  public options;
  // Emit ids of selected categories to app.component
  @Output() selectedCatIds = new EventEmitter();
  @ViewChild(TreeComponent)
  private tree: TreeComponent;

  constructor(private _apiService: ApiService) { }

  ngOnInit() {
    this.subCategories = this._apiService.fetchCategories().subscribe((categories) => {
      categories.forEach((category) => {
        category.children.forEach((child) => {
          child.hasChildren = true;
        });
      });
      this.nodes = categories;
    });

    this.options = {
      getChildren: (node: TreeNode) => {
        const children = [];
        return this._apiService.fetchCategoryMeasures(node.id).toPromise();
      },
      actionMapping
    };
  }

  ngOnDestroy() {
    this.subCategories.unsubscribe();
  }

  activateNode(e) {
    if (e.node.hasChildren) {
      e.node.expand();
    }
    if (!e.node.hasChildren) {
      const indicator = this.tree.treeModel.getNodeById(e.node.id);
      const subcategory = $(indicator.parent.elementRef.nativeElement);
      const category = $(indicator.parent.parent.elementRef.nativeElement);
      // Bold the text of the subcategory and top level category when selecting an indicator
      this.addBold(subcategory, category);
      this.ids.push(e.node.id);
      setTimeout(() => {
        this.selectedCatIds.emit(this.ids);
      }, 20);
    }
  }

  addBold(subcategory, category) {
    const ignoreClasses = '.toggle-children-wrapper, .toggle-children, .toggle-children-placeholder';
    subcategory.find('span').not(ignoreClasses).first().addClass('bold-selected');
    category.find('span').not(ignoreClasses).first().addClass('bold-selected');
  }

  deactivateNode(e) {
    if (e.node.hasChildren) {
      e.node.collapse();
    }
    if (!e.node.hasChildren) {
      const indicator = this.tree.treeModel.getNodeById(e.node.id);
      const subcategory = indicator.parent;
      const activeIndicator = this.checkActiveIndicators(subcategory);
      const category = indicator.parent.level === 1 ? indicator.parent : indicator.parent.parent;
      if (!activeIndicator) {
        const span = $(category.elementRef.nativeElement).find('span').removeClass('bold-selected');
      }
      const idIndex = this.ids.indexOf(e.node.id);
      if (idIndex > -1) {
        this.ids.splice(idIndex, 1);
        setTimeout(() => {
          this.selectedCatIds.emit(this.ids);
        }, 20);
      }
    }
  }

  checkActiveIndicators(subcategory) {
    let activeIndicator = false;
    if (subcategory.children) {
      subcategory.children.forEach((indicator) => {
        if (indicator.isActive) {
          activeIndicator = true;
        }
      });
    }
    return activeIndicator;
  }

  // Deactivate nodes when clicking on Clear All Selections
  reset() {
    const active = this.tree.treeModel.activeNodes;
    if (active) {
      active.forEach((node) => {
        node.setIsActive(false);
        node.blur();
      });
    }
  }
}
