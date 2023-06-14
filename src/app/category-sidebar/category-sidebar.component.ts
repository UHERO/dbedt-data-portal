import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild, ViewEncapsulation } from '@angular/core';

import { ApiService } from '../api.service';
import { Category } from '../category';
import { TREE_ACTIONS, IActionMapping, TreeComponent, TreeNode } from '@circlon/angular-tree-component';
declare var $: any;
import { mergeMap, switchMap, map, tap } from 'rxjs/operators';
import { forkJoin, observable, of } from 'rxjs';

const actionMapping: IActionMapping = {
  mouse: {
    click: TREE_ACTIONS.TOGGLE_ACTIVE_MULTI,
    expanderClick: TREE_ACTIONS.TOGGLE_ACTIVE_MULTI
  }
};

@Component({
  selector: 'app-category-sidebar',
  templateUrl: './category-sidebar.component.html',
  styleUrls: ['./category-sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CategorySidebarComponent implements OnInit, OnDestroy {
  private subCategories; // Subscription to categories
  categories;
  public nodes;
  public ids: Array<any> = [];
  private error: string;
  public options;
  // Emit ids of selected categories to app.component
  @Output() selectedCatIds = new EventEmitter();
  @ViewChild(TreeComponent, { static: true })
  public tree: TreeComponent;

  constructor(private _apiService: ApiService) { }

  ngOnInit() {
    /* this.subCategories = this._apiService.fetchCategories().subscribe((categories) => {
      categories.forEach((category) => {
        category.children.forEach((child) => {
          child.hasChildren = true;
        });
      });
      console.log('categories', categories)
      this.nodes = categories;
    });

    this.options = {
      getChildren: (node: TreeNode) => {
        console.log(node)
        return this._apiService.fetchCategoryMeasures(node.id).toPromise();
      },
      actionMapping
    }; */
    this._apiService.fetchCategories().subscribe((data) => {
      this.categories = data;
    });
  }

  ngOnDestroy() {
    this.subCategories.unsubscribe();
  }

  nodeExpand(event) {
    console.log(event)
    if (!event.node.children) {
      console.log('event.node', event.node)
      this._apiService.fetchCategoryMeasures(event.node.id).subscribe((data) => {
        event.node.children = data.map((d) => {
          return { ...d, key: d.id, label: d.name }
        });
      });
    }
  }

  nodeSelect(event, categories) {
    const { node } = event;
    console.log('categories', categories)
    if (!node.parent) {
      categories.find(category => category.id === node.id).expanded = true;
      this.categories = [...categories]
    }
    if (!node.children && node.leaf === false) {
      const parentCategory = categories.find(category => category.id === node.parentId);
      parentCategory.expanded = true;
      parentCategory.children.find(subcategory => subcategory.id === node.id).expanded = true;
      this.nodeExpand(event);
      this.categories = [...categories]
    }
    if (!event.node.children && node.leaf !== false) {
      console.log('select event', event)
      const node = event.node;
      // create tracking for node position, used for table ordering
      const { parentId: categoryId, id: subcategoryId } = node.parent;
      const indicatorId = node.id;
      const categoryIndex = categories.findIndex(node => node.id === categoryId);
      const subcatIndex = categories[categoryIndex]
        .children
        .findIndex(node => node.id === subcategoryId);
      const indicatorIndex = categories[categoryIndex]
        .children[subcatIndex]
        .children
        .findIndex(node => node.id === indicatorId);
      const indices = [categoryIndex, subcatIndex, indicatorIndex];
      const position = this.nodePosition(indices);
      if (!this.ids.find(({ id }) => id === node.id)) {
        this.ids.push({id: node.id, position });
      }
      console.log(this.ids)
        setTimeout(() => {
          this.selectedCatIds.emit(this.ids);
        }, 20);
    }
    
  }

  activateNode(e) {
    if (e.node.hasChildren) {
      e.node.expand();
    }
    if (!e.node.hasChildren) {
      const indicator = this.tree.treeModel.getNodeById(e.node.id);
      const subcategory = $(`tree-node-content > span:contains(${indicator.parent.data.name})`);
      const category = $(`tree-node-content > span:contains(${indicator.parent.parent.data.name})`);
      // create tracking for node position, used for table ordering
      const indices = [];
      const categoryId = e.node.parent.parent.data.id;
      const subcategoryId = e.node.parent.data.id;
      const indicatorId = e.node.data.id;
      const tree = e.node.treeModel.nodes;
      const cat = tree.find(node => node.id === categoryId);
      const subcat = cat.children.find(node => node.id === subcategoryId);
      const ind = subcat.children.find(node => node.id === indicatorId);
      indices.push(tree.indexOf(cat));
      indices.push(cat.children.indexOf(subcat));
      indices.push(subcat.children.indexOf(ind));
      const position = this.nodePosition(indices);
      // Bold the text of the subcategory and top level category when selecting an indicator
      this.toggleBoldClass(subcategory, category, this.addBold)
      this.ids.push({id: e.node.id, position: position});
      setTimeout(() => {
        this.selectedCatIds.emit(this.ids);
      }, 20);
    }
  }

  nodePosition(indices) {
    const pad = '00';
    let result = '';
    indices.forEach((index) => {
      const str = '' + index;
      const paddedStr = pad.substring(0, pad.length - str.length) + str;
      result += paddedStr;
    });
    return result;
  }

  removeBold(subcategoryElement, categoryElement) {
    subcategoryElement.removeClass('bold-selected');
    categoryElement.removeClass('bold-selected');
  }

  addBold(subcategoryElement, categoryElement) {
    subcategoryElement.addClass('bold-selected');
    categoryElement.addClass('bold-selected');
  }

  toggleBoldClass(subcategory, category, callback) {
    const ignoreClasses = '.toggle-children-wrapper, .toggle-children, .toggle-children-placeholder';
    callback(subcategory.not(ignoreClasses).first(), category.not(ignoreClasses).first());
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
        const subcategoryLabel = $(`tree-node-content > span:contains(${subcategory.data.name})`);
        const categoryLabel = $(`tree-node-content > span:contains(${category.data.name})`);
        this.toggleBoldClass(subcategoryLabel, categoryLabel, this.removeBold);
      }
      const deactivated = this.ids.find(id => id.id === e.node.id);
      const idIndex = this.ids.indexOf(deactivated);
      if (idIndex > -1) {
        // Remove deactivated node from list of ids
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
      $('.bold-selected').removeClass('bold-selected');
      active.forEach((node) => {
        node.setIsActive(false);
        node.blur();
      });
    }
  }
}
