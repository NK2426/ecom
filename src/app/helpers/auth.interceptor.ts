import {
  HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HTTP_INTERCEPTORS
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';




const TOKEN_HEADER_KEY = 'Authorization';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService, private router: Router) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    let authreq = request;
    let userObj = localStorage.getItem('token') || null;
    
    if (userObj != null) {
      authreq = request.clone({ headers: request.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + userObj) })
    }
    return next.handle(authreq).pipe(
      catchError((error) => {
        if (error.status == 401) {
          this.auth.updateUser(null);// to open the dialog when api responds 401
          this.router.navigateByUrl('/')
        }
        /*  if (error.status == 0) {
           window.location.reload();
         } */
        return throwError(() => error);
      })

    );

  }
}

export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
];
