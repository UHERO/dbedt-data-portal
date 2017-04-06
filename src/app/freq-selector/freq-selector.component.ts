import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Frequency } from '../frequency';
import 'jquery';
declare var $: any;

@Component({
  selector: 'app-freq-selector',
  templateUrl: './freq-selector.component.html',
  styleUrls: ['./freq-selector.component.scss']
})
export class FreqSelectorComponent implements OnInit {
  // If indicator(s) selected, do not display placeholder ('Select an Indicator')
  @Input() indicator: boolean;
  @Input() freqs: Array<Frequency>;
  @Input() selectedFreqs;
  @Output() selectedFreqList = new EventEmitter();
  private toggleSelected = []

  constructor() { }

  ngOnInit() {
  }

  toggle(e) {
    let $self = $(e);
    // If option is selected, deselect and remove from selected list of emitted frequencies
    if ($self.prop('selected')) {
      $self.prop('selected', false);
      let i = this.toggleSelected.indexOf($self.val());
      if (i > - 1) {
        this.toggleSelected.splice(i, 1);
      }
    // Else, select option and emit frequency value
    } else {
      $self.prop('selected', true);
      this.toggleSelected.push($self.val());
    }
    let options = $('.select-frequency option:selected')
    this.selectedFreqs = Array.apply(null, options).filter(option => option.selected).map(option => option.value);
    this.selectedFreqList.emit(this.selectedFreqs);
    return false;
  }
}
