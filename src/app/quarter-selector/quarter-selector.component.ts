import { Component, OnInit, OnChanges, OnDestroy, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { HelperService } from 'app/helper.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-quarter-selector',
  templateUrl: './quarter-selector.component.html',
  styleUrls: ['./quarter-selector.component.scss']
})
export class QuarterSelectorComponent implements OnInit, OnChanges, OnDestroy {
  quarters: Array<string>
  @Input() rangeLabel: string;
  @Input() currentQuarter: string;
  @Input() selectedYear: string;
  @Output() selectedQuarterChange = new EventEmitter();
  selectedQuarter: string;
  maxDateRange;
  maxDateRangeSubscription: Subscription;

  constructor(private _helperService: HelperService) { }

  ngOnInit() {
    this.maxDateRangeSubscription = this._helperService.maxDateRange.subscribe((dateRange) => {
      this.maxDateRange = dateRange;
      this.updateQuarterDropdowns(this.maxDateRange, this.rangeLabel, this.selectedYear, '');
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const selectedYearChange = changes['selectedYear'];
    if (selectedYearChange && !selectedYearChange.firstChange) {
      this.updateQuarterDropdowns(this.maxDateRange, this.rangeLabel, this.selectedYear, this.currentQuarter);
    }
  }

  ngOnDestroy(): void {
    this.maxDateRangeSubscription.unsubscribe();
  }

  onChange(newQuarter) {
    this.selectedQuarter = this.quarters.find(quarters => quarters === newQuarter);
    this.selectedQuarterChange.emit(this.selectedQuarter);
  }

  updateQuarterDropdowns = (dateRange, rangeLabel: string, selectedYear: string, currentQuarter: string) => {
    const { start, end } = dateRange;
    this.quarters = this.getQuarters(start, end, selectedYear);
    const selectedQuarterIndex = this.getSelectedQuarterIndex(this.quarters, currentQuarter, rangeLabel);
    this.selectedQuarter = this.quarters[selectedQuarterIndex];
    this.selectedQuarterChange.emit(this.selectedQuarter);
  }

  getSelectedQuarterIndex = (quarterList: Array<string>, currentQuarter: string, rangeLabel: string) => {
    const currentQuarterIndex = quarterList.indexOf(currentQuarter);
    if (currentQuarterIndex > -1) {
      return currentQuarterIndex;
    }
    return rangeLabel === 'From Quarter' ? 0 : quarterList.length - 1;
  }

  getQuarters = (start: string, end: string, selectedYear: string) => {
    const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
    const startYear = start.substring(0, 4);
    const endYear = end.substring(0, 4);
    if (selectedYear === startYear) {
      return this.minYearQuarters(+start.substring(5, 7));
    }
    if (selectedYear === endYear) {
      return this.maxYearQuarters(+end.substring(5, 7));
    }
    return quarters;
  }

  minYearQuarters(month: number) {
    const q = ['Q1', 'Q2', 'Q3', 'Q4'];
    if (4 <= month && month < 7) {
      return q.slice(1);
    }
    if (7 <= month && month < 10) {
      return q.slice(2);
    }
    if (10 <= month) {
      return q.slice(3);
    }
    return q;
  }

  maxYearQuarters(month) {
    const q = ['Q1', 'Q2', 'Q3', 'Q4'];
    if (1 <= month && month < 4) {
      return q.slice(0, 1);
    }
    if (4 <= month && month < 7) {
      return q.slice(0, 2);
    }
    if (7 <= month && month < 10) {
      return q.slice(0, 3);
    }
    return q;
  }
}
