import { Injectable } from '@angular/core';

import { Geography } from './geography';
import { Frequency } from './frequency';
import { DatesSelected } from './dates-selected';

@Injectable()
export class HelperService {

  constructor() { }

  categoryDateArray(selectedDates, selectedFreqs: Array<string>) {
    let dateArray = [];
    let m = { 1: '01', 2: '02', 3: '03', 4: '04', 5: '05', 6: '06', 7: '07', 8: '08', 9: '09', 10: '10', 11: '11', 12: '12' };
    let q = { 1: 'Q1', 4: 'Q2', 7: 'Q3', 10: 'Q4' };
    let startYear = +selectedDates.startDate.substr(0, 4);
    let endYear = +selectedDates.endDate.substr(0, 4);
    let startMonth = +selectedDates.startDate.substr(5, 2);
    let endMonth = +selectedDates.endDate.substr(5, 2);
    if (selectedDates.selectedStartYear) {
      startYear = +selectedDates.selectedStartYear; 
    }
    if (selectedDates.selectedStartMonth) {
      startMonth = +selectedDates.selectedStartMonth;
    }
    if (selectedDates.selectedEndYear) {
      endYear = +selectedDates.selectedEndYear;
    }
    if (selectedDates.selectedEndMonth) {
      endMonth = +selectedDates.selectedEndMonth
    }
    if (selectedDates.selectedStartQuarter) {
      for (let key in q) {
        if (q[key] === selectedDates.selectedStartQuarter) {
          startMonth = +key;
        }
      }
    }
    if (selectedDates.selectedEndQuarter) {
      for (let key in q) {
        if (q[key] === selectedDates.selectedEndQuarter) {
          endMonth = +key + 2;
        }
      }
    }
    while (startYear + '-' + m[startMonth] + '-01' <= endYear + '-' + m[endMonth] + '-01') {
      if ((startMonth === 1 && selectedFreqs.indexOf('A') > -1)) {
        dateArray.push({date: startYear.toString() + '-01-01', tableDate: startYear.toString()});
      }
      // If quarterly frequency is selected, add to table dates
      if (q[startMonth] && selectedFreqs.indexOf('Q') > -1) {
        dateArray.push({date: startYear.toString() + '-' + m[startMonth] + '-01', tableDate: startYear.toString() + ' ' + q[startMonth]});
      }
      // If monthly frequency is selected, add to table dates
      if (m[startMonth] && selectedFreqs.indexOf('M') > -1) {
        dateArray.push({date: startYear.toString() + '-' + m[startMonth] + '-01', tableDate: startYear.toString() + '-' + m[startMonth]});
      }
      startYear = startMonth === 12 ? startYear += 1 : startYear;
      startMonth = startMonth === 12 ? 1 : startMonth += 1;
    }

    return dateArray;
  }

  yearsSelected(selectedDates) {
    let allYears = [];
    let startYear = +selectedDates.startDate.substr(0, 4);
    let endYear = +selectedDates.endDate.substr(0, 4);
    while (startYear <= endYear) {
      allYears.push(startYear.toString());
      startYear += 1;
    }

    allYears = allYears.reverse();
    let minYear = allYears[allYears.length - 1];
    let maxYear = allYears[0];
    selectedDates.selectedStartYear = selectedDates.selectedStartYear ? selectedDates.selectedStartYear : minYear;
    selectedDates.selectedEndYear = selectedDates.selectedEndYear ? selectedDates.selectedEndYear : maxYear;
    selectedDates.fromYearList = allYears.slice(allYears.indexOf(selectedDates.selectedEndYear), allYears.length);
    selectedDates.toYearList = allYears.slice(0, allYears.indexOf(selectedDates.selectedStartYear) + 1);
  }

  quartersSelected(selectedDates) {
    let allQuarters = ['Q4', 'Q3', 'Q2', 'Q1'];
    let m = ['12', '11', '10', '09', '08', '07', '06', '05', '04', '03', '02', '01'];
    selectedDates.fromQuarterList = allQuarters;
    selectedDates.toQuarterList = allQuarters;
    this.minMaxYearQuarters(selectedDates);
    /* if (selectedDates.selectedStartMonth) {
      selectedDates.fromQuarterList = this.minYearQuarters(+selectedDates.selectedStartMonth);
    }
    if (selectedDates.selectedEndMonth) {
      selectedDates.toQuarterList = this.maxYearQuarters(+selectedDates.selectedEndMonth);
    } */
    this.sameYearQuarters(selectedDates);
    let minQuarter = selectedDates.fromQuarterList[selectedDates.fromQuarterList.length - 1];
    console.log(minQuarter);
    let maxQuarter = selectedDates.toQuarterList[0];
    console.log(selectedDates.fromQuarterList)
    selectedDates.selectedStartQuarter = selectedDates.fromQuarterList.indexOf(selectedDates.selectedStartQuarter) > -1 ? selectedDates.selectedStartQuarter : minQuarter;
    selectedDates.selectedEndQuarter = selectedDates.toQuarterList.indexOf(selectedDates.selectedEndQuarter) > -1 ? selectedDates.selectedEndQuarter : maxQuarter;
        console.log(selectedDates.selectedStartQuarter)

  }

  minMaxYearQuarters(selectedDates) {
    // If selectedStartYear is set to earliest/latest possible year, set quarter list based on earliest/latest month available
    // If selectedStartYear is set to earliest/latest possible year, set quarter list based on earliest/latest month available
    let minYear = selectedDates.startDate.substr(0, 4);
    let maxYear = selectedDates.endDate.substr(0, 4);
    let startMonth = +selectedDates.startDate.substr(5, 2);
    let endMonth = +selectedDates.endDate.substr(5, 2);
    if (selectedDates.selectedStartYear === minYear) {
      selectedDates.fromQuarterList = this.minYearQuarters(startMonth);
    }
    if (selectedDates.selectedStartYear === maxYear) {
      selectedDates.fromQuarterList = this.maxYearQuarters(endMonth);
    }
    if (selectedDates.selectedEndYear === maxYear) {
      selectedDates.toQuarterList = this.maxYearQuarters(endMonth);
    }
    if (selectedDates.selectedEndYear === minYear) {
      selectedDates.toQuarterList = this.minYearQuarters(startMonth);
    }
  }

  monthsSelected(selectedDates) {
    let allMonths = ['12', '11', '10', '09', '08', '07', '06', '05', '04', '03', '02', '01'];
    let q = { '01': 'Q1', '04': 'Q2', '07': 'Q3', '10': 'Q4' };   
    let startMonth, endMonth;
    selectedDates.fromMonthList = allMonths;
    selectedDates.toMonthList = allMonths;
    this.minMaxYearMonths(selectedDates, allMonths);
    if (selectedDates.selectedStartQuarter) {
      let lastMonth;
      let lastQ = selectedDates.toQuarterList[0];
      for (let key in q) {
        if (q[key] === selectedDates.selectedStartQuarter) {
          startMonth = key;
        }
        if (q[key] === lastQ) {
          lastMonth = key;
        }
      }
      console.log(lastMonth)
      selectedDates.fromMonthList = selectedDates.fromMonthList.slice(selectedDates.fromMonthList.indexOf(lastMonth) - 2, selectedDates.fromMonthList.indexOf(startMonth) + 1);
    }
    if (selectedDates.selectedEndQuarter) {
      for (let key in q) {
        if (q[key] === selectedDates.selectedEndQuarter) {
          endMonth = key;
        }
      }
      selectedDates.toMonthList = selectedDates.toMonthList.slice(selectedDates.toMonthList.indexOf(endMonth) - 2);
    }
    this.sameYearMonths(selectedDates);
    let minMonth = selectedDates.fromMonthList[selectedDates.fromMonthList.length - 1];
    let maxMonth = selectedDates.toMonthList[0];
    selectedDates.selectedStartMonth = selectedDates.fromMonthList.indexOf(selectedDates.selectedStartMonth) > -1 ? selectedDates.selectedStartMonth : minMonth;
    selectedDates.selectedEndMonth = selectedDates.toMonthList.indexOf(selectedDates.selectedEndMonth) > -1 ? selectedDates.selectedEndMonth : maxMonth;
  }

  minMaxYearMonths(selectedDates, allMonths) {
    // If selectedStartYear is set to earliest/latest possible year, set month list based on earliest/latest month available
    // If selectedEndYear is set to earliest/latest possible year, set month list based on earliest/latest month available
    let minYear = selectedDates.startDate.substr(0, 4);
    let maxYear = selectedDates.endDate.substr(0, 4);    
    let startMonth = selectedDates.startDate.substr(5, 2);
    let endMonth = selectedDates.endDate.substr(5, 2);
    if (selectedDates.selectedStartYear === minYear) {
      selectedDates.fromMonthList = allMonths.slice(0, allMonths.indexOf(startMonth) + 1);
    }
    if (selectedDates.selectedStartYear === maxYear) {
      selectedDates.fromMonthList = allMonths.slice(allMonths.indexOf(endMonth), allMonths.length);
    }
    if (selectedDates.selectedEndYear === maxYear) {
      selectedDates.toMonthList = allMonths.slice(allMonths.indexOf(endMonth), allMonths.length);
    }
    if (selectedDates.selectedEndYear === minYear) {
      selectedDates.toMonthList = allMonths.slice(0, allMonths.indexOf(startMonth) + 1);
    }
  }

  quarterMonths(selectedDates) {
    let q = { '01': 'Q1', '04': 'Q2', '07': 'Q3', '10': 'Q4' };
    let startMonth, endMonth;
    if (selectedDates.selectedStartQuarter) {
      for (let key in q) {
        if (q[key] === selectedDates.selectedStartQuarter) {
          startMonth = key;
        }
      }
      selectedDates.fromMonthList = selectedDates.fromMonthList.slice(0, selectedDates.fromMonthList.indexOf(startMonth) + 1);
    }
    if (selectedDates.selectedEndQuarter) {
      for (let key in q) {
        if (q[key] === selectedDates.selectedEndQuarter) {
          endMonth = key;
        }
      }
      selectedDates.toMonthList = selectedDates.toMonthList.slice(selectedDates.toMonthList.indexOf(endMonth) - 2, selectedDates.toMonthList.length);
    }
  }

  sameYearQuarters(selectedDates) {
    let allQuarters = ['Q4', 'Q3', 'Q2', 'Q1'];
    // If selected start and end years are the same
    // Prevent user from selecting a start quarter later than the selected end quarter
    // Prevent user from selecting an end quarter earlier than the selected start quarter
    let fromList = selectedDates.fromQuarterList;
    let toList = selectedDates.toQuarterList;
    if (selectedDates.selectedStartYear === selectedDates.selectedEndYear) {
      selectedDates.fromQuarterList = fromList.slice(fromList.indexOf(selectedDates.selectedEndQuarter), fromList.length);
      selectedDates.toQuarterList = toList.slice(0, toList.indexOf(selectedDates.selectedStartQuarter) + 1);
    }
  }

  sameYearMonths(selectedDates) {
    // If selected start and end years are the same
    // Prevent user from selecting a start month later than the selected end month
    // Prevent user from selecting an end month earlier than the selected start month
    let fromList = selectedDates.fromMonthList;
    let toList = selectedDates.toMonthList;
    if (selectedDates.selectedStartYear === selectedDates.selectedEndYear) {
      selectedDates.fromMonthList = fromList.slice(fromList.indexOf(selectedDates.selectedEndMonth), fromList.length);
      selectedDates.toMonthList = toList.slice(0, toList.indexOf(selectedDates.selectedStartMonth) + 1);
    }
  }

  minYearQuarters(month) {
    if (4 <= month && month < 7) {
      return ['Q4', 'Q3', 'Q2'];
    }
    if (7 <= month && month < 10) {
      return ['Q4', 'Q3'];
    }
    if (10 <= month) {
      return ['Q4'];
    }
    return ['Q4', 'Q3', 'Q2', 'Q1'];
  }

  maxYearQuarters(month) {
    if (1 <= month && month < 4) {
      return ['Q1'];
    }
    if (4 <= month && month < 7) {
      return ['Q2', 'Q1'];
    }
    if (7 <= month && month < 10) {
      return ['Q3', 'Q2', 'Q1'];
    }
    return ['Q4', 'Q3', 'Q2', 'Q1'];
  }

  formatLevelData(seriesObservations, frequency: string, results: Object) {
    let obs = seriesObservations;
    let level = obs.transformationResults[0].observations;

    if (level) {
      level.forEach((entry, i) => {
        if (frequency === 'A') {
          let tableDate = entry.date.substr(0, 4);
          results[tableDate] = entry.value;
        }
        if (frequency === 'Q') {
          let q = {'01': 'Q1', '04': 'Q2', '07': 'Q3', '10': 'Q4'};
          let tableDate = entry.date.substr(0, 4) + ' ' + q[entry.date.substr(5, 2)];
          results[tableDate] = entry.value;
        }
        if (frequency === 'M') {
          let tableDate = entry.date.substr(0, 7);
          results[tableDate] = entry.value;
        }
      });
    }
    return results;
  }

  checkSelectedGeoFreqs(selected: string, geoList: Array<any>, frequencies: Array<any>) {
    geoList.forEach((geo, index) => {
      if (selected === geo.id) {
        geo.freqs.forEach((freq, index) => {
          this.uniqueFreqs(freq, frequencies);
        });
      }
    });
  }

  checkSelectedList(selected: string, index: number, filterList: Array<any>, selectedList: Array<any>) {
    let exist = false;
    for (let i in filterList) {
      if (selected === filterList[i].id) {
        exist = true;
      }
    }
    if (!exist) {
      selectedList.splice(index, 1);
    }
  }

  checkSelectedFreqGeos(selected: string, freqList: Array<any>, regions: Array<any>) {
    freqList.forEach((freq, index) => {
      if (selected === freq.id) {
        freq.geos.forEach((geo, index) => {
          this.uniqueGeos(geo, regions);
        });
      }
    });
  }

  // Get a unique array of available regions for a category
  uniqueGeos(geo: Geography, geoList: Array<any>) {
    let exist = false;
    for (let i in geoList) {
      // Multiselect Dropdown Component (geo & freq selectors) requires name and id properties
      if (geo.handle === geoList[i].id) {
        exist = true;
        // If region already exists, check it's list of frequencies
        // Get a unique list of frequencies available for a region
        let freqs = geo.freqs;
        for (let j in freqs) {
          if (!this.freqExist(geoList[i].freqs, freqs[j].freq)) {
            geoList[i].freqs.push(freqs[j]);
          }
        }
      }
    }
    if (!exist) {
      geoList.push({ name: geo.name ? geo.name : geo.handle, id: geo.handle, freqs: geo.freqs });
    }
  }

  freqExist(freqArray: Array<any>, freq: Frequency) {
    for (let n in freqArray) {
      if (freq === freqArray[n].freq) {
        return true;
      }
    }
    return false;
  }

  // Get a unique array of available frequencies for a category
  uniqueFreqs(freq: Frequency, freqList: Array<any>) {
    let exist = false;
    for (let i in freqList) {
      if (freq.label === freqList[i].name) {
        exist = true;
        // If frequency already exists, check it's list of regions
        // Get a unique list of regions available for a frequency
        let geos = freq.geos;
        for (let j in geos) {
          if (!this.geoExist(freqList[i].geos, geos[j].handle)) {
            freqList[i].geos.push(geos[j]);
          }
        }
      }
    }
    if (!exist) {
      freqList.push({ name: freq.label, id: freq.freq, geos: freq.geos });
    }
  }

  geoExist(geoArray: Array<any>, geo: Geography) {
    for (let n in geoArray) {
      if (geo === geoArray[n].handle) {
        return true;
      }
    }
    return false;
  }
}
