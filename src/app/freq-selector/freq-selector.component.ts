import { Component, OnInit, Input, Output, EventEmitter, OnChanges, AfterViewInit } from '@angular/core';
import { Frequency } from '../frequency';

@Component({
  selector: 'app-freq-selector',
  templateUrl: './freq-selector.component.html',
  styleUrls: ['./freq-selector.component.scss']
})
export class FreqSelectorComponent implements OnInit {
  @Input() freqs: Array<Frequency>;
  @Input() selectedFreqs;
  @Output() selectedFreqList = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    $('.select2-frequency').select2({
      data: this.freqs,
      placeholder: 'Select Frequency',
      width: '200px',
      initSelection: function (element, callback) {
        let data = [];
        console.log(element)
        if (element.val().length) {
          $(element.val().split(',')).each(function() {
            data.push({id: this});  
          });
          console.log('init', data);
        }
        callback(data);
      }
    });
    //$('.select2-frequency').val(["A"]).trigger('change');
    $('.select2-frequency').on('change', e => {
      this.selectedFreqList.emit($(e.target).val());
    });
  }

  ngOnChanges() {
    $('.select2-frequency').val(this.selectedFreqs).trigger('change');
  }
}
