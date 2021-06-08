import { Injectable } from '@angular/core';
import { sendMessage } from '@numbersprotocol/niota';
import { from, Observable, of } from 'rxjs';
import { catchError, tap, timeout } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LedgerService {
  constructor() {}

  private registerOnLedger(hash: string): Observable<any> {
    const index = 'Lifebox';
    const dummySignature = '';
    const rawMsg = { hash };
    return from(sendMessage(index, rawMsg, dummySignature)).pipe(
      timeout(10000),
      tap(resultHash =>
        console.log(`Message ID ${resultHash} registered on ledger`)
      ),
      catchError(err => {
        console.log(err);
        return of('');
      })
    );
  }

  createTransactionHash(hash): Observable<string> {
    return this.registerOnLedger(hash);
  }
}
