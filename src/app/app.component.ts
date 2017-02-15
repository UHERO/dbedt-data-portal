import { Component, AfterViewInit, ViewChild } from '@angular/core';

import { ApiService } from './api.service';
import { CategorySidebarComponent } from './category-sidebar/category-sidebar.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  @ViewChild(CategorySidebarComponent)
  private sidebar: CategorySidebarComponent;
  private series: Array<any>;
  private geoList = [];

  constructor(private _apiService: ApiService) { }

  ngAfterViewInit() {
  }

  getSelected(e) {
    //console.log('parent component', e);
    let latestSelection = e[e.length - 1];
    this._apiService.fetchCatGeos(latestSelection).subscribe((geos) => {
      geos.forEach((geo, index) => {
        this.uniqueGeos(geo, this.geoList);
      });
    });
    console.log(this.geoList)
  }

  // Get a unique array of available regions for a category
  uniqueGeos(geo, geoList) {
    let exist = false;
    for (let i in geoList) {
      if (geo.handle === geoList[i].handle) {
        exist = true;
        // If region already exists, check it's list of frequencies
        // Get a unique list of frequencies available for a region
        let freqs = geo.freqs;
        for (let j in freqs) {
          if (!this.freqExist(geoList[i].freqs, freqs[j].freq)) {
            geoList[i].freqs.push(freqs[j]);
          }
        }
      }
    }
    if (!exist) {
      geoList.push(geo);
    }
  }

  freqExist(freqArray, freq) {
    for (let n in freqArray) {
      if (freq === freqArray[n].freq) {
        return true;
      }
    }
    return false;
  }
}
