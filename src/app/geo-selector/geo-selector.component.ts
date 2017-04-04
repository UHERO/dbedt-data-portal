import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, OnChanges, ViewEncapsulation } from '@angular/core';
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
  @Input() regions: Array<Geography>;
  @Input() selectedGeos;
  @Output() selectedGeoList = new EventEmitter();
  private toggleSelected = [];

  constructor() { }

  ngOnInit() {
  }

  toggle(e) {
    let $self = $(e);
    // If option is selected, deselect and remove from selected list of emitted regions
    if ($self.prop('selected')) {
      $self.prop('selected', false);
      let i = this.toggleSelected.indexOf($self.val());
      if (i > - 1) {
        this.toggleSelected.splice(i, 1);
      }
    // Else, select option and emit region value
    } else {
      $self.prop('selected', true);
      this.toggleSelected.push($self.val())
    }
    this.selectedGeoList.emit(this.toggleSelected);
    return false;
  }
}
