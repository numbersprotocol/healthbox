import { Symptoms } from '../classes/symptoms';
import { Photo } from './photo';
import { LocationStamp } from './location-stamp';
import { HealthCondition } from '../classes/health-condition';

export interface Record {
    timestamp: number;
    locationStamp?: LocationStamp;
    bodyTemperature?: number;
    bodyTemperatureUnit?: string;
    symptoms?: Symptoms;
    healthCondition?: HealthCondition;
    photos: Photo[];
}
