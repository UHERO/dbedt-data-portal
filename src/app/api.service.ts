import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Category } from './category';

@Injectable()
export class ApiService {
  private baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = environment['apiUrl'];
  }

  // Get data from API
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
  const dataMap = mapCategoryIds(categories);
  return buildCategoryTree(categories, dataMap);
}

const mapData = (response): any => response.data;

const mapCategoryIds = (categories: Category[]) => {
  return categories.reduce((map, value) => (map[value.id] = value, map), {})
};

const buildCategoryTree = (categories: Category[], idMap: {}) => {
  const categoryTree = [];
  categories.forEach((value) => {
    const parent = idMap[value.parentId];
    value.label = value.name;
    value.key = value.id;
    value.leaf = false;
    value.expanded = false;
    if (parent) {
      (parent.children || (parent.children = [])).push(value);
    } else {
      categoryTree.push(value);
    }
  });
  return categoryTree;
}
