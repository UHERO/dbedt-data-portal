export interface Category {
  id: number,
  name: string,
  freq_geos: Array<any>,
  geo_freqs: Array<any>,
  parentId?: number,
  children?: Array<any>,
  defaults?: Object,
  observationStart?: string,
  observationEnd?: string
}
