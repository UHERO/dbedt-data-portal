import { Injectable } from '@angular/core';

import { Geography } from './geography';
import { Frequency } from './frequency';
import { DatesSelected } from './dates-selected';

@Injectable()
export class HelperService {

  constructor() { }

  categoryDateArray(selectedDates, selectedFreqs: Array<string>) {
    // Dates used in table header
    const dateArray = [];
    const m = { 1: '01', 2: '02', 3: '03', 4: '04', 5: '05', 6: '06', 7: '07', 8: '08', 9: '09', 10: '10', 11: '11', 12: '12' };
    const q = { 1: 'Q1', 4: 'Q2', 7: 'Q3', 10: 'Q4' };
    console.log(selectedDates)
    let startYear = +selectedDates.startDate.substring(0, 4);
    let endYear = +selectedDates.endDate.substring(0, 4);
    let startMonth = +selectedDates.startDate.substring(5, 7);
    let endMonth = +selectedDates.endDate.substring(5, 7);
    const annualSelected = selectedFreqs.indexOf('A') > -1;
    const monthSelected = selectedFreqs.indexOf('M') > -1;
    const quarterSelected = selectedFreqs.indexOf('Q') > -1;
    // Check if selectedDates' properties have values set (i.e. date range selectors have been used)
    const dates = this.checkSelectedDates(selectedDates, monthSelected, startYear, endYear, startMonth, endMonth, q);
    startYear = dates.startYear;
    endYear = dates.endYear;
    startMonth = dates.startMonth;
    endMonth = dates.endMonth;
    while (`${startYear}-${m[startMonth]}-01` <= `${endYear}-${m[endMonth]}-01`) {
      // Frequency display order: M, Q, A
      if (monthSelected) {
        dateArray.push({date: `${startYear.toString()}-${m[startMonth]}-01`, tableDate: `${startYear.toString()}-${m[startMonth]}` });
      }
      if (quarterSelected) {
        const qMonth = this.addQuarterObs(startMonth, monthSelected);
        if (qMonth) {
          dateArray.push({date: `${startYear.toString()}-${m[qMonth]}-01`, tableDate: `${startYear.toString()} ${q[qMonth]}`});
        }
      }
      if (annualSelected) {
        const addAnnual = this.addAnnualObs(startMonth, monthSelected, quarterSelected);
        if (addAnnual) {
          dateArray.push({date: `${startYear.toString()}-01-01`, tableDate: startYear.toString()});
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
      if (monthCheck) { return qMonth; };
    }
    // If M is selected, add Q after months 3, 7, 9, 12 (i.e. startMonth === 3, 7, 9, 12)
    if (monthSelected) {
      qMonth = startMonth - 2;
      monthCheck = this.checkStartMonth(startMonth);
      if (monthCheck) { return qMonth; };
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
    return { startYear, endYear, startMonth, endMonth };
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
    for (const key in quarters) {
      if (quarters[key] === selectedDates.selectedStartQuarter) {
        startMonth = +key;
      }
    }
    return startMonth;
  }

  // Get end month based on selected end quarter
  setEndMonthQ(quarters, selectedDates, endMonth) {
    for (const key in quarters) {
      if (quarters[key] === selectedDates.selectedEndQuarter) {
        endMonth = +key + 2;
      }
    }
    return endMonth;
  }

  // Create list of years for year range selectors
  yearsRange(selectedDates) {
    let allYears = [];
    let startYear = +selectedDates.startDate.substring(0, 4);
    const endYear = +selectedDates.endDate.substring(0, 4);
    while (startYear <= endYear) {
      allYears.push(startYear.toString());
      startYear += 1;
    }
    allYears = allYears.reverse();
    const minYear = allYears[allYears.length - 1];
    const maxYear = allYears[0];
    const selectedStartIndex = allYears.indexOf(selectedDates.selectedStartYear);
    const selectedEndIndex = allYears.indexOf(selectedDates.selectedEndYear);
    selectedDates.selectedStartYear = selectedStartIndex > -1 ? selectedDates.selectedStartYear : minYear;
    selectedDates.selectedEndYear = selectedEndIndex > -1 ? selectedDates.selectedEndYear : maxYear;
    selectedDates.fromYearList = allYears;
    selectedDates.toYearList = allYears;
  }

  // Create list of quarters for quarter range selectors
  quartersRange(selectedDates) {
    const allQuarters = ['Q4', 'Q3', 'Q2', 'Q1'];
    selectedDates.fromQuarterList = allQuarters;
    selectedDates.toQuarterList = allQuarters;
    this.minMaxYearQuarters(selectedDates);
    const minQuarter = selectedDates.fromQuarterList[selectedDates.fromQuarterList.length - 1];
    const maxQuarter = selectedDates.toQuarterList[0];
    const selectedStartIndex = selectedDates.fromQuarterList.indexOf(selectedDates.selectedStartQuarter);
    const selectedEndIndex = selectedDates.toQuarterList.indexOf(selectedDates.selectedEndQuarter);
    selectedDates.selectedStartQuarter = selectedStartIndex > -1 ? selectedDates.selectedStartQuarter : minQuarter;
    selectedDates.selectedEndQuarter = selectedEndIndex > -1 ? selectedDates.selectedEndQuarter : maxQuarter;
  }

  // Create list of months for month range selectors
  monthsRange(selectedDates) {
    const allMonths = ['12', '11', '10', '09', '08', '07', '06', '05', '04', '03', '02', '01'];
    selectedDates.fromMonthList = allMonths;
    selectedDates.toMonthList = allMonths;
    this.minMaxYearMonths(selectedDates, allMonths);
    const minMonth = selectedDates.fromMonthList[selectedDates.fromMonthList.length - 1];
    const maxMonth = selectedDates.toMonthList[0];
    const selectedStartIndex = selectedDates.fromMonthList.indexOf(selectedDates.selectedStartMonth);
    const selectedEndIndex = selectedDates.toMonthList.indexOf(selectedDates.selectedEndMonth);
    selectedDates.selectedStartMonth = selectedStartIndex > -1 ? selectedDates.selectedStartMonth : minMonth;
    selectedDates.selectedEndMonth = selectedEndIndex > -1 ? selectedDates.selectedEndMonth : maxMonth;
  }

  minMaxYearQuarters(selectedDates) {
    // If selectedStartYear is set to earliest/latest possible year, set quarter list based on earliest/latest month available
    // If selectedStartYear is set to earliest/latest possible year, set quarter list based on earliest/latest month available
    const minYear = selectedDates.startDate.substring(0, 4);
    const maxYear = selectedDates.endDate.substring(0, 4);
    const startMonth = +selectedDates.startDate.substring(5, 7);
    const endMonth = +selectedDates.endDate.substring(5, 7);
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
    const minYear = selectedDates.startDate.substring(0, 4);
    const maxYear = selectedDates.endDate.substring(0, 4);
    const startMonth = selectedDates.startDate.substring(5, 7);
    const endMonth = selectedDates.endDate.substring(5, );
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
    const q = ['Q4', 'Q3', 'Q2', 'Q1'];
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
    const q = ['Q4', 'Q3', 'Q2', 'Q1'];
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

  formatLevelData(seriesObservations, newObservations, frequency: string, decimals: number, results: Object, dates) {
    const obs = seriesObservations;
    const newObs = newObservations;
    const level = newObs ? newObservations : obs.transformationResults.find(transforms => transforms.transformation === 'lvl').observations;
    if (level) {
      level.forEach((entry) => {
        if (frequency === 'A') {
          const tableDate = entry.date.substring(0, 4);
          results[tableDate] = this.formatNum(+entry.value, decimals);
        }
        if (frequency === 'Q') {
          const q = {'01': 'Q1', '04': 'Q2', '07': 'Q3', '10': 'Q4'};
          const tableDate = `${entry.date.substring(0, 4)} ${q[entry.date.substring(5, 7)]}`;
          results[tableDate] = this.formatNum(+entry.value, decimals);
        }
        if (frequency === 'M') {
          const tableDate = entry.date.substring(0, 7);
          results[tableDate] = this.formatNum(+entry.value, decimals);
        }
      });
    }
    return results;
  }

  formatNum(num: number, decimal: number) {
    return num === Infinity ? ' ' : num.toLocaleString('en-US', {minimumFractionDigits: decimal, maximumFractionDigits: decimal});
  }

  formatGeos(geo) {
    return { id: geo.handle, text: geo.name ? geo.name : geo.handle, freqs: geo.freqs, state: false };
  }

  formatFreqs(freq) {
    return { id: freq.freq, text: freq.label, geos: freq.geos, state: false };
  }

  // Get a unique array of available regions for a category
  uniqueGeos(geo: Geography, geoList: Array<any>) {
    let exist = false;
    for (const i in geoList) {
      // Multiselect Dropdown Component (geo & freq selectors) requires name and id properties
      if (geo.id === geoList[i].id) {
        exist = true;
        // If region already exists, check it's list of frequencies
        // Get a unique list of frequencies available for a region
        const freqs = geo.freqs;
        for (const j in freqs) {
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
    for (const n in freqArray) {
      if (freq === freqArray[n].freq) {
        return true;
      }
    }
    return false;
  }

  // Get a unique array of available frequencies for a category
  uniqueFreqs(freq: Frequency, freqList: Array<any>) {
    let exist = false;
    for (const i in freqList) {
      if (freq.text === freqList[i].text) {
        exist = true;
        // If frequency already exists, check it's list of regions
        // Get a unique list of regions available for a frequency
        const geos = freq.geos;
        for (const j in geos) {
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
    for (const n in geoArray) {
      if (geo === geoArray[n].handle) {
        return true;
      }
    }
    return false;
  }

  freqSort (freqArray: Array<Frequency>): Array<Frequency> {
    const freqOrder = ['A', 'Q', 'M'];
    freqArray.sort(function (a, b) {
      const aSort = freqOrder.indexOf(a.id);
      const bSort = freqOrder.indexOf(b.id);
      return (aSort < bSort) ? - 1 : (aSort > bSort) ? 1 : 0;
    });
    return freqArray;
  }

  areaSort (geoArray: Array<Geography>): Array<Geography> {
    const areaOrder = ['HI', 'HAW', 'HON', 'KAU', 'MAU'];
    geoArray.sort(function (a, b) {
      const aSort = areaOrder.indexOf(a.id);
      const bSort = areaOrder.indexOf(b.id);
      return (aSort < bSort) ? -1 : (aSort > bSort) ? 1 : 0;
    });
    return geoArray;
  }

}
