import {
  Component, Input, Output, EventEmitter, ViewEncapsulation
} from '@angular/core';
import { Frequency } from '../frequency';

@Component({
  selector: 'app-freq-selector',
  templateUrl: './freq-selector.component.html',
  styleUrls: ['./freq-selector.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FreqSelectorComponent {
  // If indicator(s) selected, do not display placeholder ('Select an Indicator')
  @Input() indicator: boolean;
  @Input() freqs: Array<Frequency>;
  @Input() selectedFreqs: Array<any>;
  @Output() selectedFreqList: EventEmitter<any> = new EventEmitter();

  constructor() { }

  toggle(freqs) {
    this.selectedFreqList.emit(freqs)
  }
}