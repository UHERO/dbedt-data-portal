import {Geography} from './geography';

export interface Series {
  id: string;
  title?: string;
  name?: string;
  description?: string;
  parentId?: number;
  observationStart?: string;
  observationEnd?: string;
  frequency: string;
  frequencyShort: string;
  unitsLabel: string;
  unitsLabelShort: string;
  geography: Geography;
  SeasonalAdjustment?: string;
  sesonalAdjustmentShort?: string;
  source?: string;
  sourceLink?: string;
  freq_geos?: Array<any>;
  geo_freqs?: Array<any>;
}
