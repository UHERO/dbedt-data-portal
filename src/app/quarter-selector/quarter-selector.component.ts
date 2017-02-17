import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-quarter-selector',
  templateUrl: './quarter-selector.component.html',
  styleUrls: ['./quarter-selector.component.scss']
})
export class QuarterSelectorComponent implements OnInit {
  @Input() quarters;
  
  constructor() { }

  ngOnInit() {
  }

}
