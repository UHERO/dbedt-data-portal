import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { IMultiSelectOption, IMultiSelectSettings } from 'angular-2-dropdown-multiselect/src/multiselect-dropdown';
import { Frequency } from '../frequency';

@Component({
  selector: 'app-freq-selector',
  templateUrl: './freq-selector.component.html',
  styleUrls: ['./freq-selector.component.scss']
})
export class FreqSelectorComponent implements OnInit {
  @Input() freqs: Array<Frequency>;
  private selectSettings: IMultiSelectSettings = {
    showCheckAll: true,
    showUncheckAll: true,
    buttonClasses: 'btn btn-default',
    checkedStyle: 'fontawsome'
  }

  constructor() { }

  ngOnInit() {
  }

}
