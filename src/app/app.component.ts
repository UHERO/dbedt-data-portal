import { Component, AfterViewInit, ViewChild } from '@angular/core';

import { ApiService } from './api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  // private series: Array<any>;
  private geoList = [];
  private freqList = [];
  constructor(private _apiService: ApiService) { }

  ngAfterViewInit() {
  }

  getSelected(e) {
    console.log('parent component', e);
    this.geoList = [];
    this.freqList = [];
    let latestSelection = e[e.length - 1];
    e.forEach((el, index) => {
      this._apiService.fetchCatGeos(el).subscribe((geos) => {
        geos.forEach((geo, index) => {
          this.uniqueGeos(geo, this.geoList);
        });
      });
      this._apiService.fetchCatFreqs(el).subscribe((freqs) => {
        freqs.forEach((freq, index) => {
          this.uniqueFreqs(freq, this.freqList);
        });
      });
    })
    /* this._apiService.fetchSeries(latestSelection).subscribe((series) => {
      console.log('series', series);
      series.forEach((serie, index) => {
        let geoFreq = serie.geo_freqs;
        let freqGeo = serie.freq_geos;
        geoFreq.forEach((geo, index) => {
          this.uniqueGeos(geo, this.geoList);
        });
        freqGeo.forEach((freq, index) => {
          this.uniqueFreqs(freq, this.freqList);
        });
      });
    }); */
    console.log('geo list', this.geoList);
    console.log('freq list', this.freqList)
  }

  // Get a unique array of available regions for a category
  uniqueGeos(geo, geoList) {
    let exist = false;
    for (let i in geoList) {
      // Multiselect Dropdown Component (geo & freq selectors) requires name and id properties
      if (geo.handle === geoList[i].id) {
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
      geoList.push({ name: geo.name, id: geo.handle, freqs: geo.freqs });
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

  // Get a unique array of available frequencies for a category
  uniqueFreqs(freq, freqList) {
    let exist = false;
    for (let i in freqList) {
      if (freq.label === freqList[i].name) {
        exist = true;
        // If frequency already exists, check it's list of regions
        // Get a unique list of regions available for a frequency
        let geos = freq.geos;
        for (let j in geos) {
          if (!this.geoExist(freqList[i].geos, geos[j].handle)) {
            freqList[i].geos.push(geos[j]);
          }
        }
      }
    }
    if (!exist) {
      freqList.push({ name: freq.label, id: freq.freq, geos: freq.geos });
    }
  }

  geoExist(geoArray, geo) {
    for (let n in geoArray) {
      if (geo === geoArray[n].handle) {
        return true;
      }
    }
    return false;
  }
}
