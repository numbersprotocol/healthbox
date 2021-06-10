import { Injectable } from '@angular/core';
import {
  GeolocationOptions,
  GeolocationPosition,
  Plugins,
} from '@capacitor/core';
import { bindCallback, from, Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';

const { Geolocation } = Plugins;

enum GeolocationErrorCode {
  Timeout = '0',
  Denied = '1',
}

@Injectable({
  providedIn: 'root',
})
export class GeolocationService {
  defaultGeolocationOptions: GeolocationOptions = {
    enableHighAccuracy: true,
    maximumAge: 120,
    timeout: 20 * 60 * 1000,
  };
  cachedPosition: GeolocationPosition;
  cachedPositionTime: number;
  cacheTimeout = 60000; // ms
  constructor() {}

  getPosition(useCache = true): Observable<GeolocationPosition> {

    const cache = this.isCachedPositionValid() && useCache;

    const handlePositionTimeoutError = (error: Error) =>
      error.message.includes(GeolocationErrorCode.Timeout)
        ? getPosition() // retry
        : null;

    const getPosition = (): Promise<GeolocationPosition> =>
      Geolocation.getCurrentPosition(
        this.defaultGeolocationOptions
      ).catch<GeolocationPosition>(handlePositionTimeoutError);

    const position$ = cache ? of(this.cachedPosition) : from(getPosition());

    return position$.pipe(
      take(1),
      map(position => {
        console.log('Geolocation retrieved', position);
        this.cachedPositionTime = Date.now();
        return (this.cachedPosition = position);
      })
    );
  }

  watchPosition(geolocationOptions: GeolocationOptions = {}): Observable<any> {
    const watch = bindCallback(Geolocation.watchPosition);
    return watch(geolocationOptions);
  }

  private isCachedPositionValid(): boolean {
    const cached: boolean = !(!this.cachedPosition || !this.cachedPositionTime);
    const isTimeout = Date.now() - this.cachedPositionTime > this.cacheTimeout;
    console.log('Use cached postion: ', cached && !isTimeout);
    return cached && !isTimeout;
  }
}
