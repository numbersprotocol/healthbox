// import { Injectable } from '@angular/core';
// import * as Web3 from 'web3';


// @Injectable({
//   providedIn: 'root'
// })
// export class WebCryptoApiSignatureProvider {
//   readonly publicKey$ = 'null';

//   readonly privateKey$ = 'null';
//   private web3: any = null;
//   constructor() {
//   }
//   initialize() {
//     return "WebCryptoApiSignatureProvider";
//   }
//     async getPublicKey() {
//     // return this.preferences.getString(PrefKeys.PUBLIC_KEY);
//     // return this.publicKey;
//     return 'this.publicKey';

//   }

//   async getPrivateKey() {
//     // return this.preferences.getString(PrefKeys.PRIVATE_KEY);
//     return 'this.privateKey';
//   }
// }


// import { Injectable } from '@angular/core';
// import { Observable, from } from 'rxjs';
// import { take } from 'rxjs/operators';
// import * as Web3 from 'web3';

// declare let window: any;

// @Injectable({
//   providedIn: 'root'
// })
// export class WebCryptoApiSignatureRoviderService {
//     private web3: any = null;
//     private accountList: Array<string> = [];

//     constructor() {
//         this.web3 = typeof window.web3 !== 'undefined'
//         ? new Web3(window.web3.currentProvider)
//         : new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
//         this.enableConnect().pipe(take(1)).subscribe(
//             res => { this.accountList = res; },
//             err => { console.error(err); }
//         );
//     }

//     public enableConnect(): Observable<any> {
//         return from(this.web3.currentProvider.enable());
//     }

// }



import { Injectable } from '@angular/core';
import {
  createEthAccount,
  loadEthAccount,
} from './crypto/crypto';
import Web3 from 'web3';
import { map, subscribeOn, switchMap, tap } from 'rxjs/operators';
import {
  CryptoDataRepositoryService
} from './repository/crypto-data-repository.service';

import {
  CryptoData
} from '../interfaces/crypto-data';
import { BehaviorSubject, Observable } from 'rxjs';

const web3 = new Web3();

// import { PreferenceManager } from '../../../preference-manager/preference-manager.service';
declare let window: any;

export interface Signature  {
  readonly signature: string;
  readonly publicKey: string;
}

export interface SignatureProvider {
  readonly id: string;
  provide(serializedSortedSignedTargets: string): Promise<Signature>;
}

@Injectable({
  providedIn: 'root',
})
  
export class WebCryptoApiSignatureProvider implements SignatureProvider {
  readonly id = 'WebCryptoApiSignatureProvider';

  readonly publicKey$ = 'null';

  readonly privateKey$ = 'null';


  private readonly cryptoData = new BehaviorSubject<CryptoData>(this.cryptoDataRepo.defaultCryptoData);

  // private readonly preferences = this.preferenceManager.getPreferences(this.id);

  // readonly publicKey$ = this.preferences.getString$(PrefKeys.PUBLIC_KEY);
  publicKey = null;
  // readonly privateKey$ = this.preferences.getString$(PrefKeys.PRIVATE_KEY);
  privateKey = null;
  web3: any;
  enable: any;
  // constructor(private readonly preferenceManager: PreferenceManager) {}
  constructor(
    private readonly cryptoDataRepo: CryptoDataRepositoryService,
    
  ) {
    if (window.ethereum === undefined) {
      alert('Non-Ethereum browser detected. Install MetaMask');
    } else {
      if (typeof window.web3 !== 'undefined') {
        this.web3 = window.ethereum;
      } else {
        this.web3 = new Web3.providers.HttpProvider('http://localhost:8545');
      }
      console.log('transfer.service :: constructor :: window.ethereum');
      window.web3 = new Web3(window.ethereum);
      console.log('transfer.service :: constructor :: this.web3');
      console.log(this.web3);
      // this.enable = this.enableMetaMaskAccount();
    }
  }

  createOrReplaceCryptoData(userData: CryptoData): Observable<CryptoData> {
    return this.cryptoDataRepo.save(userData)
      .pipe(
        tap(newUserData => this.cryptoData.next(newUserData)),
      );
  }
  
  getCryptoData(): Observable<CryptoData> {
    console.log("getCryptoData-01-2")
    return this.cryptoDataRepo.get()
      .pipe(
        map(cryptoData => {
          // if (!cryptoData.privateKey) {
          //   // cryptoData.privateKey = null;
          //   cryptoData.privateKey=privateKey;
          // }
          // cryptoData.privateKey=privateKey;
          return cryptoData;
        }),
        switchMap(newcryptoData => this.cryptoDataRepo.save(newcryptoData)),
        tap(newcryptoData => this.cryptoData.next(newcryptoData)),
      );
  }

  async initialize() {
    const originalPublicKey = this.cryptoData.getValue().publicKey;
    const originalPrivateKey = this.cryptoData.getValue().privateKey;

    console.log("01_originalPublicKey", originalPublicKey)
    console.log("01_originalPrivateKey",originalPrivateKey)


    // const originalPrivateKey = await this.getPrivateKey();
    if (
      originalPublicKey.length === 0 ||
      originalPrivateKey.length === 0 ||
      !originalPublicKey.startsWith('0x')
    ) {
      const account = createEthAccount();
      await this.createOrReplaceCryptoData({
        publicKey:account.address,
        privateKey:account.privateKey
      }).subscribe(function(value) {
        console.log("value", value);
        alert(value.privateKey)
      })
    }
    // const originalPublicKey = await this.getPublicKey();
    // const originalPrivateKey = await this.getPrivateKey();
    // console.log("01")
    // if (originalPublicKey.length === 0 || originalPrivateKey.length === 0) {
    // if(true){
    //   const account = createEthAccount();
    //   console.log(account)

    //   this.publicKey = account.address;
    //   this.privateKey = account.privateKey;

    //   await this.createOrReplaceCryptoData({
    //     publicKey:account.address,
    //     privateKey:account.privateKey
    //   }).subscribe(function(value) {
    //     console.log(value);
    //   })
      
    //   await this.setPublicKey(account.address);
    //   await this.setPrivateKey(account.privateKey);
    // }
  }

  async provide(serializedSortedSignedTargets: string): Promise<Signature> {
    await this.initialize();
    const account = loadEthAccount(await this.getPrivateKey());
    console.log("loadEthAccount-02")
    const sign = account.sign(serializedSortedSignedTargets);
    const publicKey = await this.getPublicKey();
    return { signature: sign.signature, publicKey };
  }

  setPublicKey(key) {
    this.publicKey = key;
    return this.publicKey;
  }

  setPrivateKey(key) {
    this.privateKey = key;
    return this.privateKey;
  }

  getPublicKey() {
    // console.log("loadEthAccount-02")
    // return this.preferences.getString(PrefKeys.PUBLIC_KEY);
    // return this.publicKey$;
    return this.publicKey;

  }

  getPrivateKey() {
    // console.log("loadEthAccount-02")
    // return this.preferences.getString(PrefKeys.PRIVATE_KEY);
    return this.privateKey;
  }
}

const enum PrefKeys {
  PUBLIC_KEY = 'PUBLIC_KEY',
  PRIVATE_KEY = 'PRIVATE_KEY',
}