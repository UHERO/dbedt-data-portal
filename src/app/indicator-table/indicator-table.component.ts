import { Component, OnInit, Input, OnChanges, ViewEncapsulation } from '@angular/core';
import { HelperService } from '../helper.service';
import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-fixedcolumns';
import 'datatables.net-buttons/js/dataTables.buttons.js';
import 'datatables.net-buttons/js/buttons.html5.js';
import 'datatables.net-buttons/js/buttons.flash.js';
import 'datatables.net-buttons/js/buttons.print.js';

@Component({
  selector: 'app-indicator-table',
  templateUrl: './indicator-table.component.html',
  styleUrls: ['./indicator-table.component.scss'],
})
export class IndicatorTableComponent implements OnInit, OnChanges {
  @Input() dateArray;
  @Input() tableData;
  @Input() datesSelected;
  differ: any;
  private tableWidget: any;

  constructor() { }

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
    tableColumns.push({ title: 'Indicator', data: 'indicator' }, { title: 'Area', data: 'region' }, { title: 'Units', data: 'units' })
    this.dateArray.forEach((date) => {
      tableColumns.push({ title: date.tableDate, data: 'observations.' + date.tableDate });
    });
    tableColumns.push({ title: 'Source', data: 'source' });
    this.tableWidget = exampleId.DataTable({
      data: this.tableData,
      dom: 'Bfrt',
      buttons: [
        'excel',
        'csv',
        {
          extend: 'pdf',
          orientation: 'landscape',
          pageSize: 'Tabloid',
          message: 'Research & Economic Analysis Division, DBEDT',
          customize: function (doc) {
            doc.content[2].table.dontBreakRows = true,
              doc.content.push({
                text: 'Compiled by Research & Economic Analysis Division, State of Hawaii Department of Business, Economic Development and Tourism. For more information, please visit: http://dbedt.hawaii.gov/ \n The Economic Research Organization at the University of Hawaii: http://uhero.hawaii.edu/',
              });
            console.log(doc);
          }
        },
        {
          extend: 'print',
          message: 'Research & Economic Analysis Division, DBEDT',
          customize: function (win) {
            $(win.document.body).find('tr:nth-child(odd) td').each(function (index) {
              $(this).css('background-color', '#F9F9F9');
            });
            $(win.document.body).find('table').after("<p>Compiled by Research & Economic Analysis Division, State of Hawaii Department of Business, Economic Development and Tourism. For more information, please visit: http://dbedt.hawaii.gov/ <br> The Economic Research Organization at the University of Hawaii: http://uhero.hawaii.edu/</p>")
          }
        }],
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
