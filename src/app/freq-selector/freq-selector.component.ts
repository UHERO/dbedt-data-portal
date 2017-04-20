import {
  Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation
} from '@angular/core';
import { Frequency } from '../frequency';

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
  @Input() selectedFreqs: Array<any>;
  @Output() selectedFreqList: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  toggle(freq, event) {
    const index = this.selectedFreqs.indexOf(freq);
    if (index === -1) {
      this.selectedFreqs.push(freq);
    } else {
      this.selectedFreqs.splice(index, 1);
    }
    setTimeout(() => {
      this.selectedFreqList.emit(this.selectedFreqs);
    }, 20);
  }
}
