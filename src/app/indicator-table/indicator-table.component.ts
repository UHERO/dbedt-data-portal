import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { HelperService } from '../helper.service';
import 'datatables.net-fixedcolumns';

@Component({
  selector: 'app-indicator-table',
  templateUrl: './indicator-table.component.html',
  styleUrls: ['./indicator-table.component.scss']
})
export class IndicatorTableComponent implements OnInit, OnChanges {
  @Input() dateArray;
  @Input() tableData;
  private dtOptions: any = {};

  constructor(private _helper: HelperService) { }

  ngOnInit() {
  }

  ngOnChanges() {
    console.log('indicator table', this.tableData);
    let tableColumns = [{title: 'Indicator', data: 'indicator'}, {title: 'Region', data: 'region'}, {title: 'Units', data: 'units'}];
    this.dateArray.forEach((date) => {
      tableColumns.push({title: date.tableDate, data: 'observations.' + date.tableDate });
    });
    tableColumns.push({title: 'Source', data: 'source'});
    this.dtOptions = {
      columns: tableColumns,
      data: this.tableData,
      'scrollY': '450px',
      'scrollX': true,
      'scrollCollapse': true,
      'paging': false,
      'fixedColumns': {
        'leftColumns': 3
      }
    }
  }
}
