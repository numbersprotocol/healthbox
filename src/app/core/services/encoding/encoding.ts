import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EncodingService {

  constructor() { }
}

/* eslint-disable @typescript-eslint/no-magic-numbers */

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

export function base64ToArrayBuffer(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i += 1) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

export function arrayBufferToBase64(arrayBuffer: ArrayBuffer) {
  return btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
}

export function arrayBufferToHex(arrayBuffer: ArrayBuffer) {
  return [...new Uint8Array(arrayBuffer)]
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export function hexToArrayBuffer(hex: string) {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return new Uint8Array(hex.match(/[\da-f]{2}/gi)!.map(h => parseInt(h, 16)))
    .buffer;
}

export function stringToArrayBuffer(str: string) {
  return textEncoder.encode(str).buffer;
}

export function arrayBufferToString(arrayBuffer: ArrayBuffer) {
  return textDecoder.decode(arrayBuffer);
}

export function stringToBase64(str: string) {
  return btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) =>
      String.fromCharCode(parseInt(`0x${p1}`, 16))
    )
  );
}

export function base64ToString(base64: string) {
  return decodeURIComponent(
    atob(base64)
      .split('')
      .map(c => {
        // eslint-disable-next-line no-magic-numbers
        return `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`;
      })
      .join('')
  );
}