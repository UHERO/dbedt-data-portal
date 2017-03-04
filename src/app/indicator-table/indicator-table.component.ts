import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { HelperService } from '../helper.service';
import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-fixedcolumns';
import 'datatables.net-buttons/js/buttons.html5.js';

@Component({
  selector: 'app-indicator-table',
  templateUrl: './indicator-table.component.html',
  styleUrls: ['./indicator-table.component.scss']
})
export class IndicatorTableComponent implements OnInit, OnChanges {
  @Input() dateArray;
  @Input() tableData;
  @Input() datesSelected;
  differ: any;
  private tableWidget: any;

  constructor() {}

  ngOnInit() {
  }

  ngOnChanges(inputChanges) {
    this.initDatatable();
  }

  initDatatable(): void {
    let tableColumns = [];
    let exampleId: any = $('#indicator-table');
    if (this.tableWidget) {
      // Destroy table if table has already been initialized
      this.tableWidget.destroy();
      exampleId.empty();
    }
    tableColumns.push({title: 'Indicator', data: 'indicator'}, {title: 'Region', data: 'region'}, {title: 'Units', data: 'units'})
    this.dateArray.forEach((date) => {
      tableColumns.push({title: date.tableDate, data: 'observations.' + date.tableDate });
    });
    tableColumns.push({title: 'Source', data: 'source'});
    this.tableWidget = exampleId.DataTable({
      data: this.tableData,
      dom: 'Bfrt',
      buttons: ['excel', 'csv', 'pdf'],
      columns: tableColumns,
      scrollY: '400px',
      scrollX: true,
      paging: false,
      searching: false,
      info: false,
      fixedColumns: {
        'leftColumns': 3
      },
    });
    //this.tableWidget.buttons().container().appendTo($('.content-col', this.tableWidget.table().container()))
  }
}
