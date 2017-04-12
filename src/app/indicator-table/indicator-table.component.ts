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
            function checkEmptyCells(header) {
              let emptyCount = 0;
              header.forEach((cell) => {
                if (cell.text == ' ') {
                  emptyCount += 1;
                }
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
            for (let i = formattedTable.length - 1; i >= 0; i--) {
              // Number of indicators in table
              let tableIndicators = currentTable.length - 1;
              // Find header row of last set of rows
              let header = i - tableIndicators;
              // If header row contains only three columns (indicator, area, units), remove last set of rows from export
              let emptyCount = checkEmptyCells(formattedTable[header]);
              if (emptyCount === 7) {
                formattedTable.splice(header, tableIndicators);
              } else {
                break;
              }
            }
            // Add sources to end of export
            sources.forEach((source) => {
              formattedTable.push(source)
            });
            doc.content[2].table.dontBreakRows = true;
            doc.content[2].table.headerRows = 0;
            doc.content[2].table.body = formattedTable;
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
            function sortIndicators(a, b) {
              if (a.indicator < b.indicator) {
                return -1;
              }
              if (a.indicator > b.indicator) {
                return 1;
              }
              return 0;
            }
            function sortObsDates(nonSorted, sorted) {
              let result = [];
              for (let i = 0; i < nonSorted.length; i++) {
                let index = nonSorted.indexOf(sorted[i]);
                result[i] = nonSorted[index];
              }
              return result;
            }
            function splitTable(array, size) {
              let result = [];
              for (let i = 0; i < array.length; i += size) {
                result.push(array.slice(i, i + size));
              }
               return result;
            }
            // Get array of dates from table
            let dates = tableColumns.slice(3, tableColumns.length - 1);
            let dateArray = [];
            dates.forEach((date) => {
              dateArray.push(date.title);
            });

            // Sort table data alphabetically by indicators
            tableData.sort(sortIndicators);

            // Columns to be fixed in tables: Indicator, Area, Units
            let indicator = tableColumns[0];
            let area = tableColumns[1];
            let units = tableColumns[2];
            // Get array of columns minus fixed columns
            let columns = tableColumns.slice(3);
            // Split columns into arrays with max length of 7
            let tableHeaders = splitTable(columns, 7);
            let newTables = [];

            // Add fixed columns to the new table headers and create a new table for each header
            tableHeaders.forEach((header) => {
              header.unshift(indicator, area, units);
              let html = '<table class="dataTable no-footer"><tr>';
              header.forEach((col) => {
                html += '<td>' + col.title + '</td>'
              });
              html += '</tr>';
              newTables.push(html);
            });

            // Add data from indicators to each new table
            tableData.forEach((indicator, index) => {
              let obsCounter = 0;
              let observations = Object.keys(indicator.observations);
              // Sort observations keys to match order of table date columns
              let sortedObs = sortObsDates(observations, dateArray);
              for (let i = 0; i < newTables.length; i++) {
                let table = newTables[i];
                table += '<tr><td>' + indicator.indicator + '</td><td>' + indicator.region + '</td><td>' + indicator.units + '</td>';
                let colCount = 3;
                while (colCount < 10 && obsCounter < sortedObs.length) {
                  table += '<td>' + indicator.observations[sortedObs[obsCounter]] + '</td>';
                  colCount += 1;
                  obsCounter += 1;
                }
                // Add source
                if (colCount < 10 && obsCounter == sortedObs.length) {
                  table += '<td>' + indicator.source + '</td></tr>';
                }
                if (index == tableData.length - 1) {
                  table += '</table>';
                }
                newTables[i] = table;
              }
            });

            // Original table
            let dtTable = $(win.document.body).find('table');
            newTables.reverse().forEach((table) => {
              $('<br>').insertAfter(dtTable);
              $(table).insertAfter(dtTable);
            });
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
