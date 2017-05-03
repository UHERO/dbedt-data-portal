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
      // keep track of node position, used for table ordering
      let categoryId = e.node.parent.parent.data.id;
      let subcategoryId = e.node.parent.data.id;
      let indicatorId = e.node.data.id;
      const tree = e.node.treeModel.nodes;
      let cat = tree.find(node => node.id === categoryId);
      let subcat = cat.children.find(node => node.id === subcategoryId);
      let ind = subcat.children.find(node => node.id === indicatorId);
      let catIndex = tree.indexOf(cat);
      let subIndex = cat.children.indexOf(subcat);
      let indIndex = subcat.children.indexOf(ind);
      let position = this.nodePosition(catIndex, subIndex, indIndex);
      // Bold the text of the subcategory and top level category when selecting an indicator
      this.addBold(subcategory, category);
      this.ids.push({id: e.node.id, position: position});
      setTimeout(() => {
        this.selectedCatIds.emit(this.ids);
      }, 20);
    }
  }

  nodePosition(categoryIndex, subcatIndex, indicatorIndex) {
    const pad = '00';
    let cat = '' + categoryIndex;
    let subcat = '' + subcatIndex;
    let ind = '' + indicatorIndex;
    let paddedCat = pad.substring(0, pad.length - cat.length) + cat;
    let paddedSub = pad.substring(0, pad.length - subcat.length) + subcat;
    let paddedInd = pad.substring(0, pad.length - ind.length) + ind;
    return paddedCat + paddedSub + paddedInd;
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
      //const idIndex = this.ids.indexOf(e.node.id);
      const deactivated = this.ids.find(id => id.id === e.node.id);
      const idIndex = this.ids.indexOf(deactivated);
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
