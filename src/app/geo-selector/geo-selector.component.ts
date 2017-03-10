import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { Geography } from '../geography';

@Component({
  selector: 'app-geo-selector',
  templateUrl: './geo-selector.component.html',
  styleUrls: ['./geo-selector.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GeoSelectorComponent implements OnInit {
  @Input() regions: Array<Geography>;
  @Input() selectedGeos;
  @Output() selectedGeoList = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    $('.select2-region').select2({
      data: this.regions,
      placeholder: 'Select Region',
      width: '200px',
      allowClear: true
    });
    $('.select2-region').val(this.selectedGeos).trigger('change');
    $('.select2-region').on('change', e => {
      this.selectedGeoList.emit($(e.target).val());
    });
  }
}
