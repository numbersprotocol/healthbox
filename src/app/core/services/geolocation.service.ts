import { Injectable } from '@angular/core';

import { bindCallback, from, Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';

import {
  GeolocationOptions,
  GeolocationPosition,
  Plugins,
} from '@capacitor/core';

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
    maximumAge: 0, //120 這是一個正值，它代表可以接受暫存位置的最長時限（單位是毫秒）。如果設定為 0，代表機器必須回傳實際的當前位置而不能使用暫存位置。
    timeout: 20 * 60 * 1000,
  };
  cachedPosition: GeolocationPosition;
  cachedPositionTime: number;
  cacheTimeout = 10; // ms
  constructor() { }
  
  getPosition(useCache = true): Observable<GeolocationPosition> {

    const handlePositionTimeoutError = (error: Error) =>
      error.message.includes(GeolocationErrorCode.Timeout)
        ? getPosition() // retry
        : null;

    const getPosition = (): Promise<GeolocationPosition> =>
      Geolocation.getCurrentPosition(
        this.defaultGeolocationOptions
      ).catch<GeolocationPosition>(handlePositionTimeoutError);

    const position$ = from(getPosition());

    return position$.pipe(
      take(1),
      map(position => {
        console.log('Geolocation retrieved', position);
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
