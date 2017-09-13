export interface Category {
  id: number;
  name: string;
  freqGeos: Array<any>;
  geoFreqs: Array<any>;
  parentId?: number;
  children?: Array<any>;
  defaults?: Object;
  observationStart?: string;
  observationEnd?: string;
}
