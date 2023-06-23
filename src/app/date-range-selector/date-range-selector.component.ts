import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HelperService } from 'app/helper.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-date-range-selector',
  templateUrl: './date-range-selector.component.html',
  styleUrls: ['./date-range-selector.component.scss']
})
export class DateRangeSelectorComponent implements OnInit {
  @Input() displayQuarterly: boolean;
  @Input() displayMonthly: boolean;
  @Output() dateChange = new EventEmitter();
  @Output() throwDateError = new EventEmitter();
  maxDateRange;
  maxDateRangeSubscription: Subscription;
  years: Array<string>;
  startQuarters: Array<{value: string, label: string}>;
  endQuarters: Array<{value: string, label: string}>;
  startMonths: Array<any>;
  endMonths: Array<any>;


  constructor(private _helperService: HelperService, public fb: FormBuilder) { }
  
  dateRangeForm = this.fb.group({
    startYear: ['', [Validators.required]],
    endYear: ['', [Validators.required]],
    startQuarter: '',
    endQuarter: '',
    startMonth: '',
    endMonth: ''
  });

  QUARTERS = [{
    value: '01', label: 'Q1'
  }, {
    value: '04', label: 'Q2'
  }, {
    value: '07', label: 'Q3'
  }, {
    value: '10', label: 'Q4'
  }];

  ngOnInit() {
    this.maxDateRangeSubscription = this._helperService.maxDateRange.subscribe((dateRange) => {
      this.maxDateRange = dateRange;
      const { start, end } = dateRange;
      // set years arrays
      this.years = this.getYears(start, end);
      // set quarters arrays
      this.startQuarters = this.getQuarters(start, end, this.years[0]);
      this.endQuarters = this.getQuarters(start, end, this.years[this.years.length - 1]);
      // set months arrays
      this.startMonths = this.getMonths(start, end, this.years[0]);
      this.endMonths = this.getMonths(start, end, this.years[this.years.length - 1]);
      // set default years, quarters, months
      this.dateRangeForm.patchValue({
        startYear: this.years[0],
        endYear: this.years[this.years.length - 1],
        startQuarter: this.startQuarters[0].value,
        endQuarter: this.endQuarters[this.endQuarters.length - 1].value,
        startMonth: this.startMonths[0],
        endMonth: this.endMonths[this.endMonths.length - 1]
      });
      this.dateChange.emit(this.dateRangeForm.value);
    });
  }

  changeDate(e: any, formControl: string) {
    this.dateRangeForm.get(formControl).setValue(e.target.value);
    if (formControl === 'startYear') {
      this.startQuarters = this.getQuarters(this.maxDateRange.start, this.maxDateRange.end, e.target.value);
      this.startMonths = this.getMonths(this.maxDateRange.start, this.maxDateRange.end, e.target.value);
    }
    if (formControl === 'endYear') {
      this.endQuarters = this.getQuarters(this.maxDateRange.start, this.maxDateRange.end, e.target.value);
      this.endMonths = this.getMonths(this.maxDateRange.start, this.maxDateRange.end, e.target.value);
    }
    this.dateChange.emit(this.dateRangeForm.value);
  }

  getYears = (start: string, end: string) => {
    let startYear = +start.substring(0, 4);
    const endYear = +end.substring(0, 4);
    const years = [];
    while (startYear <= endYear) {
      years.push(`${startYear}`);
      startYear += 1;
    }
    return years;
  }

  getQuarters = (start: string, end: string, selectedYear: string) => {
    const startYear = start.substring(0, 4);
    const endYear = end.substring(0, 4);
    if (selectedYear === startYear) {
      return this.minYearQuarters(+start.substring(5, 7));
    }
    if (selectedYear === endYear) {
      return this.maxYearQuarters(+end.substring(5, 7));
    }
    return this.QUARTERS;
  }

  minYearQuarters(month: number) {
    if (4 <= month && month < 7) {
      return this.QUARTERS.slice(1);
    }
    if (7 <= month && month < 10) {
      return this.QUARTERS.slice(2);
    }
    if (10 <= month) {
      return this.QUARTERS.slice(3);
    }
    return this.QUARTERS;
  }

  maxYearQuarters(month: number) {
    if (1 <= month && month < 4) {
      return this.QUARTERS.slice(0, 1);
    }
    if (4 <= month && month < 7) {
      return this.QUARTERS.slice(0, 2);
    }
    if (7 <= month && month < 10) {
      return this.QUARTERS.slice(0, 3);
    }
    return this.QUARTERS;
  }

  getMonths = (start: string, end: string, selectedYear: string) => {
    const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    const startYear = start.substring(0, 4);
    const endYear = end.substring(0, 4);
    if (selectedYear === startYear) {
      return months.slice(months.indexOf(start.substring(5, 7)));
    }
    if (selectedYear === endYear) {
      return months.slice(0, months.indexOf(end.substring(5, 7)) + 1);
    }
    return months;
  }
}
