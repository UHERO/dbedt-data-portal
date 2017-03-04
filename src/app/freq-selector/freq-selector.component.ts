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
      allowClear: true,
    });
    $('.select2-frequency').val(this.selectedFreqs).trigger('change');
    $('.select2-frequency').on('change', e => {
      this.selectedFreqList.emit($(e.target).val());
    });
  }
}
