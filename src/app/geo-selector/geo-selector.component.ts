import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, OnChanges } from '@angular/core';
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

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    $('.select2-region').select2({
      data: this.regions,
      placeholder: 'Select Region',
      width: '200px',
      initSelection: function (element, callback) {
        let data = [];
        console.log(element)
        if (element.val().length) {
          $(element.val().split(',')).each(function() {
            data.push({id: this});  
          });
          console.log('init', data);
        }
        callback(data);
      }
    });
    $('.select2-region').val(this.selectedGeos).trigger('change');
    $('.select2-region').on('change', e => {
      this.selectedGeoList.emit($(e.target).val());
    });
  }

  ngOnChanges() {
    //$('.select2-region').val(this.selectedGeos).trigger('change');
  }
}
