import { Component, AfterViewInit, ViewChild } from '@angular/core';

import { ApiService } from './api.service';
import { HelperService } from './helper.service';
import { dateWrapper } from './date-wrapper';
import { Geography } from './geography';
import { Frequency } from './frequency';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  // List of series selected from category-tree
  private selectedSeries: Array<number>;

  // List of regions and freqeuencies for the selected series/categories
  private geoList: Array<Geography>;
  private freqList: Array<Frequency>;
  private regions: Array<Geography> = [];
  private frequencies: Array<Frequency> = [];

  // List of selected regions and frequencies
  private selectedGeos: Array<string> = [];
  private selectedFreqs: Array<string> = [];

  private annualSelected: Boolean = false;
  private quarterSelected: Boolean = false;
  private monthSelected: Boolean = false;

  private startDates: Array<string>;
  private endDates: Array<string>;
  private dateWrapper: dateWrapper = { firstDate: '', endDate: '' };

  constructor(private _apiService: ApiService, private _helper: HelperService) { }

  getSelectedSeries(e) {
    this.geoList = [];
    this.freqList = [];
    this.startDates = [];
    this.endDates = [];
    this.selectedSeries = e;
    if (!this.selectedSeries.length) {
      // Clear selections when all series/categories are deselected
      this.selectedGeos = [];
      this.selectedFreqs = [];
    }
    this.selectedSeries.forEach((el, index) => {
      this._apiService.fetchSelectedCategory(el).subscribe((category) => {
        let geo_freqs = category.geo_freqs;
        let freq_geos = category.freq_geos;
        let obsStart = category.observationStart.substr(0, 10);
        let obsEnd = category.observationEnd.substr(0, 10);
        this.startDates.push(obsStart);
        this.endDates.push(obsEnd);
        geo_freqs.forEach((geo, index) => {
          this._helper.uniqueGeos(geo, this.geoList);
        });
        freq_geos.forEach((freq, index) => {
          this._helper.uniqueFreqs(freq, this.freqList);
        });
      });
    });
    this.regions = this.geoList;
    this.frequencies = this.freqList;
    this.startDates.forEach((date, index) => {
      if (this.dateWrapper.firstDate === '' || this.dateWrapper.firstDate > date) {
        this.dateWrapper.firstDate = date;
      }
    });
    this.endDates.forEach((date, index) => {
      if (this.dateWrapper.endDate === '' || this.dateWrapper.endDate < date) {
        this.dateWrapper.endDate = date;
      }
    });
    console.log('date wrapper', this.dateWrapper);
  }

  geoChange(e) {
    this.frequencies = [];
    this.selectedGeos = e;
    if (this.selectedFreqs.length) {
      this.getSeries(this.selectedSeries, this.selectedGeos, this.selectedFreqs);
    }
    if (this.selectedGeos.length) {
      this.selectedGeos.forEach((selected, index) => {
        // Update list of frequencies based on selected regions
        this._helper.checkSelectedGeoFreqs(selected, this.geoList, this.frequencies);
      });
      this.selectedFreqs.forEach((selected, index) => {
        // Update list of selected frequencies if selection does not exist in dropdown
        this._helper.checkSelectedList(selected, index, this.frequencies, this.selectedFreqs);
      });
    } else {
      // If no frequencies are selected reset list of frequencies
      this.selectedFreqs = [];
      this.frequencies = this.freqList;
    }
  }

  freqChange(e) {
    this.regions = [];
    this.selectedFreqs = e;
    if (this.selectedGeos.length) {
      this.getSeries(this.selectedSeries, this.selectedGeos, this.selectedFreqs);
    }
    if (this.selectedFreqs.length) {
      this.selectedFreqs.forEach((selected, index) => {
        // Update list of geographies based on selected frequencies
        this._helper.checkSelectedFreqGeos(selected, this.freqList, this.regions);
      });
      this.selectedGeos.forEach((selected, index) => {
        // Update list of selected geographies if selection does not exist in dropdown
        this._helper.checkSelectedList(selected, index, this.regions, this.selectedGeos);
      });
      let aIndex = this.selectedFreqs.indexOf('A');
      let qIndex = this.selectedFreqs.indexOf('Q');
      let mIndex = this.selectedFreqs.indexOf('M');
      this.annualSelected = aIndex > -1 ? true : false;
      this.quarterSelected = qIndex > -1 ? true : false;
      this.monthSelected = mIndex > -1 ? true : false;
    } else {
      // If no geographies are selected, reset list of regions
      this.selectedGeos = [];
      this.regions = this.geoList;
      this.annualSelected = false;
      this.quarterSelected = false;
      this.monthSelected = false;
    }
  }

  getSeries(selectedSeries, selectedGeos, selectedFreqs) {
    selectedSeries.forEach((serie, index) => {
      selectedGeos.forEach((geo, index) => {
        selectedFreqs.forEach((freq, index) => {
          this._apiService.fetchExpanded(serie, geo, freq).subscribe((series) => {
            console.log('series', series);
          });
        });
      });
    });
  }
}
