import { Injectable } from '@angular/core';

import { Geography } from './geography';
import { Frequency } from './frequency';

@Injectable()
export class HelperService {

  constructor() { }

  checkSelectedGeoFreqs(selected: string, geoList: Array<any>, frequencies: Array<any>) {
    geoList.forEach((geo, index) => {
      if (selected === geo.id) {
        geo.freqs.forEach((freq, index) => {
          this.uniqueFreqs(freq, frequencies);
        });
      }
    });
  }

  checkSelectedList(selected: string, index: number, filterList: Array<any>, selectedList: Array<any>) {
    let exist = false;
    for (let i in filterList) {
      if (selected === filterList[i].id) {
        exist = true;
      }
    }
    if (!exist) {
      selectedList.splice(index, 1);
    }
  }

  checkSelectedFreqGeos(selected: string, freqList: Array<any>, regions: Array<any>) {
    freqList.forEach((freq, index) => {
      if (selected === freq.id) {
        freq.geos.forEach((geo, index) => {
          this.uniqueGeos(geo, regions);
        });
      }
    });
  }

  // Get a unique array of available regions for a category
  uniqueGeos(geo: Geography, geoList: Array<any>) {
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
      geoList.push({ name: geo.name ? geo.name : geo.handle, id: geo.handle, freqs: geo.freqs });
    }
  }

  freqExist(freqArray: Array<any>, freq: Frequency) {
    for (let n in freqArray) {
      if (freq === freqArray[n].freq) {
        return true;
      }
    }
    return false;
  }

  // Get a unique array of available frequencies for a category
  uniqueFreqs(freq: Frequency, freqList: Array<any>) {
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

  geoExist(geoArray: Array<any>, geo: Geography) {
    for (let n in geoArray) {
      if (geo === geoArray[n].handle) {
        return true;
      }
    }
    return false;
  }
}
