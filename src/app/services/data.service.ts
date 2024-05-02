import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import {map, tap} from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Appsettings } from '../core_classes/appsettings';

export interface IUserResponse {
  total: number;
  list: number;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  apiendPoint = environment.API_URL;
  apikey = Appsettings.getApiKey();
  constructor(private https: HttpClient) { }

  httpHeader = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  }

  httpDataHeader = {
    headers: new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    })
  };

  httpFormDataHeader = {
    headers: new HttpHeaders({
      'Content-Type': 'multipart/form-data'
    })
  };

  getAll(path: string): Observable<any> {
    return this.https.get(this.apiendPoint + path, this.httpHeader).pipe(
      retry(1),
      catchError(this.httpError)
    );
  }

  getDataById(id, path): Observable<any> {
    return this.https.get(this.apiendPoint + path + '?id=' + id, this.httpHeader)
    .pipe(
      retry(1),
      catchError(this.httpError)
    );
  }

  create(resource, path): Observable<any> {
    return this.https.post(this.apiendPoint + path,
    JSON.stringify(resource), this.httpHeader)
    .pipe(
      retry(1),
      catchError(this.httpError)
    );
  }

  post(resource, path): Observable<any> {
    return this.https.post(this.apiendPoint + path + '/' + this.apikey, JSON.stringify(resource), this.httpDataHeader)
    .pipe(
      retry(1),
      catchError(this.httpError)
    );
  }

  postEncodedData(resource, path): Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    return this.https.post(this.apiendPoint + path, resource, {headers})
    .pipe(
        retry(1),
        catchError(this.httpError)
      );
  }

  update(id, data, path): Observable<any> {
    return this.https.put(this.apiendPoint + path + id, JSON.stringify(data), this.httpHeader)
    .pipe(
      retry(1),
      catchError(this.httpError)
    );
  }

  delete(id, path): Observable<any> {
    return this.https.delete(this.apiendPoint + path + id, this.httpHeader)
    .pipe(
      retry(1),
      catchError(this.httpError)
    );
  }


  httpError(error) {
    let msg = '';
    if(error.error instanceof ErrorEvent) {
      // client side error
      msg = error.error.message;
    } else {
      // server side error
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(msg);
  }

  setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 10 * 60 * 1000));
    const expires = 'expires=' + d.toUTCString();
  }

   getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

   checkCookie(cookiename) {
    let user = this.getCookie(cookiename);
    if (user != "") {
      return false;
    } else {
      return true;
    }
  }

}
