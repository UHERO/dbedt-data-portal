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
  encapsulation: ViewEncapsulation.None
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
        {
          extend: 'excel',
          text: '<i class="fa fa-file-excel-o" aria-hidden="true" title="Excel"></i>'
        },
        {
          extend: 'csv',
          text: '<i class="fa fa-file-text-o" aria-hidden="true" title="CSV"></i>'
        },
        {
          extend: 'pdf',
          text: '<i class="fa fa-file-pdf-o" aria-hidden="true" title="PDF"></i>',
          orientation: 'landscape',
          pageSize: 'letter',
          message: 'Research & Economic Analysis Division, DBEDT',
          customize: function (doc) {
            let currentTable = doc.content[2].table.body;
            let formattedTable: Array<any> = [];
            console.log('table', currentTable);
            // Reformat table to allow for a maximum of 10 columns
            for (let i = 0; i < currentTable.length; i++) {
              let newRow = [];
              let currentRow = currentTable[i];
              // Prevent ending cells from falling off/Maintain consistant table width
              let rowDiff = currentRow.length % 10;
              let addString = 10 - rowDiff;
              while (addString) {
                currentRow.push({text: ''});
                addString -= 1;
              }
              let counter = currentTable.length;
              for (let n = 0; n < currentRow.length; n++) {
                newRow.push(currentRow[n]);
                if (newRow.length > 0 && newRow.length % 10 === 0) {
                  if (!formattedTable[i]) {
                    formattedTable[i] = newRow;
                  } else {
                    formattedTable[i + counter] = newRow;
                    counter += currentTable.length;
                  }
                  newRow = [];
                }
              }
            }
            console.log('formatted table', formattedTable);
            doc.content[2].table.dontBreakRows = true;
            doc.content[2].table.widths = [100, 100, 100, 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'];
            doc.content[2].table.headerRows = 0;
            doc.content[2].table.body = formattedTable
            doc.content.push({
              text: 'Compiled by Research & Economic Analysis Division, State of Hawaii Department of Business, Economic Development and Tourism. For more information, please visit: http://dbedt.hawaii.gov/ \n The Economic Research Organization at the University of Hawaii: http://uhero.hawaii.edu/',
            });
            console.log(doc);
          }
        },
        {
          extend: 'print',
          text: '<i class="fa fa-print" aria-hidden="true" title="Print"></i>',
          message: 'Research & Economic Analysis Division, DBEDT',
          customize: function (win) {
            console.log('win document', win.document.body)
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
  }
}
