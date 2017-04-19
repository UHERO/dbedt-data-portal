import { Injectable } from '@angular/core';

import { Geography } from './geography';
import { Frequency } from './frequency';
import { DatesSelected } from './dates-selected';

@Injectable()
export class HelperService {

  constructor() { }

  categoryDateArray(selectedDates, selectedFreqs: Array<string>) {
    // Dates used in table header
    let dateArray = [];
    let m = { 1: '01', 2: '02', 3: '03', 4: '04', 5: '05', 6: '06', 7: '07', 8: '08', 9: '09', 10: '10', 11: '11', 12: '12' };
    let q = { 1: 'Q1', 4: 'Q2', 7: 'Q3', 10: 'Q4' };
    let startYear = +selectedDates.startDate.substr(0, 4);
    let endYear = +selectedDates.endDate.substr(0, 4);
    let startMonth = +selectedDates.startDate.substr(5, 2);
    let endMonth = +selectedDates.endDate.substr(5, 2);
    let annualSelected = selectedFreqs.indexOf('A') > -1;
    let monthSelected = selectedFreqs.indexOf('M') > -1;
    let quarterSelected = selectedFreqs.indexOf('Q') > -1;
    // Check if selectedDates' properties have values set (i.e. date range selectors have been used)
    let dates = this.checkSelectedDates(selectedDates, monthSelected, startYear, endYear, startMonth, endMonth, q);
    startYear = dates.startYear;
    endYear = dates.endYear;
    startMonth = dates.startMonth;
    endMonth = dates.endMonth;
    while (startYear + '-' + m[startMonth] + '-01' <= endYear + '-' + m[endMonth] + '-01') {
      // Frequency display order: M, Q, A
      if (monthSelected) {
        dateArray.push({date: startYear.toString() + '-' + m[startMonth] + '-01', tableDate: startYear.toString() + '-' + m[startMonth]});
      }
      if (quarterSelected) {
        let qMonth = this.addQuarterObs(startMonth, monthSelected);
        if (qMonth) {
          dateArray.push({date: startYear.toString() + '-' + m[qMonth] + '-01', tableDate: startYear.toString() + ' ' + q[qMonth]});
        }
      }
      if (annualSelected) {
        let addAnnual = this.addAnnualObs(startMonth, monthSelected, quarterSelected);
        if (addAnnual) {
          dateArray.push({date: startYear.toString() + '-01-01', tableDate: startYear.toString()});
        }
      }
      startYear = startMonth === 12 ? startYear += 1 : startYear;
      startMonth = startMonth === 12 ? 1 : startMonth += 1;
    }
    return dateArray;
  }

  addQuarterObs(startMonth, monthSelected) {
    let monthCheck, qMonth;
    // If M not selected, add Q at months 1, 4, 7, 10 (i.e. startMonth === 1, 4, 7, 10)
    if (!monthSelected) {
      qMonth = startMonth;
      monthCheck = this.checkStartMonth(startMonth + 2);
      if (monthCheck) return qMonth;
    }
    //If M is selected, add Q after months 3, 7, 9, 12 (i.e. startMonth === 3, 7, 9, 12)
    if (monthSelected) {
      qMonth = startMonth - 2;
      monthCheck = this.checkStartMonth(startMonth);
      if (monthCheck) return qMonth;
    }
  }

  addAnnualObs(startMonth, monthSelected, quarterSelected) {
    // If M selected, add A after month 12
    if (monthSelected && startMonth === 12) {
      return true;
    }
    // If Q selected (w/o M), add A after 4th Quarter
    if (quarterSelected && !monthSelected && startMonth === 10) {
      return true;
    }
    // If only A selected, add to date array
    if (!quarterSelected && !monthSelected && startMonth === 1) {
      return true;
    }
    return false;
  }

  checkSelectedDates(selectedDates, monthSelected, startYear, endYear, startMonth, endMonth, quarters) {
    startYear = selectedDates.selectedStartYear ? +selectedDates.selectedStartYear : startYear;
    endYear = selectedDates.selectedEndYear ? +selectedDates.selectedEndYear : endYear;
    startMonth = selectedDates.selectedStartMonth ? +selectedDates.selectedStartMonth : startMonth;
    endMonth = selectedDates.selectedEndMonth ? +selectedDates.selectedEndMonth : endMonth;
    if (!monthSelected) {
      startMonth = selectedDates.selectedStartQuarter ? this.setStartMonthQ(quarters, selectedDates, startMonth) : startMonth;
      endMonth = selectedDates.selectedEndQuarter ? this.setEndMonthQ(quarters, selectedDates, endMonth) : endMonth;
    }
    return { startYear: startYear, endYear: endYear, startMonth: startMonth, endMonth: endMonth }
  }

  // If returns true, add quarter to date array
  checkStartMonth(month) {
    if (month === 3 || month === 6 || month === 9 || month === 12) {
      return true;
    }
    return false;
  }

  // Get start month based on selected start quarter
  setStartMonthQ(quarters, selectedDates, startMonth) {
    for (let key in quarters) {
      if (quarters[key] === selectedDates.selectedStartQuarter) {
        startMonth = +key;
      }
    }
    return startMonth;
  }

  // Get end month based on selected end quarter
  setEndMonthQ(quarters, selectedDates, endMonth) {
    for (let key in quarters) {
      if (quarters[key] === selectedDates.selectedEndQuarter) {
        endMonth = +key + 2;
      }
    }
    return endMonth;
  }

  // Create list of years for year range selectors
  yearsRange(selectedDates) {
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
    selectedDates.fromYearList = allYears;
    selectedDates.toYearList = allYears;
  }

  // Create list of quarters for quarter range selectors
  quartersRange(selectedDates) {
    let allQuarters = ['Q4', 'Q3', 'Q2', 'Q1'];
    selectedDates.fromQuarterList = allQuarters;
    selectedDates.toQuarterList = allQuarters;
    this.minMaxYearQuarters(selectedDates);
    let minQuarter = selectedDates.fromQuarterList[selectedDates.fromQuarterList.length - 1];
    let maxQuarter = selectedDates.toQuarterList[0];
    selectedDates.selectedStartQuarter = selectedDates.fromQuarterList.indexOf(selectedDates.selectedStartQuarter) > -1 ? selectedDates.selectedStartQuarter : minQuarter;
    selectedDates.selectedEndQuarter = selectedDates.toQuarterList.indexOf(selectedDates.selectedEndQuarter) > -1 ? selectedDates.selectedEndQuarter : maxQuarter;
  }

  // Create list of months for month range selectors
  monthsRange(selectedDates) {
    let allMonths = ['12', '11', '10', '09', '08', '07', '06', '05', '04', '03', '02', '01'];
    selectedDates.fromMonthList = allMonths;
    selectedDates.toMonthList = allMonths;
    this.minMaxYearMonths(selectedDates, allMonths);
    let minMonth = selectedDates.fromMonthList[selectedDates.fromMonthList.length - 1];
    let maxMonth = selectedDates.toMonthList[0];
    selectedDates.selectedStartMonth = selectedDates.fromMonthList.indexOf(selectedDates.selectedStartMonth) > -1 ? selectedDates.selectedStartMonth : minMonth;
    selectedDates.selectedEndMonth = selectedDates.toMonthList.indexOf(selectedDates.selectedEndMonth) > -1 ? selectedDates.selectedEndMonth : maxMonth;
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

  minYearQuarters(month) {
    let q = ['Q4', 'Q3', 'Q2', 'Q1'];
    if (4 <= month && month < 7) {
      return q.slice(0, 3);
    }
    if (7 <= month && month < 10) {
      return q.slice(0, 2);
    }
    if (10 <= month) {
      return q.slice(0, 1);
    }
    return q;
  }

  maxYearQuarters(month) {
    let q = ['Q4', 'Q3', 'Q2', 'Q1'];
    if (1 <= month && month < 4) {
      return q.slice(3);
    }
    if (4 <= month && month < 7) {
      return q.slice(2);
    }
    if (7 <= month && month < 10) {
      return q.slice(1);
    }
    return q;
  }

  formatLevelData(seriesObservations, frequency: string, decimals: number, results: Object, dates) {
    let obs = seriesObservations;
    let level = obs.transformationResults[0].observations;

    if (level) {
      level.forEach((entry) => {
        if (frequency === 'A') {
          let tableDate = entry.date.substr(0, 4);
          results[tableDate] = this.formatNum(+entry.value, decimals);
        }
        if (frequency === 'Q') {
          let q = {'01': 'Q1', '04': 'Q2', '07': 'Q3', '10': 'Q4'};
          let tableDate = entry.date.substr(0, 4) + ' ' + q[entry.date.substr(5, 2)];
          results[tableDate] = this.formatNum(+entry.value, decimals);
        }
        if (frequency === 'M') {
          let tableDate = entry.date.substr(0, 7);
          results[tableDate] = this.formatNum(+entry.value, decimals);
        }
      });
    }
    return results;
  }

  formatNum(num: number, decimal: number) {
    let fixedNum: any;
    fixedNum = num.toFixed(decimal);
    // remove decimals 
    let int = fixedNum | 0;
    let signCheck = num < 0 ? 1 : 0;
    // store deicmal value
    let remainder = Math.abs(fixedNum - int);
    let decimalString = ('' + remainder.toFixed(decimal)).substr(2, decimal);
    let intString = '' + int, i = intString.length;
    let r = ' ';
    while ((i -= 3) > signCheck) { r = ',' + intString.substr(i, 3) + r; }
    let returnValue = intString.substr(0, i + 3) + r + (decimalString ? '.' + decimalString : '');
    // If int == 0, converting int to string drops minus sign
    if (int == 0 && num < 0) {
      return '-' + returnValue;
    }
    return returnValue;
  }

  formatGeos(geo) {
    return { id: geo.handle, text: geo.name ? geo.name : geo.handle, freqs: geo.freqs };
  }

  formatFreqs(freq) {
    return { id: freq.freq, text: freq.label, geos: freq.geos };
  }

  // Get a unique array of available regions for a category
  uniqueGeos(geo: Geography, geoList: Array<any>) {
    let exist = false;
    for (let i in geoList) {
      // Multiselect Dropdown Component (geo & freq selectors) requires name and id properties
      if (geo.id === geoList[i].id) {
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
      geoList.push(geo);
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
      if (freq.text === freqList[i].text) {
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
      freqList.push(freq);
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

  freqSort (freqArray: Array<Frequency>): Array<Frequency> {
    let freqOrder = ['A', 'Q', 'M'];
    freqArray.sort(function (a, b) {
      let aSort = freqOrder.indexOf(a.id);
      let bSort = freqOrder.indexOf(b.id);
      return (aSort < bSort) ? - 1 : (aSort > bSort) ? 1 : 0;
    });
    return freqArray;
  }

  areaSort (geoArray: Array<Geography>): Array<Geography> {
    let areaOrder = ['HI', 'HAW', 'HON', 'KAU', 'MAU'];
    geoArray.sort(function (a, b) {
      let aSort = areaOrder.indexOf(a.id);
      let bSort = areaOrder.indexOf(b.id);
      return (aSort < bSort) ? -1 : (aSort > bSort) ? 1 : 0;
    });
    return geoArray;
  }

}
