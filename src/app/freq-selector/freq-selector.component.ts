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
  @Output() selectedFreqList = new EventEmitter();
  private toggleSelected = []

  constructor() { }

  ngOnInit() {
  }

  checked(freq, event) {
    let index = this.toggleSelected.indexOf(freq);
    if (event.target.checked) {
      if (index === -1) {
        this.toggleSelected.push(freq);
      }
    } else {
      if (index !== -1) {
        this.toggleSelected.splice(index, 1);
      }
    }
    this.selectedFreqList.emit(this.toggleSelected);
  }
}
