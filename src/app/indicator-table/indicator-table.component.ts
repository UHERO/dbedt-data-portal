import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-indicator-table',
  templateUrl: './indicator-table.component.html',
  styleUrls: ['./indicator-table.component.scss']
})
export class IndicatorTableComponent implements OnInit, OnChanges {
  @Input() dateArray;
  @Input() seriesData;
  private dtOptions: any = {};

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    console.log('on changes', this.dateArray);
    this.dtOptions = {
      columns: [
        { title: 'Indicator' },
        { title: 'Region' },
        { title: 'Units' },
      ],
    }
  }
}
