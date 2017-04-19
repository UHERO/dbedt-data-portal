import {
  Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation, ChangeDetectorRef
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
  @Output() selectedFreqList: EventEmitter<any> = new EventEmitter();
  private toggleSelected: Array<any> = [];

  constructor(private cd: ChangeDetectorRef) { }

  ngOnInit() {
  }

  public toggle(freq, event) {
    event.preventDefault();
    console.log('clicked check event', event);
    event.target.classList.toggle('selected');
    this.cd.detectChanges();
    console.log('selectedFreqList', this.toggleSelected);
    console.log('freq', freq);
    const index = this.toggleSelected.indexOf(freq);
    if (index === -1) {
      this.toggleSelected.push(freq);
    } else {
      this.toggleSelected.splice(index, 1);
    }
    setTimeout(() => {
      this.selectedFreqList.emit(this.toggleSelected);
    }, 10);
  }

  /* updateClass(event) {

  } */
}
