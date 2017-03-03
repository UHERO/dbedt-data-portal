import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { Geography } from '../geography';

@Component({
  selector: 'app-geo-selector',
  templateUrl: './geo-selector.component.html',
  styleUrls: ['./geo-selector.component.scss']
})
export class GeoSelectorComponent implements OnInit {
  @Input() regions: Array<Geography>;
  @Input() selectedGeos;
  @Output() selectedGeoList = new EventEmitter();
  private selectOptions = {
    multiple: true,
    placeholder: 'Select Region',
  }

  constructor() { }

  ngOnInit() {
  }

  onChange(e) {
    this.selectedGeoList.emit(e.value);
  }
}
