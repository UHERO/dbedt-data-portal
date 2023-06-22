import { Component, ViewChild } from '@angular/core';
import { ApiService } from './api.service';
import { HelperService } from './helper.service';
import { Geography } from './geography';
import { Frequency } from './frequency';
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
  displayDateRangeSelector: boolean = false;
  displayedSeries = [];
  displayLoading: boolean = false;

  // List of regions and freqeuencies for the selected series/categories
  public regions: Array<any> = [];
  public frequencies: Array<any> = [];

  public annualSelected: boolean = false;
  public quarterSelected: boolean = false;
  public monthSelected: boolean = false;

  public dateArray: Array<any>;
  public tableData = [];
  public displayTable: boolean = false;
  public invalidDates: String;
  public noSeries: String;
  @ViewChild(CategorySidebarComponent, { static: true })
  public sidebar: CategorySidebarComponent;

  constructor(
    private _apiService: ApiService,
    private _helper: HelperService
  ) {}
 
  getSelectedIndicators(selectedMeasurements) {    
    this.selectedIndicators = [];
    this.displayLoading = true;
    selectedMeasurements.forEach((measurement, index) => {
      this.fetchSeries(measurement, index === selectedMeasurements.length - 1);
    });
    if (!this.selectedIndicators.length) {
      // Remove table if all categories are deselected and remove date selectors
      this.displayTable = false;
      this.regions = [];
      this.frequencies = [];
      this.indicatorSelected = false;
      this.invalidDates = null;
      this.displayDateRangeSelector = false;
      this.toggleDateSelectors();
    }
  }

  fetchSeries(measurement, startFormat: boolean) {
    this._apiService.fetchMeasurementSeries(measurement.id).subscribe((series) => {
      series.forEach((serie) => {
        this.selectedIndicators.push(serie);
        serie.position = measurement.position;
        const { geography, frequencyShort, frequency } = serie;
        if (!this.frequencies.some(freq => freq.id === frequencyShort)) {
          this.frequencies.push(this._helper.formatFreqs({freq: frequencyShort, label: frequency}))
        }
        if (!this.regions.some(geo => geo.id === geography.handle)) {
          this.regions.push(this._helper.formatGeos(geography));
        } 
      });
    },
    (error) => {
      this.errorMsg = error;
    },
    () => {
      this.indicatorSelected = true;
      if (startFormat) {
        this.setFreqSelectorList(this.frequencies, this.selectedIndicators);
        this.setGeoSelectorList(this.regions, this.selectedIndicators);
        this.displayLoading = false;
      }
      if (this.frequencies.some(freq => freq.state) && this.regions.some(geo => geo.state) && startFormat) {
        this.filterDisplayedSeries();
        
      }
    });
  }

  setFreqSelectorList(freqArray: Array<Frequency>, selectedIndicators) {
    this.frequencies = this._helper.freqSort(freqArray);
    // remove frequencies that are no longer needed
    // when updating indicator selection
    if (this.frequencies.length) {
      this.frequencies = this.frequencies.filter(freq => selectedIndicators.some(s => s.frequencyShort === freq.id));
    }
  }

  setGeoSelectorList(geoArray: Array<Geography>, selectedIndicators) {
    this.regions = this._helper.areaSort(geoArray);
    // remove regions that are no longer needed
    // when updating indicator selection
    if (this.regions.length) {
      this.regions = this.regions.filter(geo => selectedIndicators.some(s => s.geography.handle === geo.id));
    }
  }

  geoChange(geos) {
    this.regions = geos;
    if (!this.regions.some(geo => geo.state)) {
      this.displayTable = false;
      this.toggleDateSelectors();
    }
    if (this.selectedIndicators.length && this.frequencies.some(freq => freq.state)) {
      this.filterDisplayedSeries();
      this.toggleDateSelectors();
    }
  }

  freqChange(frequencies) {
    this.frequencies = frequencies;
    if (this.selectedIndicators.length && this.regions.some(geo => geo.state)) {
      this.filterDisplayedSeries();
      this.toggleDateSelectors();
    }
    if (!this.frequencies.some(freq => freq.state)) {
      this.displayTable = false;
      this.annualSelected = false;
      this.quarterSelected = false;
      this.monthSelected = false;
    }
  }

  dateSelectionChange(event) {
    if (this.checkValidDates(event)) {
      this.invalidDates = null;
      this.dateArray = this._helper.setDateArray(event, this.frequencies.some(freq => freq.id === 'Q' && freq.state), this.frequencies.some(freq => freq.id === 'M' && freq.state));
    } else {
      this.invalidDates = 'Invalid date selection';
      this.displayTable = false;
    }
  }

  toggleDateSelectors() {
    const qSelected = this.frequencies.find(freq => freq.id === 'Q' && freq.state);
    const mSelected = this.frequencies.find(freq => freq.id === 'M' && freq.state);
    this.annualSelected = this.frequencies.some(freq => freq.state) && this.selectedIndicators.length > 0 && this.regions.some(geo => geo.state);
    this.quarterSelected = qSelected && !mSelected ? true : false;
    this.monthSelected = mSelected ? true : false;
  }

  filterDisplayedSeries() {
    this.displayedSeries = this.selectedIndicators.filter((indicator) => {
      const levelData = indicator.seriesObservations.transformationResults.find(transforms => transforms.transformation === 'lvl');
      indicator.observations = this.formatObservations(levelData);
      return this.regions.some(geo => geo.id === indicator.geography.handle && geo.state) &&
        this.frequencies.some(freq => freq.id === indicator.frequencyShort && freq.state) &&
        levelData?.dates && levelData?.values;
    });
    const obsStartDates = this.displayedSeries.map(series => series.seriesObservations.observationStart);
    const obsEndDates = this.displayedSeries.map(series => series.seriesObservations.observationEnd);
    const minObsDate = obsStartDates.reduce((min, curr) => {
      return min === '' ? curr : curr.localeCompare(min) < 0 ? curr : min;
    }, '');
    const maxObsDate = obsEndDates.reduce((max, curr) => {
      return max === '' ? curr : curr.localeCompare(max) > 0 ? curr : max;
    }, '');
    this._helper.updateMaxDateRange({start: minObsDate, end: maxObsDate});
    if (this.displayedSeries.length) {
      this.noSeries = null;
      this.displayDateRangeSelector = true;
    } else {
      // Display warning, if no series exists for selected indicators, areas, and frequencies
      this.noSeries = 'Selection Not Available';
    }
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

  checkSelections() {
    let disable = true;
    // Enable Get Data button if selections have been made in indicators, frequencies, and areas
    if (this.selectedIndicators.length && this.frequencies.some(freq => freq.state) && this.regions.some(geo => geo.state) && !this.noSeries && !this.invalidDates) {
      disable = false;
    }
    return disable;
  }

  clearSelections() {
    this.displayTable = false;
    this.selectedIndicators = [];
    this.frequencies = [];
    this.regions = [];
    this.dateArray = [];
    this.tableData = [];
    this.indicatorSelected = false;
    this.toggleDateSelectors();
    this.sidebar.reset();
    this.sidebar.ids = [];
    this.displayDateRangeSelector = false;
  }

  checkValidDates(dates) {
    const {
      startYear,
      endYear,
      startQuarter,
      endQuarter,
      startMonth,
      endMonth
    } = dates;
    if (startYear > endYear) {
      return false;
    }
    if (startYear === endYear) {
      if ((startQuarter > endQuarter) || (startMonth > endMonth)) {
        return false;
      }
    }
    return true;
  }
}
