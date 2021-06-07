import { Injectable } from '@angular/core';
// import { runTransaction, sendMessage } from '@numbersprotocol/niota';
import { from, Observable, of } from 'rxjs';
import { catchError, tap, timeout } from 'rxjs/operators';
import { WebCryptoApiSignatureProvider } from '../../core/services/web-crypto-api-signature-rovider.service'

@Injectable({
  providedIn: 'root'
})
export class LedgerService {
  readonly publicKey$ = this.webCryptoApiSignatureProvider.publicKey$;
  readonly privateKey$ = this.webCryptoApiSignatureProvider.privateKey$;
  constructor(
    private readonly webCryptoApiSignatureProvider: WebCryptoApiSignatureProvider,

  ) { }

  private registerOnLedger(hash: string): Observable<any> {
    this.webCryptoApiSignatureProvider.initialize();

    let index = "Lifebox"
    let signature = "4382440611608ed43b44275c7e7eb285b926e8c17a20s00beecbb86b4a2d13da3";

    const address = 'HEQLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWOR99D';
    const seed = 'PUEOTSEITFEVEWCWBTSIZM9NKRGJEIMXTULBACGFRQK9IMGICLBKW9TTEVSDQMGWKBXPVCBMMCXWMNPDX';
    const rawMsg = { hash };
    return null
    // return from(sendMessage(index, rawMsg, signature))
    // .pipe(
    //   timeout(10000),
    //   tap(resultHash => console.log(`Hash ${resultHash} registered on ledger`, resultHash)),
    //   catchError(err => {
    //     console.log(err);
    //     return of('');
    //   })
    // );

    // return from(runTransaction(address, seed, rawMsg))
    //   .pipe(
    //     timeout(10000),
    //     tap(resultHash => console.log(`Hash ${resultHash} registered on ledger`, resultHash)),
    //     catchError(err => {
    //       console.log(err);
    //       return of('');
    //     })
    //   );
  }

  createTransactionHash(hash): Observable<string> {
    return this.registerOnLedger(hash);
  }
}
