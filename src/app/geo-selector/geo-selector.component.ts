import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Geography } from '../geography';

@Component({
  selector: 'app-geo-selector',
  templateUrl: './geo-selector.component.html',
  styleUrls: ['./geo-selector.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GeoSelectorComponent {
  // If indicator(s) selected, do not display placeholder ('Select an Indicator')
  @Input() indicator: boolean;
  @Input() regions: Array<Geography>;
  @Input() selectedGeos: Array<any>;
  @Output() selectedGeoList = new EventEmitter();

  constructor() { }

  toggle(geo, event) {
    const index = this.selectedGeos.indexOf(geo);
    if (index === -1) {
      this.selectedGeos.push(geo);
    } else {
      this.selectedGeos.splice(index, 1);
    }
    setTimeout(() => {
      this.selectedGeoList.emit(this.selectedGeos);
    }, 20);
  }
}
