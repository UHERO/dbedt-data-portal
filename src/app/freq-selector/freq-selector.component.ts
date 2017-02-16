import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect/src/multiselect-dropdown';
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
  // private selectedFreq: string[];
  private selectSettings: IMultiSelectSettings = {
    showCheckAll: true,
    showUncheckAll: true,
    buttonClasses: 'btn btn-default',
    checkedStyle: 'fontawsome'
  }
  private selectText: IMultiSelectTexts = {
    defaultTitle: 'Select Frequency'
  }

  constructor() { }

  ngOnInit() {
  }

  onChange(e) {
    this.selectedFreqList.emit(e);
  }
}
