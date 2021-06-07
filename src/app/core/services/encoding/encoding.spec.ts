import { TestBed } from '@angular/core/testing';

import { EncodingService } from './encoding';
import {
  arrayBufferToBase64,
  arrayBufferToHex,
  arrayBufferToString,
  base64ToArrayBuffer,
  base64ToString,
  hexToArrayBuffer,
  stringToArrayBuffer,
  stringToBase64,
} from './encoding';

describe('EncodingService', () => {
  let service: EncodingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EncodingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

describe('encoding', () => {
  it('should convert between base64 and ArrayBuffer', () => {
    const expected = 'd3Rm';
    expect(arrayBufferToBase64(base64ToArrayBuffer(expected))).toEqual(
      expected
    );
  });

  it('should convert between ArrayBuffer and hex', () => {
    const expected = Uint8Array.from([1, 2, 3]).buffer;
    expect(hexToArrayBuffer(arrayBufferToHex(expected))).toEqual(expected);
  });

  it('should convert between string and ArrayBuffer', () => {
    const expected = 'hello';
    expect(arrayBufferToString(stringToArrayBuffer(expected))).toEqual(
      expected
    );
  });

  it('should convert between string and base64', () => {
    const str = 'hello';

    const base64 = stringToBase64(str);
    expect(base64ToString(base64)).toEqual(str);
  });
});