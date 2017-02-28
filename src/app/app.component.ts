import { Component, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ApiService } from './api.service';
import { HelperService } from './helper.service';
import { Geography } from './geography';
import { Frequency } from './frequency';
import { DatesSelected } from './dates-selected';

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

  private datesSelected: DatesSelected;
  private dateArray: Array<any>;
  private tableData;
  private catGeoFreq;
  private displayTable: Boolean = false;

  constructor(private _apiService: ApiService, private _helper: HelperService) { }

  getSelectedSeries(e) {
    this.dateArray = [];
    this.geoList = [];
    this.freqList = [];
    this.selectedSeries = e;
    this.datesSelected = <DatesSelected>{};
    this.datesSelected.startDate = '';
    this.datesSelected.endDate = '';
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
        if (this.datesSelected.startDate === '' || this.datesSelected.startDate > obsStart) {
          this.datesSelected.startDate = obsStart;
        }
        if (this.datesSelected.endDate === '' || this.datesSelected.endDate < obsEnd) {
          this.datesSelected.endDate = obsEnd;
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
            this.catGeoFreq = [];
            this.catGeoFreqCombination(this.selectedSeries, this.selectedGeos, this.selectedFreqs);
            this.frequencies = this.freqList;
            this.regions = this.geoList;
            this._helper.yearsSelected(this.datesSelected);
            this._helper.quartersSelected(this.datesSelected);
            this._helper.monthsSelected(this.datesSelected);
            if (this.selectedFreqs) {
              this.dateArray = this._helper.categoryDateArray(this.datesSelected, this.selectedFreqs);
            }
            if (this.catGeoFreq.length) {
              this.getSeries(this.catGeoFreq);
            }
            this.selectedGeos.forEach((selected, index) => {
              // Update list of selected geographies if selection does not exist in dropdown
              this._helper.checkSelectedList(selected, index, this.regions, this.selectedGeos);
            });
          }
        });
    });
  }

  catGeoFreqCombination(selectedSeries, selectedGeos, selectedFreqs) {
    if (selectedSeries && selectedGeos.length && selectedFreqs.length) {
      selectedSeries.forEach((series) => {
        selectedGeos.forEach((geo) => {
          selectedFreqs.forEach((freq) => {
            this.catGeoFreq.push({cat: series, geo: geo, freq: freq});
          });
        });
      });
    }
  }

  geoChange(e) {
    this.frequencies = [];
    this.selectedGeos = e;
    this.catGeoFreq = [];
    this.displayTable = false;
    this.catGeoFreqCombination(this.selectedSeries, this.selectedGeos, this.selectedFreqs);
    if (this.catGeoFreq.length) {
      this.getSeries(this.catGeoFreq);
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
    this.displayTable = false;
    this.selectedFreqs = e;
    this.dateArray = this._helper.categoryDateArray(this.datesSelected, this.selectedFreqs);
    this.catGeoFreq = [];
    this.catGeoFreqCombination(this.selectedSeries, this.selectedGeos, this.selectedFreqs);
    if (this.catGeoFreq.length) {
      this.getSeries(this.catGeoFreq);
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
      this.toggleDateSelectors();
    } else {
      // If no geographies are selected, reset list of regions
      this.selectedGeos = [];
      this.regions = this.geoList;
      this.annualSelected = false;
      this.quarterSelected = false;
      this.monthSelected = false;
    }
  }

  toggleDateSelectors() {
    let aIndex = this.selectedFreqs.indexOf('A');
    let qIndex = this.selectedFreqs.indexOf('Q');
    let mIndex = this.selectedFreqs.indexOf('M');
    this.annualSelected = aIndex > -1 ? true : false;
    this.quarterSelected = qIndex > -1 ? true : false;
    this.monthSelected = mIndex > -1 ? true : false;
  }

  getSeries(catGeoFreq) {
    let seriesData = [];
    let counter = 0;
    catGeoFreq.forEach((category) => {
      this._apiService.fetchExpanded(category.cat, category.geo, category.freq).subscribe((series) =>{
        if (series) {
          series.forEach((serie) => {
            seriesData.push(serie);
          });
        }
      },
      (error) => {
        this.errorMsg = error;
      },
      () => {
        counter += 1;
        if (counter === catGeoFreq.length) {
          this.formatTableData(seriesData);
        }
      });
    });
  }
  
  formatTableData(seriesData) {
    // Format data for datatables module (indicator-table component)
    this.tableData = [];
    seriesData.forEach((series) => {
      let exist = this.tableData.findIndex(data => data.indicator === series.title && data.region === series.geography.name);
      // If exists, add observations corresponding to the series frequency
      if (exist !== -1) {
        if (series.frequencyShort === 'A') {
          this._helper.formatLevelData(series.seriesObservations, series.frequencyShort, this.tableData[exist].observations);
        }
        if (series.frequencyShort === 'Q') {
          this._helper.formatLevelData(series.seriesObservations, series.frequencyShort, this.tableData[exist].observations);
        }
        if (series.frequencyShort === 'M') {
          this._helper.formatLevelData(series.seriesObservations, series.frequencyShort, this.tableData[exist].observations);
        }
      } else {
        this.tableData.push({
          indicator: series.title,
          region: series.geography.name,
          units: series.unitsLabelShort,
          source: series.source_description ? series.source_description : ' ',
          observations: this._helper.formatLevelData(series.seriesObservations, series.frequencyShort, {})
        });
      }
    });
    this.displayTable = true;
  }

  startYearChange(e) {
    this.datesSelected.selectedStartYear = e;
    this._helper.yearsSelected(this.datesSelected);
    this._helper.quartersSelected(this.datesSelected);
    this._helper.monthsSelected(this.datesSelected);
  }

  startQuarterChange(e) {
    this.datesSelected.selectedStartQuarter = e;
    this._helper.yearsSelected(this.datesSelected);
    this._helper.quartersSelected(this.datesSelected);
    this._helper.monthsSelected(this.datesSelected);
  }

  startMonthChange(e) {
    this.datesSelected.selectedStartMonth = e;
    this._helper.yearsSelected(this.datesSelected);
    this._helper.quartersSelected(this.datesSelected);
    this._helper.monthsSelected(this.datesSelected);
  }

  endYearChange(e) {
    this.datesSelected.selectedEndYear = e;
    this._helper.yearsSelected(this.datesSelected);
    this._helper.quartersSelected(this.datesSelected);
    this._helper.monthsSelected(this.datesSelected);
  }

  endQuarterChange(e) {
    this.datesSelected.selectedEndQuarter = e;
    this._helper.yearsSelected(this.datesSelected);
    this._helper.quartersSelected(this.datesSelected);
    this._helper.monthsSelected(this.datesSelected);
  }

  endMonthChange(e) {
    this.datesSelected.selectedEndMonth = e;
    this._helper.yearsSelected(this.datesSelected);
    this._helper.quartersSelected(this.datesSelected);
    this._helper.monthsSelected(this.datesSelected);
  }
}
