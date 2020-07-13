import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpResponse } from '@angular/common/http';
import { ArrayResponse, BackendService, ListResponse, ObjectResponse } from './../../core/base/services/backend-service';
import { Files, Strings, Generic } from '../utils/utils';

import { Observable } from 'rxjs';


const ERROR_DESCARGA = 'Error al descargar';
const JSON = 'application/json';

@Injectable({
  providedIn: 'root'
})

export class UsersService extends BackendService {


  constructor(private readonly http: HttpClient) { super(); }


  async getAllUser(): Promise<ArrayResponse<any>> {
    return new Promise((resolve, reject) => {
      this.http
        .get<ListResponse<any>>('/api/users', {
          observe: 'body'
        })
        .subscribe(
          (response: ListResponse<any>) => {
            this.handleResponse(response, resolve, reject);
          },
          () => {
            reject('Error al recuperar el listado de usuarios');
          }
        );
    });
  }

  async getExportar(): Promise<boolean> {

    return new Promise((resolve, reject) => {
      const httpHeaders = new HttpHeaders({
        'Content-Type': JSON,
        'Accept': JSON
      });
      this.http.get<Blob>('api/exportar',
        {
          observe: 'response',
          headers: httpHeaders,
          responseType: 'blob' as 'json'
        })
        .subscribe((response: HttpResponse<Blob>) => {
          if (response !== null && response !== undefined) {
            const contentDisposition = response.headers.get('Content-Disposition');
            const filename = (contentDisposition
              ? /filename\*?=['"]?(?:UTF-\d['"]*)?([^;\r\n"']*)['"]?;?/gi.exec(contentDisposition)[1]
              : 'Exportacion.xls');

            Files.saveBlobAsFile(response, '.xls', filename);
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
