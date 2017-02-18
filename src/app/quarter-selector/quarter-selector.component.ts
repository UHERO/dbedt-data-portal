import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-quarter-selector',
  templateUrl: './quarter-selector.component.html',
  styleUrls: ['./quarter-selector.component.scss']
})
export class QuarterSelectorComponent implements OnInit {
  @Input() quarters;
  @Input () selectedQuarter;
  @Output() selectedQuarterChange = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onChange(newQuarter) {
    this.selectedQuarter = this.quarters.find(quarters => quarters === newQuarter);
    this.selectedQuarterChange.emit(this.selectedQuarter);
  }
}
