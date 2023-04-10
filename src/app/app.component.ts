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
  public indicatorSelected = false;

  // List of regions and freqeuencies for the selected series/categories
  public regions: Array<Geography>;
  public frequencies: Array<Frequency>;

  // List of selected regions and frequencies
  public selectedGeos: Array<string> = [];
  public selectedFreqs: Array<string> = [];

  public annualSelected: Boolean = false;
  public quarterSelected: Boolean = false;
  public monthSelected: Boolean = false;

  public datesSelected: DatesSelected;
  public dateArray: Array<any>;
  public tableData = [];
  public displayTable: Boolean = false;
  public invalidDates: String;
  public noSeries: String;
  @ViewChild(CategorySidebarComponent, { static: true })
  public sidebar: CategorySidebarComponent;

  constructor(private _apiService: ApiService, private _helper: HelperService) {
  }

  getSelectedIndicators(selectedMeasurements) {
    const geoList = [];
    const freqList = [];
    this.selectedIndicators = [];
    selectedMeasurements.forEach((m) => {
      this._apiService.fetchMeasurementSeries(m.id).subscribe((series) => {
        this.initSettings(m.position, series, geoList, freqList);
      },
        (error) => {
          this.errorMsg = error;
        },
        () => {
          this.indicatorSelected = true;
          this.freqSelectorList(freqList);
          this.geoSelectorList(geoList);
          if (this.selectedGeos.length && this.selectedFreqs.length) {
            this.getSeries();
          }
        });
    });
    if (!this.selectedIndicators.length) {
      // Remove table if all categories are deselected and remove date selectors
      this.datesSelected = null;
      this.displayTable = false;
      this.regions = [];
      this.selectedGeos = [];
      this.frequencies = [];
      this.selectedFreqs = [];
      this.indicatorSelected = false;
      this.invalidDates = null;
      this.toggleDateSelectors();
    }
  }

  initSettings(position: string, series: Array<any>, geoList: Array<any>, freqList: Array<any>) {
    // Iterate through list of series to create list of areas and frequencies and identify observation dates
    series.forEach((serie) => {
      this.selectedIndicators.push(serie);
      serie.position = position;
      const { geos, freqs } = serie;
      if (geos && freqs) {
        geos.forEach((geo) => {
          geo = this._helper.formatGeos(geo);
          this._helper.uniqueGeos(geo, geoList);
        });
        freqs.forEach((freq) => {
          freq = this._helper.formatFreqs(freq);
          this._helper.uniqueFreqs(freq, freqList);
        });
      }
    });
  }

  freqSelectorList(freqArray: Array<Frequency>) {
    // Set list of frequencies for frequency selector
    if (this.frequencies) {
      freqArray.forEach((freq) => {
        this._helper.uniqueFreqs(freq, this.frequencies);
      });
      this._helper.freqSort(this.frequencies);
    } else {
      this.frequencies = this._helper.freqSort(freqArray);
    }
  }

  geoSelectorList(geoArray: Array<Geography>) {
    // Set list of regions for region selector
    if (this.regions) {
      geoArray.forEach((geo) => {
        this._helper.uniqueGeos(geo, this.regions);
      });
      this._helper.areaSort(this.regions);
    } else {
      this.regions = this._helper.areaSort(geoArray);
    }
  }

  geoChange(e) {
    this.selectedGeos = e;
    if (!this.selectedGeos.length) {
      this.displayTable = false;
      this.toggleDateSelectors();
    }
    if (this.selectedIndicators.length && this.selectedFreqs.length) {
      this.getSeries();
      this.toggleDateSelectors();
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
    const qIndex = this.selectedFreqs.indexOf('Q');
    const mIndex = this.selectedFreqs.indexOf('M');
    this.annualSelected = this.selectedFreqs.length > 0 && this.selectedIndicators.length > 0 && this.selectedGeos.length > 0;
    this.quarterSelected = qIndex > -1 && mIndex === -1;
    this.monthSelected = mIndex > -1;
  }

  getSeries() {
    const seriesData = [];
    this.selectedIndicators.forEach((indicatorSeries, indIndex) => {
      const indicatorGeo = indicatorSeries.geography.handle;
      const indicatorFreq = indicatorSeries.frequencyShort;
      // Series level observations
      const indicatorLevel = indicatorSeries.seriesObservations.transformationResults.find(transforms => transforms.transformation === 'lvl');
      const levelValues = indicatorLevel.values;
      const geoSelected = this.selectedGeos.findIndex(geo => geo === indicatorGeo);
      const freqSelected = this.selectedFreqs.findIndex(freq => freq === indicatorFreq);
      // If region and frequency are selected and the series contains observations, add series to seriesData
      if (geoSelected > -1 && freqSelected > -1 && levelValues !== null) {
        if (indicatorLevel.dates && indicatorLevel.values) {
          indicatorSeries.observations = this.formatObservations(indicatorLevel);
        }
        seriesData.push(indicatorSeries);
      }
      if (indIndex === this.selectedIndicators.length - 1) {
        this.datesSelected = this.datesSelected ? this.datesSelected : <DatesSelected>{};
        this.datesSelected.endDate = '';
        this.datesSelected.startDate = '';
        if (seriesData.length !== 0) {
          const obsStartDates = seriesData.map(series => series.seriesObservations.observationStart);
          const obsEndDates = seriesData.map(series => series.seriesObservations.observationEnd);
          const minObsDate = obsStartDates.reduce((min, curr) => {
            return min === '' ? curr : curr.localeCompare(min) < 0 ? curr : min;
          }, '');
          const maxObsDate = obsEndDates.reduce((max, curr) => {
            return max === '' ? curr : curr.localeCompare(max) > 0 ? curr : max;
          }, '');
          this._helper.updateMaxDateRange({start: minObsDate, end: maxObsDate});
          seriesData.forEach((series, seriesIndex) => {
            // Find the earliest and lastest observation dates, used to set dates in the range selectors
            const obsStart = series.seriesObservations.observationStart;
            const obsEnd = series.seriesObservations.observationEnd;
            if (this.datesSelected.startDate === '' || this.datesSelected.startDate > obsStart) {
              this.datesSelected.startDate = obsStart;
            }
            if (this.datesSelected.endDate === '' || this.datesSelected.endDate < obsEnd) {
              this.datesSelected.endDate = obsEnd;
            }
            if (seriesIndex === seriesData.length - 1) {
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

  formatObservations(indicatorLevel) {
    // Return array of of dates with their corresponding values
    const { dates, values } = indicatorLevel;
    const formattedResults = dates.map((d, index) => {
      const entry = { date: '', value: '' };
      entry.date = d;
      entry.value = values[index];
      return entry;
    });
    return formattedResults;
  }

  formatTableData(seriesData) {
    // Format data for datatables module (indicator-table component)
    this.tableData = [];
    seriesData.forEach((series) => {
      const result = {};
      this.dateArray.forEach((date) => {
        result[date.tableDate] = ' ';
      });
      // If decimal value is not specified, round values to 2 decimal places
      const decimals = this.setDecimals(series.decimals);
      const exist = this.tableData.findIndex(data => data.indicator === series.title && data.region === series.geography.name);
      // If exists, add observations corresponding to the series frequency
      if (exist !== -1) {
        this._helper.formatLevelData(
          series.seriesObservations,
          series.observations,
          series.frequencyShort,
          decimals,
          this.tableData[exist].observations
        );
      } else {
        this.tableData.push({
          position: series.position,
          indicator: series.title,
          region: series.geography.name,
          units: series.unitsLabelShort,
          source: series.source_description ? series.source_description : ' ',
          observations: this._helper.formatLevelData(
            series.seriesObservations,
            series.observations,
            series.frequencyShort,
            decimals,
            result
          )
        });
      }
    });
  }

  setDecimals(seriesDecimals: number) {
    return (seriesDecimals || seriesDecimals === 0) ? seriesDecimals : 2;
  }

  checkSelections() {
    let disable = true;
    // Enable Get Data button if selections have been made in indicators, frequencies, and areas
    if (this.selectedIndicators.length && this.selectedFreqs.length && this.selectedGeos.length && !this.noSeries && !this.invalidDates) {
      disable = false;
    }
    return disable;
  }

  clearSelections() {
    this.displayTable = false;
    this.selectedIndicators = [];
    this.datesSelected = null;
    this.frequencies = [];
    this.regions = [];
    this.selectedFreqs = [];
    this.selectedGeos = [];
    this.dateArray = [];
    this.tableData = [];
    this.indicatorSelected = false;
    this.toggleDateSelectors();
    this.sidebar.reset();
    this.sidebar.ids = [];
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
    const validDates = this.checkValidDates(this.datesSelected);
    if (validDates) {
      this.invalidDates = null;
      this._helper.yearsRange(this.datesSelected);
      if (this.selectedFreqs.indexOf('Q') > -1) {
        this._helper.quartersRange(this.datesSelected);
      }
      if (this.selectedFreqs.indexOf('M') > -1) {
        this._helper.monthsRange(this.datesSelected);
      }
      this.dateArray = this._helper.categoryDateArray(this.datesSelected, this.selectedFreqs);
    } else {
      this.invalidDates = 'Invalid date selection';
      this.displayTable = false;
    }
  }

  checkValidDates(dates) {
    const {
      selectedStartYear,
      selectedEndYear,
      selectedStartQuarter,
      selectedEndQuarter,
      selectedStartMonth,
      selectedEndMonth
    } = dates;
    if (selectedStartYear > selectedEndYear) {
      return false;
    }
    if (selectedStartYear === selectedEndYear) {
      if ((selectedStartQuarter > selectedEndQuarter) || (selectedStartMonth > selectedEndMonth)) {
        return false;
      }
    }
    return true;
  }
}
