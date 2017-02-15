import { Component, OnInit } from '@angular/core';
import { IMultiSelectOption } from 'angular-2-dropdown-multiselect/src/multiselect-dropdown';

@Component({
  selector: 'app-geo-selector',
  templateUrl: './geo-selector.component.html',
  styleUrls: ['./geo-selector.component.scss']
})
export class GeoSelectorComponent implements OnInit {
  private geos: IMultiSelectOption[];
  constructor() {
    this.geos = [{name: 'State of Hawaii', id: 'HI'}, {name: 'Honolulu County', id: 'HON'}];
  }

  ngOnInit() {
  }

}
