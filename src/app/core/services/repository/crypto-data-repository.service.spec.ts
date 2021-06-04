import { TestBed } from '@angular/core/testing';

import { CryptoDataRepositoryService } from './crypto-data-repository.service';

describe('CryptoDataRepositoryService', () => {
  let service: CryptoDataRepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CryptoDataRepositoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
