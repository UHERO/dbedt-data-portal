import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-year-selector',
  templateUrl: './year-selector.component.html',
  styleUrls: ['./year-selector.component.scss']
})
export class YearSelectorComponent implements OnInit {
  @Input() years;
  @Input() selectedYear;
  @Input() rangeLabel;
  @Output() selectedYearChange = new EventEmitter();
  
  constructor() { }

  ngOnInit() {
  }

  onChange(newYear) {
    this.selectedYear = this.years.find(year => year === newYear);
    this.selectedYearChange.emit(this.selectedYear);
  }
}
