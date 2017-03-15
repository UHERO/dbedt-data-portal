import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptionsArgs } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import 'rxjs/add/operator/mergeMap';

import { Category } from './category';
import { CategoryTree } from './category-tree';
import { Series } from './series';
import { Frequency } from './frequency';
import { Geography } from './geography';

@Injectable()
export class ApiService {
  private baseUrl: string;
  private requestOptionsArgs: RequestOptionsArgs;
  private headers: Headers;
  private cachedCategories;
  private cachedGeos = [];
  private cachedFreqs = [];
  private cachedExpanded = [];
  private cachedSelectedCategory = [];
  private cachedGeoSeries = [];
  private cachedObservations = [];
  private cachedSeries = [];
  private cachedSeriesDetail = [];
  private cachedSiblings = [];
  private cachedSiblingFreqs = [];
  private cachedSiblingGeos = [];
  private cachedSearchExpand = [];
  private cachedSearchFilters = [];

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

  fetchCatGeos(id: number): Observable<Geography[]> {
    if (this.cachedGeos[id]) {
      return Observable.of(this.cachedGeos[id]);
    } else {
      let geos$ = this.http.get(`${this.baseUrl}/category/geo?id=` + id, this.requestOptionsArgs)
        .map(mapData)
        .do(val => {
          this.cachedGeos[id] = val;
          geos$ = null;
        });
      return geos$;
    }
  }

  fetchCatFreqs(id: number): Observable<Frequency[]> {
    if (this.cachedFreqs[id]) {
      return Observable.of(this.cachedFreqs[id]);
    } else {
      let freqs$ = this.http.get(`${this.baseUrl}/category/freq?id=` + id, this.requestOptionsArgs)
        .map(mapData)
        .do(val => {
          this.cachedFreqs[id] = val;
          freqs$ = null;
        });
      return freqs$;
    }
  }

  // Gets observations for series in a (sub) category
  fetchExpanded(id: number, geo: string, freq: string): Observable<any> {
    if (this.cachedExpanded[id + geo + freq]) {
      return Observable.of(this.cachedExpanded[id + geo + freq]);
    } else {
      let expanded$ = this.http.get(`${this.baseUrl}/category/series?id=` + id + `&geo=` + geo + `&freq=` + freq + `&expand=true`, this.requestOptionsArgs)
        .map(mapData)
        .do(val => {
          this.cachedExpanded[id + geo + freq] = val;
          expanded$ = null;
        });
      return expanded$;
    }
  }

  // Gets a particular category. Used to identify a category's date ranges
  fetchSelectedCategory(id: number): Observable<Category> {
    if (this.cachedSelectedCategory[id]) {
      return Observable.of(this.cachedSelectedCategory[id]);
    } else {
      let selectedCat$ = this.http.get(`${this.baseUrl}/category?id=` + id, this.requestOptionsArgs)
        .map(mapData)
        .do(val => {
          this.cachedSelectedCategory[id] = val;
          selectedCat$ = null;
        });
      return selectedCat$;
    }
  }

  fetchSeries(id: number): Observable<Series[]> {
    if (this.cachedSeries[id]) {
      return Observable.of(this.cachedSeries[id]);
    } else {
      let series$ = this.http.get(`${this.baseUrl}/category/series?id=` + id, this.requestOptionsArgs)
        .map(mapData)
        .do(val => {
          this.cachedSeries[id] = val;
          series$ = null;
        });
      return series$;
    }
  }

  // Gets data for a particular series. Used for single series view.
  fetchSeriesDetail(id: number): Observable<Series> {
    if (this.cachedSeriesDetail[id]) {
      return Observable.of(this.cachedSeriesDetail[id]);
    } else {
      let seriesDetail$ = this.http.get(`${this.baseUrl}/series?id=` + id, this.requestOptionsArgs)
        .map(mapData)
        .do(val => {
          this.cachedSeriesDetail[id] = val;
          seriesDetail$ = null;
        });
      return seriesDetail$;
    }
  }

  // Get list of siblings for a particular series
  fetchSeriesSiblings(seriesId: number): Observable<Series[]> {
    if (this.cachedSiblings[seriesId]) {
      return Observable.of(this.cachedSiblings[seriesId]);
    } else {
      let seriesSiblings$ = this.http.get(`${this.baseUrl}/series/siblings?id=` + seriesId, this.requestOptionsArgs)
        .map(mapData)
        .do(val => {
          this.cachedSiblings[seriesId] = val;
          seriesSiblings$ = null;
        });
      return seriesSiblings$;
    }
  }

  // Get available frequencies for a series' siblings
  fetchSiblingFreqs(seriesId: number): Observable<Frequency[]> {
    if (this.cachedSiblingFreqs[seriesId]) {
      return Observable.of(this.cachedSiblingFreqs[seriesId]);
    } else {
      let siblingFreqs$ = this.http.get(`${this.baseUrl}/series/siblings/freq?id=` + seriesId, this.requestOptionsArgs)
        .map(mapData)
        .do(val => {
          this.cachedSiblingFreqs[seriesId] = val;
          siblingFreqs$ = null;
        });
      return siblingFreqs$;
    }
  }

  // Get available geographies for a series' siblings
  fetchSiblingGeos(seriesId: number): Observable<Geography[]> {
    if (this.cachedSiblingGeos[seriesId]) {
      return Observable.of(this.cachedSiblingGeos[seriesId]);
    } else {
      let siblingGeos$ = this.http.get(`${this.baseUrl}/series/siblings/geo?id=` + seriesId, this.requestOptionsArgs)
        .map(mapData)
        .do(val => {
          this.cachedSiblingGeos[seriesId] = val;
          siblingGeos$ = null;
        });
      return siblingGeos$;
    }
  }

  fetchGeoSeries(id: number, handle: string): Observable<Series[]> {
    if (this.cachedGeoSeries[id + handle]) {
      return Observable.of(this.cachedGeoSeries[id + handle]);
    } else {
      let geoSeries$ = this.http.get(`${this.baseUrl}/category/series?id=` + id + `&geo=` + handle, this.requestOptionsArgs)
        .map(mapData)
        .do(val => {
          this.cachedGeoSeries[id + handle] = val;
          geoSeries$ = null;
        });
      return geoSeries$;
    }
  }

  // Gets observation data for a series
  fetchObservations(id: number) {
    if (this.cachedObservations[id]) {
      return Observable.of(this.cachedObservations[id]);
    } else {
      let observations$ = this.http.get(`${this.baseUrl}/series/observations?id=` + id, this.requestOptionsArgs)
        .map(mapData)
        .do(val => {
          this.cachedObservations[id] = val;
          observations$ = null;
        });
      return observations$;
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
    if (category.id === 59) {
      result = category.children;
    }
  })
  return result;
}

function mapData(response: Response): any {
  let data = response.json().data;
  return data;
}
