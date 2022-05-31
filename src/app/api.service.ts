import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs';
import { environment } from '../environments/environment';
import 'rxjs/Rx';
import 'rxjs/add/operator/mergeMap';

import { Category } from './category';

@Injectable()
export class ApiService {
  private baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = environment['apiUrl'];
  }

  //  Get data from API
  // Gets all available categories. Used for navigation & displaying sublists
  fetchCategories(): Observable<Category[]> {
    let categories$ = this.http.get(`${this.baseUrl}/category?u=DBEDT`).pipe(
      map(mapCategories, this),
      tap(val => {
        categories$ = null;
      }), );
    return categories$;
  }

  // Gets measurements belonging to each category
  fetchCategoryMeasures(id: number): Observable<any> {
    let categoryMeasures$ = this.http.get(`${this.baseUrl}/category/measurements?id=${id}`).pipe(
      map(mapData),
      tap(val => {
        categoryMeasures$ = null;
      }), );
    return categoryMeasures$;
  }

  fetchMeasurementSeries(id: number): Observable<any> {
    let measurementSeries$ = this.http.get(`${this.baseUrl}/measurement/series?id=${id}&expand=true`).pipe(
      map(mapData),
      tap(val => {
        measurementSeries$ = null;
      }), );
    return measurementSeries$;
  }
}

// Create a nested JSON of parent and child categories
// Used for landing-page.component
// And side bar navigation on single-series & table views
function mapCategories(response): Array<Category> {
  const categories = response.data;
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

const mapData = (response): any => response.data;
