import { Component, OnInit, Input, Output, EventEmitter,  ViewEncapsulation } from '@angular/core';
import { Geography } from '../geography';
import 'jquery';
declare var $: any;

@Component({
  selector: 'app-geo-selector',
  templateUrl: './geo-selector.component.html',
  styleUrls: ['./geo-selector.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GeoSelectorComponent implements OnInit {
  // If indicator(s) selected, do not display placeholder ('Select an Indicator')
  @Input() indicator: boolean;
  @Input() regions: Array<Geography>;
  @Output() selectedGeoList = new EventEmitter();
  private toggleSelected = [];

  constructor() { }

  ngOnInit() {
  }

  checked(region, event) {
    let index = this.toggleSelected.indexOf(region);
    if (event.target.checked) {
      if (index === -1) {
        this.toggleSelected.push(region);
      }
    } else {
      if (index !== -1) {
        this.toggleSelected.splice(index, 1);
      }
    }
    this.selectedGeoList.emit(this.toggleSelected);
  }
}
