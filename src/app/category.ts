export interface Category {
  id: number,
  name: string,
  freq_geos: Object,
  geo_freqs: Object,
  parentId?: number,
  children?: Array<any>,
  defaults?: Object,
  observationStart?: string,
  observationEnd?: string
}
