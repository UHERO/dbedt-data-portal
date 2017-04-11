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
    let indicatorTable: any = $('#indicator-table');
    if (this.tableWidget) {
      // Destroy table if table has already been initialized
      this.tableWidget.destroy();
      indicatorTable.empty();
    }
    tableColumns.push({ title: 'Indicator', data: 'indicator' }, { title: 'Area', data: 'region' }, { title: 'Units', data: 'units' });
    this.dateArray.forEach((date) => {
      tableColumns.push({ title: date.tableDate, data: 'observations.' + date.tableDate });
    });
    tableColumns.push({ title: 'Source', data: 'source' });
    let tableData = this.tableData
    this.tableWidget = indicatorTable.DataTable({
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
            function checkEmptyCells(row) {
              let emptyCount = 0;
              row.forEach((cell) => {
                emptyCount += cell.text === ' ' ? 1 : 0;
              });
              return emptyCount;
            }
            let currentTable = doc.content[2].table.body;
            let sources: Array<any> = [];
            let formattedTable: Array<any> = [];
            // Reformat table to allow for a maximum of 10 columns
            for (let i = 0; i < currentTable.length; i++) {
              let currentRow = currentTable[i];
              let indicator = { text: currentRow[0].text, style: currentRow[0].style };
              let area = { text: currentRow[1].text, style: currentRow[1].style };
              let units = { text: currentRow[2].text, style: currentRow[2].style };
              let sourceIndex = currentRow.length - 1;
              let source = { text: currentRow[sourceIndex].text, style: currentRow[sourceIndex].style };
              let sourceCopy = Object.assign({}, source);
              let sourceRow = [indicator, sourceCopy];
              sourceRow = rowRightPad(sourceRow)
              sources.push(sourceRow);
              // Remove source from original row
              currentRow.splice(sourceIndex, 1);
              let paddedRow = rowRightPad(currentRow);
              let counter = currentTable.length;
              // Row to be added to formattedTable
              let newRow = [];
              for (let n = 3; n <= paddedRow.length - 3; n++) {
                // Prevent empty rows from collapsing
                paddedRow[n].text = paddedRow[n].text === '' ? ' ' : paddedRow[n].text;
                newRow.push(paddedRow[n]);
                if (newRow.length == 7 || n == paddedRow.length - 3) {
                  let indicatorCopy = Object.assign({}, indicator);
                  let areaCopy = Object.assign({}, area);
                  let unitsCopy = Object.assign({}, units);
                  // Add indicator, area, and units to start of new row
                  newRow.unshift(indicatorCopy, areaCopy, unitsCopy);
                  newRow = newRow.length < 10 ? rowRightPad(newRow) : newRow;
                  let rowCount = 0;
                  if (n == paddedRow.length - 3) {
                    console.log('end')
                    let empty = checkEmptyCells(newRow);
                    if (empty == 7) {
                      rowCount += 1;
                    }
                  }
                  if (rowCount === currentTable.length) {
                    break;
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
            sources.forEach((source) => {
              formattedTable.push(source)
            })
            console.log(doc);
            doc.content[2].table.dontBreakRows = true;
            doc.content[2].table.headerRows = 0;
            doc.content[2].table.body = formattedTable;
            //doc.content.push({ table: { body: sources }, layout: 'noBorders' });
            doc.content.push({
              text: 'Compiled by Research & Economic Analysis Division, State of Hawaii Department of Business, Economic Development and Tourism. For more information, please visit: http://dbedt.hawaii.gov/',
            });
          }
        },
        {
          extend: 'print',
          text: '<i class="fa fa-print" aria-hidden="true" title="Print"></i>',
          message: 'Research & Economic Analysis Division, DBEDT',
          customize: function(win) {
            // Split table into smaller tables with maximum of 10 columns each
            // fixedCols is the array of columns to repeat in each table (i.e. displace indicator column in each table)
            function splitTable(table, maxCols, fixedCols) {
              let $table = table;
              // Row length of original table
              let rowLength = $('tr:first>*', $table).length;
              // Number of new tables to generate
              let n = Math.ceil(rowLength / maxCols);
              let bufferTables = [];
              let counter = 1;
              for (let i = 0; i <= n; i++) {
                // List of columns to keep in table
                let colList = fixedCols.slice(0);
                while (colList.length < maxCols && counter <= rowLength) {
                  if (colList.indexOf(counter) == -1) {
                    colList.push(counter);
                  }
                  counter += 1;
                }
                // Break if last table only has one column (i.e. only contains indicator column)
                if (i == n && colList.length == 1) {
                  break;
                }
                let $newTable = $table.clone(true);
                for (let j = 1; j <= rowLength; j++) {
                  if (colList.indexOf(j) == -1) {
                    $('tr>:nth-child(' + j + ')', $newTable).hide();
                  }
                }
                bufferTables.push($newTable);
              }
              (bufferTables.reverse()).forEach((element) => {
                $('<br>').insertAfter($table);
                element.insertAfter($table);
              });
            }
            let dtTable = $(win.document.body).find('table');
            splitTable(dtTable, 10, [1]);
            // Remove original table from print
            dtTable.remove();
            let $tables = $(win.document.body).find('table');
            $tables.each(function (i, table) {
              $(table).find('tr:odd').each(function () {
                $(this).css('background-color', '#F9F9F9');
              });
            });
            $(win.document.body).find('br:last-child').after("<p>Compiled by Research & Economic Analysis Division, State of Hawaii Department of Business, Economic Development and Tourism. For more information, please visit: http://dbedt.hawaii.gov/</p>");
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
