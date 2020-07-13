import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpResponse } from '@angular/common/http';
import { ArrayResponse, BackendService, ListResponse, ObjectResponse } from './../../core/base/services/backend-service';
import { Files, Strings, Generic } from '../utils/utils';

import { Observable } from 'rxjs';
import { AnySoaRecord } from 'dns';

const JSON = 'application/json';

const httpHeaders = new HttpHeaders({
  'Content-Type': JSON,
  'Accept': JSON
});

@Injectable({
  providedIn: 'root'
})
export class DocumentosService extends BackendService {

  constructor(private readonly http: HttpClient) { super(); }


  async addDoc(file?: File): Promise<String> {
    const _formData = new FormData();
    if (file) {
      _formData.append('files', file, file.name);
    }
    return new Promise((resolve, reject) => {
      this.http
        .post<ObjectResponse<String>>('api/users/upload', _formData, {
          observe: 'body'
        })
        .subscribe(
          (response: ObjectResponse<String>) => {
            this.handleResponse(response, resolve, reject);
          }, (res) => {
            if (res.error.text != null) {
              const name = res.error.text;
              this.getExportar(name);
            }
            else {
              reject("Error al convertir el archivo");
            }
          }
        );
    });
  }

  async getExportar(name: String): Promise<boolean> {
    let httpParams: HttpParams = new HttpParams();
    httpParams = httpParams.set('name', `${name}`);
    return new Promise((resolve, reject) => {
      const httpHeaders = new HttpHeaders({
        'Content-Type': JSON,
        'Accept': JSON
      });
      this.http.get<Blob>('api/exportar',
        {
          observe: 'response',
          headers: httpHeaders,
          params: httpParams,
          responseType: 'blob' as 'json'
        })
        .subscribe((response: HttpResponse<Blob>) => {
          if (response !== null && response !== undefined) {
            const contentDisposition = response.headers.get('Content-Disposition');
            const filename = (contentDisposition
              ? /filename\*?=['"]?(?:UTF-\d['"]*)?([^;\r\n"']*)['"]?;?/gi.exec(contentDisposition)[1]
              : 'Exportacion.xls');

            Files.saveBlobAsFile(response, '.csv', filename);
            resolve(true);
          } else {
            reject('Error al exportar');
          }
        },
          () => {
            reject('Error al exportar');
          }
        );
    });
  }



}
