import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptionsArgs } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import 'rxjs/add/operator/mergeMap';

import { Category } from './category';
import { CategoryTree } from './category-tree';

@Injectable()
export class ApiService {
  private baseUrl: string;
  private requestOptionsArgs: RequestOptionsArgs;
  private headers: Headers;
  private cachedCategories: CategoryTree;
  private cachedCategoryMeasures = [];
  private cachedMeasurementSeries = [];

  constructor(private http: Http) {
    // this.baseUrl = 'http://localhost:8080/v1';
    this.baseUrl = 'http://api.uhero.hawaii.edu/v1';
    this.headers = new Headers();
    this.headers.append('Authorization', 'Bearer -VI_yuv0UzZNy4av1SM5vQlkfPK_JKnpGfMzuJR7d0M=');
    this.requestOptionsArgs = { headers: this.headers };
  }

  //  Get data from API

  // Gets all available categories. Used for navigation & displaying sublists 
  fetchCategories(): Observable<CategoryTree> {
    if (this.cachedCategories) {
      return Observable.of(this.cachedCategories);
    } else {
      let categories$ = this.http.get(`${this.baseUrl}/category`, this.requestOptionsArgs)
        .map(mapCategories)
        .do(val => {
          this.cachedCategories = val;
          categories$ = null;
        });
      return categories$;
    }
  }

  // Gets measurements belonging to each category
  fetchCategoryMeasures(id: number) {
    if (this.cachedCategoryMeasures[id]) {
      return Observable.of(this.cachedCategoryMeasures[id]);
    } else {
      let categoryMeasures$ = this.http.get(`${this.baseUrl}/category/measurements?id=` + id, this.requestOptionsArgs)
        .map(mapData)
        .do(val => {
          this.cachedCategoryMeasures[id] = val;
          categoryMeasures$ = null;
        });
      return categoryMeasures$;
    }
  }

  fetchMeasurementSeries(id: number) {
    if (this.cachedMeasurementSeries[id]) {
      return Observable.of(this.cachedMeasurementSeries[id]);
    } else {
      let measurementSeries$ = this.http.get(`${this.baseUrl}/measurement/series?id=` + id + `&expand=true`, this.requestOptionsArgs)
        .map(mapData)
        .do(val => {
          this.cachedMeasurementSeries[id] = val;
          measurementSeries$ = null;
        });
      return measurementSeries$;
    }
  }
}

// Create a nested JSON of parent and child categories
// Used for landing-page.component
// And side bar navigation on single-series & table views
function mapCategories(response: Response): CategoryTree {
  let categories = response.json().data;
  let dataMap = categories.reduce((map, value) => (map[value.id] = value, map), {});
  let categoryTree = [];
  categories.forEach((value) => {
    let parent = dataMap[value.parentId];
    if (parent) {
      (parent.children || (parent.children = [])).push(value);
    } else {
      categoryTree.push(value);
    }
  });
  let result = categoryTree;
  categoryTree.forEach((category) => {
    if (category.id === 60) {
      result = category.children;
    }
  });
  return result;
}

function mapData(response: Response): any {
  let data = response.json().data;
  return data;
}
