import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Frequency } from '../frequency';
import 'jquery';
declare var $: any;

@Component({
  selector: 'app-freq-selector',
  templateUrl: './freq-selector.component.html',
  styleUrls: ['./freq-selector.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FreqSelectorComponent implements OnInit {
  // If indicator(s) selected, do not display placeholder ('Select an Indicator')
  @Input() indicator: boolean;
  @Input() freqs: Array<Frequency>;
  @Output() selectedFreqList = new EventEmitter();
  private toggleSelected = [];

  constructor() { }

  ngOnInit() {
  }

  checked(freq, event) {
    console.log('event', event)
    let index = this.toggleSelected.indexOf(freq);
    if (event.target.checked) {
      event.target.classList.add('selected')
      if (index === -1) {
        this.toggleSelected.push(freq);
      }
    } else {
      event.target.classList.remove('selected')
      if (index !== -1) {
        this.toggleSelected.splice(index, 1);
      }
    }
    this.selectedFreqList.emit(this.toggleSelected);
  }

  /* updateClass(event) {

  } */
}
