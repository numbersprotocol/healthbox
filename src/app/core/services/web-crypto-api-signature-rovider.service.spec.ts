import { TestBed } from '@angular/core/testing';

import { WebCryptoApiSignatureProvider } from './web-crypto-api-signature-rovider.service';

describe('WebCryptoApiSignatureRoviderService', () => {
  let service: WebCryptoApiSignatureProvider;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebCryptoApiSignatureProvider);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
