// import { Injectable } from '@angular/core';
// import * as Web3 from 'web3';


// @Injectable({
//   providedIn: 'root'
// })
// export class WebCryptoApiSignatureRoviderService {

//   private web3: any = null;
//   constructor() {
//      }
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
// import { PreferenceManager } from '../../../preference-manager/preference-manager.service';

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
  // private readonly preferences = this.preferenceManager.getPreferences(this.id);

  // readonly publicKey$ = this.preferences.getString$(PrefKeys.PUBLIC_KEY);
  publicKey = null;
  // readonly privateKey$ = this.preferences.getString$(PrefKeys.PRIVATE_KEY);
  privateKey = null;
  // constructor(private readonly preferenceManager: PreferenceManager) {}
  constructor() {}

  async initialize() {
    // const originalPublicKey = await this.getPublicKey();
    // const originalPrivateKey = await this.getPrivateKey();
    const originalPublicKey = '';
    const originalPrivateKey = '';
    if (originalPublicKey.length === 0 || originalPrivateKey.length === 0) {
      const account = createEthAccount();
      this.publicKey = account.address;
      this.privateKey = account.privateKey;
      // await this.preferences.setString(PrefKeys.PUBLIC_KEY, account.address);
      // await this.preferences.setString(
      //   PrefKeys.PRIVATE_KEY,
      //   account.privateKey
      // );
    }
  }

  async provide(serializedSortedSignedTargets: string): Promise<Signature> {
    await this.initialize();
    const account = loadEthAccount(await this.getPrivateKey());
    const sign = account.sign(serializedSortedSignedTargets);
    const publicKey = await this.getPublicKey();
    return { signature: sign.signature, publicKey };
  }

  async getPublicKey() {
    // return this.preferences.getString(PrefKeys.PUBLIC_KEY);
    // return this.publicKey;
    return 'this.publicKey';

  }

  async getPrivateKey() {
    // return this.preferences.getString(PrefKeys.PRIVATE_KEY);
    return 'this.privateKey';
  }
}

const enum PrefKeys {
  PUBLIC_KEY = 'PUBLIC_KEY',
  PRIVATE_KEY = 'PRIVATE_KEY',
}