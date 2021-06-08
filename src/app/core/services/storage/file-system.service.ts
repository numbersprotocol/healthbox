import { Injectable } from '@angular/core';
import {
  FilesystemDirectory,
  FilesystemEncoding,
  Plugins,
} from '@capacitor/core';
import { defer, from, Observable, of } from 'rxjs';
import {
  catchError,
  concatMap,
  defaultIfEmpty,
  filter,
  map,
} from 'rxjs/operators';

const { Filesystem } = Plugins;

@Injectable({
  providedIn: 'root',
})
export class FileSystemService {
  defaultEncoding = FilesystemEncoding.UTF8;
  constructor() {}

  getFileHash(
    fileName: string,
    dir = FilesystemDirectory.Data
  ): Observable<any> {
    return from(
      Filesystem.readFile({
        path: fileName,
        directory: dir,
      })
    ).pipe(concatMap(result => this.digestMessage(result.data)));
  }

  deleteJsonData(
    filename: string,
    dir = FilesystemDirectory.Data
  ): Observable<any> {
    return defer(() =>
      from(
        Filesystem.deleteFile({
          path: filename,
          directory: dir,
        })
      )
    );
  }

  getJsonData(
    filename: string,
    parse = true,
    dir = FilesystemDirectory.Data
  ): Observable<any> {
    const readFile$ = defer(() =>
      from(
        Filesystem.readFile({
          encoding: this.defaultEncoding,
          path: filename,
          directory: dir,
        })
      )
    );
    return readFile$.pipe(
      catchError(() => of({ data: null })),
      map(readResult => readResult.data),
      filter(data => data != null),
      defaultIfEmpty('{}'),
      map(data => (parse ? JSON.parse(data) : data))
    );
  }

  saveJsonData<T extends Data>(
    data: T,
    dir = FilesystemDirectory.Data
  ): Observable<string> {
    const filename = data.timestamp
      ? `${data.timestamp}.json`
      : `${Date.now()}.json`;
    const writeFile$ = defer(() =>
      from(
        Filesystem.writeFile({
          encoding: this.defaultEncoding,
          path: filename,
          data: JSON.stringify(data),
          directory: dir,
        })
      )
    );
    return writeFile$.pipe(map(() => filename));
  }

  private async digestMessage(message: string) {
    const msgUint8 = new TextEncoder().encode(message); // encode as (utf-8) Uint8Array
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8); // hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
    const hashHex = hashArray
      .map(b => b.toString(16).padStart(2, '0'))
      .join(''); // convert bytes to hex string
    return hashHex;
  }
}

interface Data {
  timestamp: number | string;
}
