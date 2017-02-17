import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ApiService } from './api.service';
import { HelperService } from './helper.service';
import { Geography } from './geography';
import { Frequency } from './frequency';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private errorMsg: string;
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

  private startDate: string;
  private endDate: string;
  private selectedStartYear;
  private selectedEndYear;
  private years = [];
  private quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
  private months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

  constructor(private _apiService: ApiService, private _helper: HelperService) { }

  getSelectedSeries(e) {
    this.geoList = [];
    this.freqList = [];
    this.startDate = '';
    this.endDate = '';
    this.selectedSeries = e;
    if (!this.selectedSeries.length) {
      // Clear selections when all series/categories are deselected
      this.selectedGeos = [];
      this.selectedFreqs = [];
    }
    let i = 0;
    this.selectedSeries.forEach((el, index) => {
      this._apiService.fetchSelectedCategory(el).subscribe((category) => {
        i += 1;
        let geo_freqs = category.geo_freqs;
        let freq_geos = category.freq_geos;
        let obsStart = category.observationStart.substr(0, 10);
        let obsEnd = category.observationEnd.substr(0, 10);
        if (this.startDate === '' || this.startDate > obsStart) {
          this.startDate = obsStart;
        }
        if (this.endDate === '' || this.endDate < obsEnd) {
          this.endDate = obsEnd;
        }
        geo_freqs.forEach((geo, index) => {
          this._helper.uniqueGeos(geo, this.geoList);
        });
        freq_geos.forEach((freq, index) => {
          this._helper.uniqueFreqs(freq, this.freqList);
        });
      },
      (error) => {
        this.errorMsg = error;
      },
      () => {
        if (i === this.selectedSeries.length) {
          this.frequencies = this.freqList;
          this.regions = this.geoList;
          if (this.selectedFreqs.length) {
            this.yearArray(this.startDate, this.endDate);
          }
        }
      });
    });
  }

  yearArray(start, end) {
    this.years = [];
    let startYear = +start.substr(0, 4);
    let endYear = +end.substr(0, 4);
    while (startYear <= endYear) {
      this.years.push(startYear.toString());
      startYear +=1;
    }
    this.years = this.years.reverse();
    this.selectedStartYear = this.years[this.years.length - 1];
    this.selectedEndYear = this.years[0];
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
      if (this.selectedFreqs) {
        this.yearArray(this.startDate, this.endDate);
      }
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
