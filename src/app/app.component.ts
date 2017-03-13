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
  private selectedSeries: Array<number> = [];

  // List of regions and freqeuencies for the selected series/categories
  private regions: Array<Geography>;
  private frequencies: Array<Frequency>;

  // List of selected regions and frequencies
  private selectedGeos: Array<string> = [];
  private selectedFreqs: Array<string> = [];
  private reset: Boolean = false;

  private annualSelected: Boolean = false;
  private quarterSelected: Boolean = false;
  private monthSelected: Boolean = false;

  private datesSelected: DatesSelected;
  private dateArray: Array<any>;
  private tableData;
  private catGeoFreq = [];
  private displayTable: Boolean = false;
  private invalidDates: String;

  constructor(private _apiService: ApiService, private _helper: HelperService) { }

  getSelectedSeries(e) {
    this.dateArray = [];
    let geoList = [];
    let freqList = [];
    this.selectedSeries = e;
    this.datesSelected = <DatesSelected>{};
    this.datesSelected.startDate = '';
    this.datesSelected.endDate = '';
    let i = 0;
    this.selectedSeries.forEach((el) => {
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
        geo_freqs.forEach((geo) => {
          geo = this._helper.formatGeos(geo);
          this._helper.uniqueGeos(geo, geoList);
        });
        freq_geos.forEach((freq) => {
          freq = this._helper.formatFreqs(freq);
          this._helper.uniqueFreqs(freq, freqList);
        });
      },
        (error) => {
          this.errorMsg = error;
        },
        () => {
          if (i === this.selectedSeries.length) {
            this.displayTable = false;
            this.freqSelectorList(freqList);
            this.geoSelectorList(geoList);
            if (this.selectedFreqs.length) {
              this.getDates();
            }
            if (this.catGeoFreq.length) {
              this.getSeries();
            }
          }
        });
    });
    if (!this.selectedSeries.length) {
      // Remove table if all categories are deselected and remove date selectors
      this.toggleDateSelectors();
    }
  }

  freqSelectorList(freqArray: Array<Frequency>) {
    // Set list of frequencies for frequency selector
    if (this.frequencies) {
      // Check if frequency selection is available for selected categories
      /* this.frequencies.forEach((frequency, index) => {
        if (freqArray.indexOf(frequency) === -1) {
          this.frequencies.splice(index, 1);
        }
      }); */
      freqArray.forEach((freq) => {
        this._helper.uniqueFreqs(freq, this.frequencies);
      });
    } else {
      this.frequencies = freqArray;
    }
  }

  geoSelectorList(geoArray: Array<Geography>) {
    // Set list of reginos for region selector
    if (this.regions) {
      // Check if region selection is available for selected categories
      /* this.regions.forEach((region, index) => {
        if (geoArray.indexOf(region) === -1) {
          this.regions.splice(index, 1);
        }
      }); */
      geoArray.forEach((geo) => {
        this._helper.uniqueGeos(geo, this.regions);
      });
    } else {
      this.regions = geoArray;
    }
  }

  catGeoFreqCombination(selectedSeries, selectedGeos, selectedFreqs) {
    this.catGeoFreq = [];
    if (selectedSeries && selectedGeos.length && selectedFreqs.length) {
      selectedSeries.forEach((series) => {
        selectedGeos.forEach((geo) => {
          selectedFreqs.forEach((freq) => {
            this.catGeoFreq.push({ cat: series, geo: geo, freq: freq });
          });
        });
      });
    }
  }

  geoChange(e) {
    this.selectedGeos = e;
    if (!this.selectedGeos.length) {
      this.toggleDateSelectors();
    }
    if (this.catGeoFreq.length) {
      this.getSeries();
    }
  }

  freqChange(e) {
    this.selectedFreqs = e;
    this.dateArray = this._helper.categoryDateArray(this.datesSelected, this.selectedFreqs);
    if (this.catGeoFreq.length) {
      this.getSeries();
    }
    if (this.selectedFreqs.length) {
      this.getDates();
    } else {
      this.annualSelected = false;
      this.quarterSelected = false;
      this.monthSelected = false;
    }
    this.toggleDateSelectors();
  }

  toggleDateSelectors() {
    let aIndex = this.selectedFreqs.indexOf('A');
    let qIndex = this.selectedFreqs.indexOf('Q');
    let mIndex = this.selectedFreqs.indexOf('M');
    this.annualSelected = aIndex > -1 ? true : false;
    this.quarterSelected = qIndex > -1 ? true : false;
    this.monthSelected = mIndex > -1 ? true : false;
  }

  getSeries() {
    this.reset = false;
    this.getDates();
    this.catGeoFreqCombination(this.selectedSeries, this.selectedGeos, this.selectedFreqs);
    let seriesData = [];
    let counter = 0;
    this.catGeoFreq.forEach((category) => {
      this._apiService.fetchExpanded(category.cat, category.geo, category.freq).subscribe((series) => {
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
          if (counter === this.catGeoFreq.length) {
            this.formatTableData(seriesData);
          }
        });
    });
  }

  formatTableData(seriesData) {
    // Format data for datatables module (indicator-table component)
    this.tableData = [];
    let result = {};
    this.dateArray.forEach((date) => {
      result[date.tableDate] = ''
    });
    seriesData.forEach((series) => {
      let exist = this.tableData.findIndex(data => data.indicator === series.title && data.region === series.geography.name);
      // If exists, add observations corresponding to the series frequency
      if (exist !== -1) {
        if (series.frequencyShort === 'A') {
          this._helper.formatLevelData(series.seriesObservations, series.frequencyShort, this.tableData[exist].observations, this.dateArray);
        }
        if (series.frequencyShort === 'Q') {
          this._helper.formatLevelData(series.seriesObservations, series.frequencyShort, this.tableData[exist].observations, this.dateArray);
        }
        if (series.frequencyShort === 'M') {
          this._helper.formatLevelData(series.seriesObservations, series.frequencyShort, this.tableData[exist].observations, this.dateArray);
        }
      } else {
        this.tableData.push({
          indicator: series.title,
          region: series.geography.name,
          units: series.unitsLabelShort,
          source: series.source_description ? series.source_description : ' ',
          observations: this._helper.formatLevelData(series.seriesObservations, series.frequencyShort, result, this.dateArray)
        });
      }
    });
    this.displayTable = true;
  }

  checkSelections() {
    let disable = true;
    // Enable Get Data button if selections have been made in indicators, frequencies, and areas
    if (this.selectedSeries.length > 0 && this.selectedFreqs.length > 0 && this.selectedGeos.length > 0) {
      disable = false;
    }
    return disable;
  }

  clearSelections() {
    this.displayTable = false;
    this.reset = true;
    this.catGeoFreq = [];
    this.selectedSeries = [];
    this.frequencies = [];
    this.regions = [];
    this.selectedFreqs = [];
    this.selectedGeos = [];
    this.dateArray = [];
    this.toggleDateSelectors();
  }

  startYearChange(e) {
    this.datesSelected.selectedStartYear = e;
    this.getDates();
  }

  startQuarterChange(e) {
    this.datesSelected.selectedStartQuarter = e;
    this.getDates();
  }

  startMonthChange(e) {
    this.datesSelected.selectedStartMonth = e;
    this.getDates();
  }

  endYearChange(e) {
    this.datesSelected.selectedEndYear = e;
    this.getDates();
  }

  endQuarterChange(e) {
    this.datesSelected.selectedEndQuarter = e;
    this.getDates();
  }

  endMonthChange(e) {
    this.datesSelected.selectedEndMonth = e;
    this.getDates();
  }

  getDates() {
    let validDates = this.checkValidDates(this.datesSelected);
    if (validDates) {
      this.invalidDates = null;
      this.dateArray = this._helper.categoryDateArray(this.datesSelected, this.selectedFreqs);
      this._helper.yearsSelected(this.datesSelected);
      if (this.selectedFreqs.indexOf('Q') > -1) {
        this._helper.quartersSelected(this.datesSelected);
      }
      if (this.selectedFreqs.indexOf('M') > -1) {
        this._helper.monthsSelected(this.datesSelected);
      }
    } else {
      this.invalidDates = "Invalid date selection";
    }
  }

  checkValidDates(dates) {
    let valid = true;
    if (dates.selectedStartYear > dates.selectedEndYear) {
      valid = false;
    }
    if (dates.selectedStartYear === dates.selectedEndYear) {
      if (dates.selectedStartQuarter > dates.selectedEndQuarter) {
        valid = false;
      }
      if (dates.selectedStartMonth > dates.selectedEndMonth) {
        valid = false;
      }
    }
    return valid;
  }
}
