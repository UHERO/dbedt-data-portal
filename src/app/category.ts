export interface Category {
  id: number;
  name: string;
  label: string;
  key: number;
  leaf: boolean;
  freqGeos: Array<any>;
  geoFreqs: Array<any>;
  parentId?: number;
  children?: Array<any>;
  defaults?: Object;
  observationStart?: string;
  observationEnd?: string;
}
