import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptionsArgs } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs';
import { environment } from '../environments/environment';
import 'rxjs/Rx';
import 'rxjs/add/operator/mergeMap';

import { Category } from './category';

@Injectable()
export class ApiService {
  private baseUrl: string;
  private requestOptionsArgs: RequestOptionsArgs;
  private headers: Headers;
  private cachedCategories: Array<Category>;
  private cachedCategoryMeasures = [];
  private cachedMeasurementSeries = [];

  constructor(private http: Http) {
    this.baseUrl = environment["apiUrl"];
    this.headers = new Headers();
    this.headers.append('Authorization', 'Bearer -VI_yuv0UzZNy4av1SM5vQlkfPK_JKnpGfMzuJR7d0M=');
    this.requestOptionsArgs = { headers: this.headers };
  }

  //  Get data from API

  // Gets all available categories. Used for navigation & displaying sublists
  fetchCategories(): Observable<Category[]> {
    if (this.cachedCategories) {
      return of(this.cachedCategories);
    } else {
      let categories$ = this.http.get(`${this.baseUrl}/category?u=DBEDT`, this.requestOptionsArgs)
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
      return of(this.cachedCategoryMeasures[id]);
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
      return of(this.cachedMeasurementSeries[id]);
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
function mapCategories(response: Response): Array<Category> {
  const categories = response.json().data;
  const dataMap = categories.reduce((map, value) => (map[value.id] = value, map), {});
  const categoryTree = [];
  categories.forEach((value) => {
    const parent = dataMap[value.parentId];
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
  const data = response.json().data;
  return data;
}
