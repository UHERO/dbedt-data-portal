import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect/src/multiselect-dropdown';
import { Geography } from '../geography';

@Component({
  selector: 'app-geo-selector',
  templateUrl: './geo-selector.component.html',
  styleUrls: ['./geo-selector.component.scss']
})
export class GeoSelectorComponent implements OnInit {
  @Input() regions: Array<Geography>;
  @Input() selectedGeos;
  @Output() selectedGeoList = new EventEmitter()
  // private selectedGeo: string[];
  private selectSettings: IMultiSelectSettings = {
    showCheckAll: true,
    showUncheckAll: true,
    buttonClasses: 'btn btn-default',
    checkedStyle: 'fontawsome'
  }
  private selectText: IMultiSelectTexts = {
    defaultTitle: 'Select Region'
  }

  constructor() { }

  ngOnInit() {
  }

  onChange(e) {
    this.selectedGeoList.emit(e);
  }
}
