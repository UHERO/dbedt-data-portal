import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { HelperService } from 'app/helper.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-year-selector',
  templateUrl: './year-selector.component.html',
  styleUrls: ['./year-selector.component.scss']
})
export class YearSelectorComponent implements OnInit, OnDestroy {
  @Input() rangeLabel: string;
  @Output() selectedYearChange = new EventEmitter();
  years: Array<string>;
  selectedYear: string;
  maxDateRangeSubscription: Subscription;

  constructor(private _helperService: HelperService) { }

  ngOnInit(): void {
    this.maxDateRangeSubscription = this._helperService.maxDateRange.subscribe((dateRange) => {
      const { start, end } = dateRange;
      let startYear = +start.substring(0, 4);
      const endYear = +end.substring(0, 4);
      this.years = [];
      while (startYear <= endYear) {
        this.years.push(startYear.toString());
        startYear += 1;
      }
      this.years.reverse();
      if (this.rangeLabel === 'To') {
        this.selectedYear = this.years[0];
      }
      if (this.rangeLabel === 'From') {
        this.selectedYear = this.years[this.years.length - 1];
      }
      this.selectedYearChange.emit(this.selectedYear);
    });
  }

  ngOnDestroy(): void {
    this.maxDateRangeSubscription.unsubscribe();
  }

  onChange(newYear: string) {
    this.selectedYear = this.years.find(year => year === newYear);
    this.selectedYearChange.emit(this.selectedYear);
  }
}
