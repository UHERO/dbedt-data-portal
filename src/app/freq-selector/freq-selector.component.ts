import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Frequency } from '../frequency';

@Component({
  selector: 'app-freq-selector',
  templateUrl: './freq-selector.component.html',
  styleUrls: ['./freq-selector.component.scss']
})
export class FreqSelectorComponent implements OnInit {
  @Input() freqs: Array<Frequency>;
  @Input() selectedFreqs;
  @Output() selectedFreqList = new EventEmitter()
  private selectOptions: Object = {
    multiple: true,
    placeholder: 'Select Frequency'
  };

  constructor() { }

  ngOnInit() {
  }

  onChange(e) {
    this.selectedFreqList.emit(e.value);
  }
}
