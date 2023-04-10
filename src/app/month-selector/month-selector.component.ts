import { Component, OnInit, OnChanges, OnDestroy, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { HelperService } from 'app/helper.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-month-selector',
  templateUrl: './month-selector.component.html',
  styleUrls: ['./month-selector.component.scss']
})
export class MonthSelectorComponent implements OnInit, OnChanges, OnDestroy {
  months: Array<any>
  selectedMonth: string;
  @Input() rangeLabel: string;
  @Input() currentMonth: string;
  @Input() selectedYear: string;
  @Output() selectedMonthChange = new EventEmitter();
  maxDateRange;
  maxDateRangeSubscription: Subscription;

  constructor(private _helperService: HelperService) { }

  ngOnInit() {
    this.maxDateRangeSubscription = this._helperService.maxDateRange.subscribe((dateRange) => {
      this.maxDateRange = dateRange;
      this.updateMonthDropdowns(dateRange, this.rangeLabel, this.selectedYear, '');
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const selectedYearChange = changes['selectedYear'];
    if (selectedYearChange && !selectedYearChange.firstChange) {
      this.updateMonthDropdowns(this.maxDateRange, this.rangeLabel, this.selectedYear, this.currentMonth);
    }
  }

  ngOnDestroy(): void {
    this.maxDateRangeSubscription.unsubscribe();
  }

  updateMonthDropdowns = (dateRange, rangeLabel: string, selectedYear: string, currentMonth: string) => {
    const { start, end } = dateRange;
    this.months = this.getMonths(start, end, selectedYear);
    const selectedMonthIndex = this.getSelectedMonthIndex(this.months, currentMonth, rangeLabel);
    this.selectedMonth = this.months[selectedMonthIndex];
    this.selectedMonthChange.emit(this.selectedMonth);
  }

  getSelectedMonthIndex = (monthList: Array<string>, currentMonth: string, rangeLabel: string) => {
    const currentMonthIndex = monthList.indexOf(currentMonth);
    if (currentMonthIndex > -1) {
      return currentMonthIndex;
    }
    return rangeLabel === 'From Month' ? 0 : monthList.length - 1;
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

  onChange(newMonth) {
    this.selectedMonth = this.months.find(month => month === newMonth);
    this.selectedMonthChange.emit(this.selectedMonth);
  }
}
