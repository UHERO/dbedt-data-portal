import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-month-selector',
  templateUrl: './month-selector.component.html',
  styleUrls: ['./month-selector.component.scss']
})
export class MonthSelectorComponent implements OnInit {
  @Input() months;
  @Input() selectedMonth;
  @Output() selectedMonthChange = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onChange(newMonth) {
    this.selectedMonth = this.months.find(month => month === newMonth);
    this.selectedMonthChange.emit(this.selectedMonth);
  }
}
