import {
  Component, Input, Output, EventEmitter, ViewEncapsulation, OnChanges
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

  /* ngOnChanges() {
    console.log('ON CHANGES selectedFreqs', this.selectedFreqs)
    console.log('On CHANGES', this.freqs);
    if (this.selectedFreqs.length) {
      this.selectedFreqs.forEach((freq, index) => {
        const freqExists = this.freqs.find(f => f.id === freq);
        if (!freqExists) {
          this.toggle(freq)
        }
      })
      console.log('filtered frqs', this.selectedFreqs)
    }
  } */

  toggle(freqs) {
    /* const index = this.selectedFreqs.indexOf(freq);
    if (index === -1) {
      this.selectedFreqs.push(freq);
    } else {
      this.selectedFreqs.splice(index, 1);
    }
    setTimeout(() => {
      this.selectedFreqList.emit(this.selectedFreqs);
    }, 20); */
    console.log('toggle', freqs);
    this.selectedFreqList.emit(freqs)
  }
}