// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class CryptoDataRepositoryService {

//   constructor() { }
// }

import { Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

import { CryptoData } from '../../interfaces/crypto-data';
import { LocalStorageService } from '../storage/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class CryptoDataRepositoryService {
  CRYPTO_DATA_REPOSITORY = 'cryptoData';
  defaultCryptoData: CryptoData = {
    privateKey: '',
    publicKey:''
  };
  private readonly cryptoData = new Subject<CryptoData>();
  cryptoData$: Observable<CryptoData> = this.cryptoData;

  constructor(
    private readonly localStorage: LocalStorageService
  ) { }

  get(): Observable<CryptoData> {
    return this.localStorage.getData(this.CRYPTO_DATA_REPOSITORY, this.defaultCryptoData);
  }

  save(cryptoData: CryptoData): Observable<CryptoData> {
    return this.localStorage.setData(cryptoData, this.CRYPTO_DATA_REPOSITORY)
      .pipe(tap(u => this.cryptoData.next(u)));
  }

  resetToDefault(): Observable<CryptoData> {
    return this.localStorage.setData(this.defaultCryptoData, this.CRYPTO_DATA_REPOSITORY)
      .pipe(
        tap(u => this.cryptoData.next(u)),
      );
  }
}
