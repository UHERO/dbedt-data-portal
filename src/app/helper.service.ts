import { Injectable } from '@angular/core';

import { Geography } from './geography';
import { Frequency } from './frequency';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class HelperService {
  maxDateRangeChange: BehaviorSubject<any> = new BehaviorSubject({});
  maxDateRange = this.maxDateRangeChange.asObservable();

  constructor() { }

  updateMaxDateRange = (newDateRange/* : any */) => {
    this.maxDateRangeChange.next(newDateRange);
    return newDateRange;
  }

  setDateArray = (dateFormValues, quarterSelected: boolean, monthSelected: boolean) => {
    const dateArray = [];
    const m = { 1: '01', 2: '02', 3: '03', 4: '04', 5: '05', 6: '06', 7: '07', 8: '08', 9: '09', 10: '10', 11: '11', 12: '12' };
    const q = { 1: 'Q1', 4: 'Q2', 7: 'Q3', 10: 'Q4' };
    let { startYear, endYear, startQuarter, endQuarter, startMonth, endMonth } = dateFormValues;
    let minYear = +startYear;
    let minMonth = monthSelected ? +startMonth : quarterSelected ? +startQuarter : 1;
    let maxMonth = monthSelected ? +endMonth : quarterSelected ? +endQuarter : 1;
    while (`${minYear}-${m[minMonth]}-01` <= `${endYear}-${m[maxMonth]}-01`) {
      // Frequency display order: M, Q, A
      if (monthSelected) {
        dateArray.push({date: `${minYear}-${m[minMonth]}-01`, tableDate: `${minYear}-${m[minMonth]}` });
      }
      if (quarterSelected) {
        const qMonth = this.addQuarterObs(minMonth, monthSelected);
        if (qMonth) {
          dateArray.push({date: `${minYear}-${m[qMonth]}-01`, tableDate: `${minYear} ${q[qMonth]}`});
        }
      }
      const addAnnual = this.addAnnualObs(minMonth, monthSelected, quarterSelected);
      if (addAnnual) {
        dateArray.push({date: `${minYear}-01-01`, tableDate: `${minYear}`});
      }
      minYear = minMonth === 12 ? minYear += 1 : minYear;
      minMonth = minMonth === 12 ? 1 : minMonth += 1;
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

  // If returns true, add quarter to date array
  checkStartMonth(month) {
    if (month === 3 || month === 6 || month === 9 || month === 12) {
      return true;
    }
    return false;
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

  formatLevelData(seriesObservations, newObservations, frequency: string, decimals: number, results: Object) {
    const level = newObservations ?
      newObservations :
      seriesObservations.transformationResults.find(transforms => transforms.transformation === 'lvl').observations;
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
    return { id: geo.handle, text: geo.name ? geo.name : geo.handle, state: false };
  }

  formatFreqs(freq) {
    return { id: freq.freq, text: freq.label, state: false };
  }

  freqSort (freqArray: Array<Frequency>): Array<Frequency> {
    const freqOrder = ['A', 'Q', 'M'];
    return this.customSorter(freqArray, freqOrder);
  }

  areaSort (geoArray: Array<Geography>): Array<Geography> {
    const areaOrder = ['HI', 'HAW', 'HON', 'KAU', 'MAU'];
    return this.customSorter(geoArray, areaOrder);
  }

  customSorter = (arr: Array<Geography | Frequency>, ordering: Array<any>): Array<any> => {
    arr.sort((a, b) => {
      const aSort = ordering.indexOf(a.id);
      const bSort = ordering.indexOf(b.id);
      return (aSort < bSort) ? -1 : (aSort > bSort) ? 1 : 0;
    });
    return arr;
  }

}
