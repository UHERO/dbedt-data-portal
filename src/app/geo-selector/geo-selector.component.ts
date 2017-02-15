import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { IMultiSelectOption, IMultiSelectSettings } from 'angular-2-dropdown-multiselect/src/multiselect-dropdown';
import { Geography } from '../geography';

@Component({
  selector: 'app-geo-selector',
  templateUrl: './geo-selector.component.html',
  styleUrls: ['./geo-selector.component.scss']
})
export class GeoSelectorComponent implements OnInit {
  @Input() regions: Array<Geography>;
  private selectSettings: IMultiSelectSettings = {
    showCheckAll: true,
    showUncheckAll: true,
    buttonClasses: 'btn btn-default',
    checkedStyle: 'fontawsome'
  }
  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    //let regions = this.regions;
    //console.log('input regions', regions);
  }
}
