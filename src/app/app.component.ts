import { Component, Output, EventEmitter, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ApiService } from './api.service';
import { HelperService } from './helper.service';
import { Geography } from './geography';
import { Frequency } from './frequency';
import { DatesSelected } from './dates-selected';
import { CategorySidebarComponent } from './category-sidebar/category-sidebar.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private errorMsg: string;
  // List of indicators selected from category-tree
  private selectedIndicators: Array<any> = [];

  // List of regions and freqeuencies for the selected series/categories
  private regions: Array<Geography>;
  private frequencies: Array<Frequency>;

  // List of selected regions and frequencies
  private selectedGeos: Array<string> = [];
  private selectedFreqs: Array<string> = [];

  private annualSelected: Boolean = false;
  private quarterSelected: Boolean = false;
  private monthSelected: Boolean = false;

  private datesSelected: DatesSelected;
  private dateArray: Array<any>;
  private tableData = [];
  private displayTable: Boolean = false;
  private invalidDates: String;
  private noSeries: String;
  @ViewChild(CategorySidebarComponent)
  private sidebar: CategorySidebarComponent;

  constructor(private _apiService: ApiService, private _helper: HelperService) { }

  getSelectedIndicators(e) {
    let geoList = [];
    let freqList = [];
    this.selectedIndicators = [];
    let selectedMeasurements = e;
    this.datesSelected = <DatesSelected>{};
    this.datesSelected.startDate = '';
    this.datesSelected.endDate = '';
    selectedMeasurements.forEach((m) => {
      this._apiService.fetchMeasurementSeries(m).subscribe((series) => {
        this.initSettings(series, geoList, freqList);
      },
        (error) => {
          this.errorMsg = error;
        },
        () => {
          this.freqSelectorList(freqList);
          this.geoSelectorList(geoList);
          if (this.selectedGeos.length && this.selectedFreqs.length) {
            this.getSeries();
          }
        });
    });
    if (!this.selectedIndicators.length) {
      // Remove table if all categories are deselected and remove date selectors
      this.toggleDateSelectors();
    }
  }

  initSettings(series: Array<any>, geoList: Array<any>, freqList: Array<any>) {
    // Iterate through list of series to create list of areas and frequencies and identify observation dates
    let geo_freqs, freq_geos, obsStart, obsEnd;
    series.forEach((serie) => {
      this.selectedIndicators.push(serie)
      geo_freqs = serie.geo_freqs;
      freq_geos = serie.freq_geos;
      obsStart = serie.seriesObservations.observationStart.substr(0, 10);
      obsEnd = serie.seriesObservations.observationEnd.substr(0, 10);
      geo_freqs.forEach((geo) => {
        geo = this._helper.formatGeos(geo);
        this._helper.uniqueGeos(geo, geoList);
      });
      freq_geos.forEach((freq) => {
        freq = this._helper.formatFreqs(freq);
        this._helper.uniqueFreqs(freq, freqList);
      });
    });
  }

  freqSelectorList(freqArray: Array<Frequency>) {
    // Set list of frequencies for frequency selector
    if (this.frequencies) {
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
      geoArray.forEach((geo) => {
        this._helper.uniqueGeos(geo, this.regions);
      });
    } else {
      this.regions = geoArray;
    }
  }

  geoChange(e) {
    this.selectedGeos = e;
    if (!this.selectedGeos.length) {
      this.displayTable = false;
      this.toggleDateSelectors();
    }
    if (this.selectedIndicators.length && this.selectedFreqs.length) {
      this.getSeries()
    }
  }

  freqChange(e) {
    this.selectedFreqs = e;
    if (this.selectedIndicators.length && this.selectedGeos.length) {
      this.getSeries();
      this.toggleDateSelectors();
    }
    if (!this.selectedFreqs.length) {
      this.displayTable = false;
      this.annualSelected = false;
      this.quarterSelected = false;
      this.monthSelected = false;
    }
  }

  toggleDateSelectors() {
    if (!this.noSeries) {
      let aIndex = this.selectedFreqs.indexOf('A');
      let qIndex = this.selectedFreqs.indexOf('Q');
      let mIndex = this.selectedFreqs.indexOf('M');
      this.annualSelected = aIndex > -1 ? true : false;
      this.quarterSelected = qIndex > -1 ? true : false;
      this.monthSelected = mIndex > -1 ? true : false;
    }
  }

  getSeries() {
    let seriesData = [];
    let counter = 0;
    this.selectedIndicators.forEach((series) => {
      this.selectedGeos.forEach((geo) => {
        this.selectedFreqs.forEach((freq) => {
          if (series.geography.handle === geo && series.frequencyShort === freq) {
            seriesData.push(series);
          }
        });
      });
      counter += 1;
      if (counter === this.selectedIndicators.length) {
        let seriesCount = 0;
        if (seriesData.length !== 0) {
          seriesData.forEach((series) => {
            let obsStart = series.seriesObservations.observationStart.substr(0, 10);
            let obsEnd = series.seriesObservations.observationEnd.substr(0, 10);
            if (this.datesSelected.startDate === '' || this.datesSelected.startDate > obsStart) {
              this.datesSelected.startDate = obsStart;
            }
            if (this.datesSelected.endDate === '' || this.datesSelected.endDate < obsEnd) {
              this.datesSelected.endDate = obsEnd;
            }
            seriesCount += 1;
            if (seriesCount === seriesData.length) {
              this.noSeries = null;
              this.getDates();
              this.formatTableData(seriesData);
            }
          });
        } else {
          // Display warning, if no series exists for selected indicators, areas, and frequencies
          this.noSeries = 'Selection Not Available';
        }
      }
    });
  }

  showTable() {
    this.displayTable = true;
  }

  formatTableData(seriesData) {
    // Format data for datatables module (indicator-table component)
    this.tableData = [];
    seriesData.forEach((series) => {
      let result = {};
      this.dateArray.forEach((date, index) => {
        result[date.tableDate] = '';
      });
      // If decimal value is not specified, round values to 2 decimal places
      let decimals = this.setDecimals(series.decimals);
      let exist = this.tableData.findIndex(data => data.indicator === series.title && data.region === series.geography.name);
      // If exists, add observations corresponding to the series frequency
      if (exist !== -1) {
        if (series.frequencyShort === 'A') {
          this._helper.formatLevelData(series.seriesObservations, series.frequencyShort, decimals, this.tableData[exist].observations, this.dateArray);
        }
        if (series.frequencyShort === 'Q') {
          this._helper.formatLevelData(series.seriesObservations, series.frequencyShort, decimals, this.tableData[exist].observations, this.dateArray);
        }
        if (series.frequencyShort === 'M') {
          this._helper.formatLevelData(series.seriesObservations, series.frequencyShort, decimals, this.tableData[exist].observations, this.dateArray);
        }
      } else {
        this.tableData.push({
          indicator: series.title,
          region: series.geography.name,
          units: series.unitsLabelShort,
          source: series.source_description ? series.source_description : ' ',
          observations: this._helper.formatLevelData(series.seriesObservations, series.frequencyShort, decimals, result, this.dateArray)
        });
      }
    });
  }

  setDecimals (seriesDecimals: number) {
    if (seriesDecimals) {
      return seriesDecimals;
    } else if (seriesDecimals === 0) {
      return seriesDecimals;
    } else {
      return 2;
    }
  }

  checkSelections() {
    let disable = true;
    // Enable Get Data button if selections have been made in indicators, frequencies, and areas
    if (this.selectedIndicators.length > 0 && this.selectedFreqs.length > 0 && this.selectedGeos.length > 0 && !this.noSeries) {
      disable = false;
    }
    return disable;
  }

  clearSelections() {
    this.displayTable = false;
    this.selectedIndicators = [];
    this.frequencies = [];
    this.regions = [];
    this.selectedFreqs = [];
    this.selectedGeos = [];
    this.dateArray = [];
    this.toggleDateSelectors();
    this.sidebar.reset();
  }

  startYearChange(e) {
    this.datesSelected.selectedStartYear = e;
    this.getDates();
    this.getSeries();
  }

  startQuarterChange(e) {
    this.datesSelected.selectedStartQuarter = e;
    this.getDates();
    this.getSeries();
  }

  startMonthChange(e) {
    this.datesSelected.selectedStartMonth = e;
    this.getDates();
    this.getSeries();
  }

  endYearChange(e) {
    this.datesSelected.selectedEndYear = e;
    this.getDates();
    this.getSeries();
  }

  endQuarterChange(e) {
    this.datesSelected.selectedEndQuarter = e;
    this.getDates();
    this.getSeries();
  }

  endMonthChange(e) {
    this.datesSelected.selectedEndMonth = e;
    this.getDates();
    this.getSeries();
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
      this.displayTable = false;
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
