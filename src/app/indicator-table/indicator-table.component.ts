import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { HelperService } from '../helper.service';
import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-fixedcolumns';

@Component({
  selector: 'app-indicator-table',
  templateUrl: './indicator-table.component.html',
  styleUrls: ['./indicator-table.component.scss']
})
export class IndicatorTableComponent implements OnInit, OnChanges {
  @Input() dateArray;
  @Input() tableData;
  @Input() datesSelected;
  private tableWidget: any;

  constructor(private _helper: HelperService) { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.initDatatable();
  }

  initDatatable(): void {
    console.log('dates selected', this.datesSelected)
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
      columns: tableColumns,
      scrollY: '450px',
      scrollX: true,
      paging: false,
      searching: false,
      fixedColumns: {
        'leftColumns': 3
      },
    });
    this.tableWidget.columns([-1, -2]).visible(false);
  }
}
