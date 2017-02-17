import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-month-selector',
  templateUrl: './month-selector.component.html',
  styleUrls: ['./month-selector.component.scss']
})
export class MonthSelectorComponent implements OnInit {
  @Input() months;
  
  constructor() { }

  ngOnInit() {
  }

}
