import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Router } from '@angular/router';
import { Appsettings } from '../core_classes/appsettings';
import { Observable, throwError} from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({providedIn: 'root'})
export class AuthService {
    isLogin = false;
    url = environment.API_URL;
    apiKey = Appsettings.getApiKey();
    constructor(private https: HttpClient, private router: Router) { }
    
    login(data): Observable<any> {
        const uri = this.url + 'authenticate';
        return this.https.post(uri,data).pipe(
            retry(1),
            catchError(this.httpError)
        );
    }
    // user auth check
    loggedIns(): boolean {
       return !! this.getCookie('Xm0oZsKtAaCfViSz')
    }

     // tslint:disable-next-line: typedef
     setCookie(cookieName, cookieValue, expireDays) {
        const d = new Date();
        d.setTime(d.getTime() + (expireDays * 900 * 60 * 1000));
        const expires = 'expires=' + d.toUTCString();
        document.cookie = cookieName + '=' + cookieValue + ';' + expires + ';path=/';
    }

    // tslint:disable-next-line: typedef
    getCookie(cookieName) {
        const name = cookieName + '=';
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
        }
        return '';
    }

    // tslint:disable-next-line: typedef
    logOut(token) {
        const uri = this.url + 'authlogout';
        const data = { 'logout' : true,'api_token':token};
        this.https.post(uri, data).subscribe(
            res => {
                // this.logedin.next(false);
                this.eraseCookie('Xm0oZsKtAaCfViSz');
                this.router.navigate(['/login']);
            }
        );
    }

    eraseCookie(name) {
        document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }

    get_role_data(data): Observable<any> {
        const uri = this.url + 'authuserrole';
        const postdata = {'api_token':data}
        return this.https.post(uri, postdata).pipe(
            retry(1),
            catchError(this.httpError)
        );
    }
   
        
    // tslint:disable-next-line: typedef
  httpError(error) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      // client side error
      msg = error.error.message;
    } else {
      // server side error
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(msg);
  }

}
