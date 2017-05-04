import { Component, OnInit, Input, OnChanges, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { HelperService } from '../helper.service';
import {  ApiService } from '../api.service';
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
  private tableWidget: any;

  constructor(private _api: ApiService) { }

  ngOnInit() {
  }

  ngOnChanges(inputChanges) {
    $('span.loading').css('display', 'inline-block');
    setTimeout(() => {
      this.initDatatable();
    }, 20);
  }

  initDatatable(): void {
    const tableColumns = [];
    const indicatorTable: any = $('#indicator-table');
    if (this.tableWidget) {
      // Destroy table if table has already been initialized
      this.tableWidget.destroy();
      indicatorTable.empty();
    }
    tableColumns.push({ title: 'Id', data: 'position'}, { title: 'Indicator', data: 'indicator' }, { title: 'Area', data: 'region' }, { title: 'Units', data: 'units' });
    this.dateArray.forEach((date) => {
      tableColumns.push({ title: date.tableDate, data: 'observations.' + date.tableDate });
    });
    tableColumns.push({ title: 'Source', data: 'source' });
    const tableData = this.tableData;
    this.tableWidget = indicatorTable.DataTable({
      data: this.tableData,
      dom: 'Bt',
      buttons: [
        {
          extend: 'excel',
          text: '<i class="fa fa-file-excel-o" aria-hidden="true" title="Excel"></i>',
          exportOptions: {
            columns: ':visible'
          },
          customizeData: function(xlsx) {
            const cols = xlsx.header.length;
            const dbedtFooter = [];
            const uheroFooter = [];
            const addRow = [];
            // Rows with different lengths break export
            for (let i = 0; i < cols; i++) {
              dbedtFooter.push('');
              uheroFooter.push('');
              addRow.push('');
            }
            dbedtFooter.unshift('Compiled by Research & Economic Analysis Division, State of Hawaii Department of Business, Economic Development and Tourism. For more information please visit: http://dbedt.hawaii.gov/economic');
            // Add an empty row before DBEDT and UHERO credit
            xlsx.body.push(addRow);
            xlsx.body.push(dbedtFooter);
          },
          customize: function(xlsx) {
            const sheet = xlsx.xl.worksheets['sheet1.xml'];
            const col = $('col', sheet);
            const textCells = $('sheetData c is', sheet);
            const rows = $('sheetData row', sheet);
            const dates = $('v', rows[0]);
            // Right align dates in first row
            dates.each(function() {
              $(this.parentElement).attr('s', 52);
            });
            // Right align cells with text, except footer
            let i = 0;
            while (i < textCells.length - 1) {
              $(textCells[i].parentElement).attr('s', 52);
              i++;
            }
            $(col[0]).attr('width', 25);
            $(col[1]).attr('width', 25);
            $(col[2]).attr('width', 25);
          }
        },
        {
          extend: 'csv',
          text: '<i class="fa fa-file-text-o" aria-hidden="true" title="CSV"></i>',
          exportOptions: {
            columns: ':visible'
          },
          customize: function(csv) {
            return csv + '\n\n Compiled by Research & Economic Analysis Division State of Hawaii Department of Business Economic Development and Tourism. For more information please visit: http://dbedt.hawaii.gov/economic';
          }
        },
        {
          extend: 'pdf',
          text: '<i class="fa fa-file-pdf-o" aria-hidden="true" title="PDF"></i>',
          orientation: 'landscape',
          pageSize: 'letter',
          message: 'Research & Economic Analysis Division, DBEDT',
          exportOptions: {
            columns: ':visible'
          },
          customize: function (doc) {
            // Table rows should be divisible by 10
            // Maintain consistant table width (i.e. add empty strings if row has less than 10 data cells)
            function rowRightPad(row) {
              const paddedRow = [];
              row.forEach((item) => {
                paddedRow.push(item);
              });
              const rowDiff = paddedRow.length % 10;
              let addString = 10 - rowDiff;
              while (addString) {
                paddedRow.push({ text: ' ', style: ''});
                addString -= 1;
              }
              return paddedRow;
            }
            function splitTable(array, size) {
              const result = [];
              for (let i = 0; i < array.length; i += size) {
                result.push(array.slice(i, i + size));
              }
              return result;
            }
            function rightAlign(array) {
              array.forEach((cell) => {
                cell.alignment = 'right';
              });
            }
            // Get original table object
            const currentTable = doc.content[2].table.body;
            const sources: Array<any> = [];
            const formattedTable: Array<any> = [];
            currentTable.forEach((row, index) => {
              let counter = currentTable.length;
              // Fixed Columns: Indicator, Area, Units
              const indicator = row[0];
              const area = row[1];
              const units = row[2];
              // Store source info to append to end of export (include Indicator and Source)
              const source = row[row.length - 1];
              const sourceCopy = Object.assign({}, source);
              let sourceRow = [indicator, sourceCopy];
              sourceRow = rowRightPad(sourceRow);
              sources.push(sourceRow);
              // Get data from each original row excluding fixed columns and sources
              const nonFixedCols = row.slice(3, row.length - 1);
              // Split data into groups of arrays with max length == 7
              const split = splitTable(nonFixedCols, 7);
              for (let i = 0; i < split.length; i++) {
                // Each group is used as a new row for the formatted tables
                let newRow = split[i];
                // Add the fixed columns to each new row
                const indicatorCopy = Object.assign({}, indicator);
                const areaCopy = Object.assign({}, area);
                const unitsCopy = Object.assign({}, units);
                newRow.unshift(indicatorCopy, areaCopy, unitsCopy);
                if (newRow.length < 10) {
                  newRow = rowRightPad(newRow);
                }
                // Right align cell text
                rightAlign(newRow);
                // Add new rows to formatted table
                if (!formattedTable[index]) {
                  formattedTable[index] = newRow;
                } else {
                  formattedTable[index + counter] = newRow;
                  counter += currentTable.length;
                }
              }
            });
            // Add sources
            sources.forEach((source) => {
              // Right align cell text
              rightAlign(source);
              formattedTable.push(source);
            });
            doc.content[2].table.dontBreakRows = true;
            doc.content[2].table.headerRows = 0;
            doc.content[2].table.body = formattedTable;
            doc.content.push({
              text: 'Compiled by Research & Economic Analysis Division, State of Hawaii Department of Business, Economic Development and Tourism. For more information, please visit: http://dbedt.hawaii.gov/economic',
            });
          }
        },
        {
          extend: 'print',
          text: '<i class="fa fa-print" aria-hidden="true" title="Print"></i>',
          message: 'Research & Economic Analysis Division, DBEDT',
          exportOptions: {
            columns: ':visible'
          },
          customize: function(win) {
            function sortIndicators(a, b) {
              if (a.position < b.position) {
                return -1;
              }
              if (a.position > b.position) {
                return 1;
              }
              return 0;
            }
            function sortObsDates(nonSorted, sorted) {
              const result = [];
              for (let i = 0; i < nonSorted.length; i++) {
                const index = nonSorted.indexOf(sorted[i]);
                result[i] = nonSorted[index];
              }
              return result;
            }
            function splitTable(array, size) {
              const result = [];
              for (let i = 0; i < array.length; i += size) {
                result.push(array.slice(i, i + size));
              }
               return result;
            }
            // Get array of dates from table
            const dates = tableColumns.slice(4, tableColumns.length - 1);
            const dateArray = [];
            dates.forEach((date) => {
              dateArray.push(date.title);
            });

            // Sort table data by position (default table ordering)
            tableData.sort(sortIndicators);

            // Columns to be fixed in tables: Indicator, Area, Units
            const indicator = tableColumns[1];
            const area = tableColumns[2];
            const units = tableColumns[3];
            // Get array of columns minus fixed columns
            const columns = tableColumns.slice(4);
            // Split columns into arrays with max length of 7
            const tableHeaders = splitTable(columns, 7);
            const newTables = [];

            // Add fixed columns to the new table headers and create a new table for each header
            tableHeaders.forEach((header) => {
              header.unshift(indicator, area, units);
              let html = '<table class="dataTable no-footer"><tr>';
              header.forEach((col) => {
                html += '<td>' + col.title + '</td>';
              });
              html += '</tr>';
              newTables.push(html);
            });

            // Add data from indicators to each new table
            tableData.forEach((ind, index) => {
              let obsCounter = 0;
              const observations = Object.keys(ind.observations);
              // Sort observations keys to match order of table date columns
              const sortedObs = sortObsDates(observations, dateArray);
              for (let i = 0; i < newTables.length; i++) {
                let table = newTables[i];
                table += '<tr><td>' + ind.indicator + '</td><td>' + ind.region + '</td><td>' + ind.units + '</td>';
                let colCount = 3;
                while (colCount < 10 && obsCounter < sortedObs.length) {
                  table += '<td>' + ind.observations[sortedObs[obsCounter]] + '</td>';
                  colCount += 1;
                  obsCounter += 1;
                }
                // Add source
                if (colCount < 10 && obsCounter === sortedObs.length) {
                  table += '<td>' + ind.source + '</td></tr>';
                }
                if (index === tableData.length - 1) {
                  table += '</table>';
                }
                newTables[i] = table;
              }
            });

            // Original table
            const dtTable = $(win.document.body).find('table');
            newTables.forEach((table) => {
              $(win.document.body).append('<br>');
              $(win.document.body).append(table);
            });

            // Remove original table from print
            dtTable.remove();

            const $tables = $(win.document.body).find('table');
            $tables.each(function (i, table) {
              $(table).find('tr:odd').each(function () {
                $(this).css('background-color', '#F9F9F9');
              });
            });
            $(win.document.body)
              .find('br:last-child')
              .after('<p>Compiled by Research & Economic Analysis Division, State of Hawaii Department of Business, Economic Development and Tourism. For more information, please visit: http://dbedt.hawaii.gov/economic</p>');
          }
        }],
      columns: tableColumns,
      columnDefs: [
        // Hide ID column -- used for initial ordering
        { 'visible': false, 'targets': 0 },
        { 'className': 'td-left', 'targets': [1, 2, 3] },
        { 'className': 'td-right', 'targets': '_all',
          'render': function(data, type, row, meta) {
            // If no data is available for a given year, return an empty string
            return data === undefined ? ' ' : data;
          }
        }
      ],
      scrollY: '400px',
      scrollX: true,
      paging: false,
      searching: false,
      info: false,
      fixedColumns: {
        'leftColumns': 4
      },
    });
    $('span.loading').css('display', 'none');
  }
}
