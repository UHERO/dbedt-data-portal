import { Component, OnInit, Input, OnChanges, ViewEncapsulation } from '@angular/core';
import { HelperService } from '../helper.service';
import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-fixedcolumns';
import 'datatables.net-buttons/js/dataTables.buttons.js';
import 'datatables.net-buttons/js/buttons.html5.js';
import 'datatables.net-buttons/js/buttons.flash.js';
import 'datatables.net-buttons/js/buttons.print.js';
declare var jsPDF: any;

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
    let pdfColumns = [];
    let exampleId: any = $('#indicator-table');
    if (this.tableWidget) {
      // Destroy table if table has already been initialized
      this.tableWidget.destroy();
      exampleId.empty();
    }
    tableColumns.push({ title: 'Indicator', data: 'indicator' }, { title: 'Area', data: 'region' }, { title: 'Units', data: 'units' });
    pdfColumns.push({ title: 'Indicator', dataKey: 'indicator' }, { title: 'Area', dataKey: 'region'}, { title: 'Units', data: 'units' });
    this.dateArray.forEach((date) => {
      tableColumns.push({ title: date.tableDate, data: 'observations.' + date.tableDate });
      pdfColumns.push({ title: date.tableDate, dataKey: 'observations.' + date.tableDate });
    });
    tableColumns.push({ title: 'Source', data: 'source' });
    pdfColumns.push({ title: 'Source', dataKey: 'source'});
    let tableData = this.tableData
    this.tableWidget = exampleId.DataTable({
      data: this.tableData,
      dom: 'Bt',
      buttons: [
        {
          extend: 'excel',
          text: '<i class="fa fa-file-excel-o" aria-hidden="true" title="Excel"></i>',
          customizeData: function(xlsx) {
            let cols = xlsx.header.length;
            let dbedtFooter = [];
            let uheroFooter = [];
            let addRow = [];
            // Rows with different lengths break export
            for (let i = 0; i < cols; i++) {
              dbedtFooter.push('');
              uheroFooter.push('');
              addRow.push('');
            }
            dbedtFooter.unshift('Compiled by Research & Economic Analysis Division, State of Hawaii Department of Business, Economic Development and Tourism. For more information please visit: http://dbedt.hawaii.gov/');
            // Add an empty row before DBEDT and UHERO credit
            xlsx.body.push(addRow);
            xlsx.body.push(dbedtFooter);
          },
          customize: function(xlsx) {
            let sheet = xlsx.xl.worksheets['sheet1.xml'];
            let col = $('col', sheet);
            col.each(function() {
              $(this).attr('width', 15);
            })
          }
        },
        {
          extend: 'csv',
          text: '<i class="fa fa-file-text-o" aria-hidden="true" title="CSV"></i>',
          customize: function(csv) {
            return csv + '\n\n Compiled by Research & Economic Analysis Division State of Hawaii Department of Business Economic Development and Tourism. For more information please visit: http://dbedt.hawaii.gov/'
          }
        },
        {
          extend: 'pdf',
          text: '<i class="fa fa-file-pdf-o" aria-hidden="true" title="PDF"></i>',
          orientation: 'landscape',
          pageSize: 'letter',
          message: 'Research & Economic Analysis Division, DBEDT',
          customize: function (doc) {
            // Table rows should be divisible by 10
            // Maintain consistant table width (i.e. add empty strings if row has less than 10 data cells)
            function rowRightPad(row) {
              let paddedRow = [];
              row.forEach((item) => {
                paddedRow.push(item);
              });
              let rowDiff = paddedRow.length % 10;
              let addString = 10 - rowDiff;
              while (addString) {
                paddedRow.push({ text: ' ', style: ''});
                addString -= 1;
              }
              return paddedRow;
            }
            let currentTable = doc.content[2].table.body;
            let formattedTable: Array<any> = [];
            // Reformat table to allow for a maximum of 10 columns
            for (let i = 0; i < currentTable.length; i++) {
              let currentRow = currentTable[i];
              let paddedRow = rowRightPad(currentRow);
              let counter = currentTable.length;
              let indicator = { text: paddedRow[0].text, style: paddedRow[0].style };
              let newRow = [];
              for (let n = 1; n < paddedRow.length - 1; n++) {
                // Prevent empty rows from collapsing
                paddedRow[n].text = paddedRow[n].text === '' ? ' ' : paddedRow[n].text;
                newRow.push(paddedRow[n]);
                if (newRow.length === 9 || n === paddedRow.length - 1) {
                  let copy = Object.assign({}, indicator);
                  // Add indicator to start of new row
                  newRow.unshift(copy);
                  if (newRow.length < 10) {
                    newRow = rowRightPad(newRow);
                  }
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
            doc.content[2].table.dontBreakRows = true;
            doc.content[2].table.headerRows = 0;
            doc.content[2].table.body = formattedTable
            doc.content.push({
              text: 'Compiled by Research & Economic Analysis Division, State of Hawaii Department of Business, Economic Development and Tourism. For more information, please visit: http://dbedt.hawaii.gov/',
            });
          }
        },
        {
          extend: 'print',
          text: '<i class="fa fa-print" aria-hidden="true" title="Print"></i>',
          message: 'Research & Economic Analysis Division, DBEDT',
          customize: function (win) {
            function splitTable(table) {
              let rows = table.find('tr');
              $('<table>').insertAfter(table);
              const limit = 9;

              if (table.find('tr:first-child>th').length > limit) {
                let newTable = table.next('table');
                newTable.addClass('stripe dataTable')
                newTable.append('<tbody>');
                rows.each(function () {
                  let tr = $(this);
                  let clone = tr.clone();
                  clone.html('');
                  newTable.find('tbody').append(clone);
                  let lastTr = newTable.find('tr:last-child');
                  lastTr.append($('>:gt(' + limit + ')', this));
                });
                splitTable(newTable);
              }
            }
            let dtTable = $(win.document.body).find('table');
            splitTable(dtTable);
            $(win.document.body).find('table:nth-child(odd) td').each(function (index) {
              $(this).css('background-color', '#F9F9F9');
            });
            $(win.document.body).find('table:last-child').after("<p>Compiled by Research & Economic Analysis Division, State of Hawaii Department of Business, Economic Development and Tourism. For more information, please visit: http://dbedt.hawaii.gov/</p>")
          }
        }],
      columns: tableColumns,
      columnDefs: [
        { "className": "td-left", "targets": [0, 1, 2] },
        { "className": "td-right", "targets": "_all" }
      ],
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
