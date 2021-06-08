import { Injectable } from "@angular/core";
import { createEthAccount, loadEthAccount } from "./crypto/crypto";
import Web3 from "web3";
import { map, subscribeOn, switchMap, tap } from "rxjs/operators";
import { CryptoDataRepositoryService } from "./repository/crypto-data-repository.service";

import { CryptoData } from "../interfaces/crypto-data";
import { BehaviorSubject, Observable } from "rxjs";
import { provider } from "web3-core";

const web3 = new Web3();

declare let window: { ethereum: provider; web3: Web3 };

export interface Signature {
  readonly signature: string;
  readonly publicKey: string;
}

export interface SignatureProvider {
  readonly id: string;
  provide(serializedSortedSignedTargets: string): Promise<Signature>;
}

@Injectable({
  providedIn: "root",
})
export class WebCryptoApiSignatureProvider implements SignatureProvider {
  readonly id = "WebCryptoApiSignatureProvider";
  readonly publicKey$ = "null";
  readonly privateKey$ = "null";
  private readonly cryptoData = new BehaviorSubject<CryptoData>(
    this.cryptoDataRepo.defaultCryptoData
  );

  publicKey = null;
  privateKey = null;
  web3: any;
  enable: any;
  constructor(private readonly cryptoDataRepo: CryptoDataRepositoryService) {
    //Test web3 (DEV)
    if (window.ethereum === undefined) {
      alert("Non-Ethereum browser detected. Install MetaMask");
    } else {
      if (typeof window.web3 !== "undefined") {
        this.web3 = window.ethereum;
      } else {
        this.web3 = new Web3.providers.HttpProvider("http://localhost:8545");
      }
      console.log("transfer.service :: constructor :: window.ethereum");
      window.web3 = new Web3(window.ethereum);
      console.log("transfer.service :: constructor :: this.web3");
      console.log(this.web3);
    }
  }

  createOrReplaceCryptoData(userData: CryptoData): Observable<CryptoData> {
    return this.cryptoDataRepo
      .save(userData)
      .pipe(tap((newUserData) => this.cryptoData.next(newUserData)));
  }

  getCryptoData(): Observable<CryptoData> {
    return this.cryptoDataRepo.get().pipe(
      switchMap((newcryptoData) => this.cryptoDataRepo.save(newcryptoData)),
      tap((newcryptoData) => this.cryptoData.next(newcryptoData))
    );
  }

  async initialize() {
    const originalPublicKey = this.cryptoData.getValue().publicKey;
    const originalPrivateKey = this.cryptoData.getValue().privateKey;
    if (
      originalPublicKey.length === 0 ||
      originalPrivateKey.length === 0 ||
      !originalPublicKey.startsWith("0x")
    ) {
      const account = createEthAccount();
      await this.createOrReplaceCryptoData({
        publicKey: account.address,
        privateKey: account.privateKey,
      }).subscribe(account=> {
        console.log("account", account);
        return account;
      });
    }
  }

  async provide(serializedSortedSignedTargets: string): Promise<Signature> {
    await this.initialize();
    const account = loadEthAccount(await this.getPrivateKey());
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
    return this.publicKey;
  }

  getPrivateKey() {
    return this.privateKey;
  }
}
