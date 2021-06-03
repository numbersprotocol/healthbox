import { TestBed } from '@angular/core/testing';

import { WebCryptoApiSignatureRoviderService } from './web-crypto-api-signature-rovider.service';

describe('WebCryptoApiSignatureRoviderService', () => {
  let service: WebCryptoApiSignatureRoviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebCryptoApiSignatureRoviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
