/* tslint:disable:no-unused-variable */

import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { HttpModule, Http, XHRBackend, BaseRequestOptions, ConnectionBackend, Response, ResponseOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import { ApiService } from './api.service';

let backend: MockBackend;
let service: ApiService;
let response: Response;

const mockCategoryData = () => [{
  id: 4,
  name: 'Test Category',
  }, {
  id: 8,
  name: 'Test Subcategory',
  parentId: 4
}];

const mockCategoryMeasures = () => [{
  id: 1000,
  name: 'Test Measurement'
}];

const mockMeasureSeries = () => [{
  id: 150000,
  name: 'T@EST_SERIES',
  title: 'Test Series',
  description: 'Mock response for testing',
  frequency: 'Annual',
  frequencyShort: 'A',
  unitsLabel: 'Thousands',
  unitsLabelShort: 'Thous',
  geography: {
    fips: '15000',
    name: 'State of Hawaii',
    handle: 'HI'
  },
  decimals: 0,
  source_description: 'Source',
  geoFreqs: {
    fips: '15000',
    name: 'State of Hawaii',
    handle: 'HI',
    freqs: [
      {
        freq: 'A',
        label: 'Annual'
      }
    ]
  },
  freqGeos: {
    freq: 'A',
    label: 'Annual',
    geos: [
      {
        fips: '15000',
        name: 'State of Hawaii',
        handle: 'HI'
      }
    ]
  }
}];

describe('ApiService', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [
        ApiService,
        { provide: XHRBackend, useClass: MockBackend}
      ]
    })
    .compileComponents();
  }));

  it('can instantiate service when injected', inject([ApiService], (_service: ApiService) => {
    expect(_service instanceof ApiService).toBe(true);
  }));

  describe('fetchCategories', () => {
    beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
      backend = be;
      service = new ApiService(http);
      const mockCategories = mockCategoryData();
      const options = new ResponseOptions({status: 200, body: { data: mockCategories}});
      response = new Response(options);
    }));

    it('should have expected fake categories', waitForAsync(inject([], () => {
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));

      service.fetchCategories()
        .do(categories => {
          expect(categories.length).toBeGreaterThan(0);
        });
    })));
  });

  describe('fetchCategoryMeasures', () => {
    beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
      backend = be;
      service = new ApiService(http);
      const mockSeries = mockCategoryMeasures();
      const options = new ResponseOptions({status: 200, body: { data: mockCategoryMeasures}});
      response = new Response(options);
    }));

    it('should have expected fake category measurement data', waitForAsync(inject([], () => {
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));

      service.fetchCategoryMeasures(1)
        .do(series => {
          expect(series.length).toBeGreaterThan(0);
        });
    })));
  });

  describe('fetchMeasurementSeries', () => {
    beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
      backend = be;
      service = new ApiService(http);
      const mockObservations = mockMeasureSeries();
      const options = new ResponseOptions({status: 200, body: { data: mockMeasureSeries}});
      response = new Response(options);
    }));

    it('should have expected fake measurement series data', waitForAsync(inject([], () => {
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));

      service.fetchMeasurementSeries(1)
        .do(observations => {
          expect(observations).toBe(true);
        });
    })));
  });
});
