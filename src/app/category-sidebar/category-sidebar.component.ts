import { Component, OnInit, OnDestroy, Output, EventEmitter, ViewEncapsulation } from '@angular/core';

import { ApiService } from '../api.service';
import { TreeNode } from 'primeng/api';
import { TreeNodeSelectEvent } from 'primeng/tree';
import { Subscription } from 'rxjs';
import { Category } from 'app/category';
import { faCaretRight, faCaretDown } from '@fortawesome/free-solid-svg-icons';

interface CustomTreeNode extends TreeNode {
  parentId: number;
  id: number;
  name: string;
  parent: CustomTreeNode;
  children: CustomTreeNode[];
  isIndicator: boolean;
}

interface CustomTreeNodeEvent extends TreeNodeSelectEvent {
  node: CustomTreeNode;
}

@Component({
  selector: 'app-category-sidebar',
  templateUrl: './category-sidebar.component.html',
  styleUrls: ['./category-sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CategorySidebarComponent implements OnInit, OnDestroy {
  private categorySubscription: Subscription;
  categories: Category[];
  public ids: Array<any> = [];
  // Emit ids of selected categories to app.component
  @Output() selectedCatIds = new EventEmitter();
  selectedNodes: CustomTreeNode[];
  faCaretRight = faCaretRight;
  faCaretDown = faCaretDown;

  constructor(private _apiService: ApiService) { }

  ngOnInit() {
    this.categorySubscription = this._apiService.fetchCategories().subscribe((data) => {
      this.categories = data;
      console.log(data)
    });
  }

  ngOnDestroy() {
    this.categorySubscription.unsubscribe();
  }

  nodeExpand(event: CustomTreeNodeEvent) {
    const { node } = event;
    const { children, id } = node;
    if (!children) {
      this._apiService.fetchCategoryMeasures(id).subscribe((data) => {
        node.children = data.map((d: CustomTreeNode) => {
          return { ...d, key: d.id, label: d.name, isIndicator: true };
        });
      });
    }
  }

  nodeSelect(event: CustomTreeNodeEvent, categories: Category[]) {
    const { node } = event;
    if (!node.isIndicator) {
      node.expanded = !node.expanded;
    }
    if (node.parent && !node.isIndicator) {
      this.nodeExpand(event);
    }
    if (node.isIndicator) {
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
      this.selectedCatIds.emit(this.ids);
    }
  }

  nodeSelectionChange(nodes: CustomTreeNode[]) {
    // All parent nodes (i.e. major category and subcategory) should be highlighted
    // for a selected indicator
    const indicators = nodes.filter(node => node.isIndicator);
    const parentNodes = indicators.reduce((list, currentInd) => {
      list.push(currentInd.parent);
      list.push(currentInd.parent.parent);
      return list;
    }, []);
    this.selectedNodes = [...parentNodes, ...indicators];
  }

  nodeUnselect(event: CustomTreeNodeEvent) {
    const { node } = event;
    if (!node.isIndicator) {
      node.expanded = !node.expanded;
      return;
    }
    const deactivated = this.ids.find(id => id.id === node.id);
    const idIndex = this.ids.indexOf(deactivated);
    if (idIndex > -1) {
      // Remove deactivated node from list of ids
      this.ids.splice(idIndex, 1);
      this.selectedCatIds.emit(this.ids);
    }
  }

  nodePosition(indices: number[]) {
    const pad = '00';
    let result = '';
    indices.forEach((index) => {
      const str = '' + index;
      const paddedStr = pad.substring(0, pad.length - str.length) + str;
      result += paddedStr;
    });
    return result;
  }

  collapseAll(categories: Category[]) {
    categories.forEach((category) => {
      category.expanded = false;
      if (category.children) {
        this.collapseAll(category.children);
      }
    });
  }

  // Deactivate nodes when clicking on Clear All Selections
  reset() {
    this.selectedNodes = [];
    this.collapseAll(this.categories);
  }
}
