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
    let tableColumns = [{title: 'Indicator', data: 'indicator'}, {title: 'Region', data: 'region'}, {title: 'Units', data: 'units'}];
    this.dateArray.forEach((date) => {
      // tableColumns.push({title: date.tableDate});
    });
    tableColumns.push({title: 'Source', data: 'source'});
    console.log(this.seriesData)
    this.dtOptions = {
      columns: tableColumns,
      data: this.seriesData
    }
  }
}
