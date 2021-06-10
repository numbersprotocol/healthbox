import { Injectable } from '@angular/core';
import { sendMessage } from '@numbersprotocol/niota';
import { Observable, of } from 'rxjs';
import { catchError, concatMap, map, take, tap, timeout } from 'rxjs/operators';
import { WebCryptoApiSignatureProvider } from '../../core/services/web-crypto-api-signature-rovider.service'

@Injectable({
  providedIn: 'root',
})
export class LedgerService {
  constructor(
    private readonly CryptoSignature: WebCryptoApiSignatureProvider
  ) {
    this.CryptoSignature.initialize();
  }

  private registerOnLedger(hash: string): Observable<any> {
    const index = 'Lifebox';
    const rawMsg = { hash };
    return this.CryptoSignature.getCryptoData().pipe(
      concatMap((cryptoData) => sendMessage(index, rawMsg, cryptoData.publicKey)),
      timeout(10000),
      tap(messageId => {
        console.log(`Message ID ${messageId} registered on ledger`)
      }
      ),
      catchError(err => {
        console.log(err);
        return of('');
      })
      
    )
  }

  createTransactionHash(hash): Observable<string> {
    return this.registerOnLedger(hash);
  }
}
