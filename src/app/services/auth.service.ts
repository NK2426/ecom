import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import { EnvironmentService } from './environment.service';

import { ToasterService } from './toaster.service';
import { User, UserHttpResponse } from '../model/user-login';
import { UserProfile } from '../model/user-profile';
import { environment } from 'src/environments/environments';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiBaseURL =  environment.ApiEndPoint;
  private userSubject = new BehaviorSubject<any>({}); // Pass null when login needs to be shown
  public user: Observable<User> = this.userSubject.asObservable();
  AUTH_USER = 'userID';
  constructor(private toasterService: ToasterService, environmentService: EnvironmentService,
      private http: HttpClient
  ) {
      this.apiBaseURL = environmentService.getApiEndpoint();
  }
  /** Log a DepartmentService message with the MessageService */
  private log(message: string) {
      this.toasterService.addError(message);
  }
  /**
    * Handle Http operation that failed.
    * Let the app continue.
    * @param operation - name of the operation that failed
    * @param result - optional value to return as the observable result
    */
  private handleError<T>(operation = 'operation', result?: T) {
      return (error: any): Observable<T> => {
          console.error(error); // log to console instead
          this.log(`${error?.error?.message}`);
          // Let the app keep running by returning an empty result.
          return of(result as T);
      };
  }


  updateUser(authData: User | null) {
      if (!authData) {
          this.userSubject.next(authData); // Emit a new user value
          return;
      }
      const userData = new User(authData);
      localStorage.removeItem(this.AUTH_USER);
      localStorage.setItem(this.AUTH_USER, JSON.stringify(userData));
      this.userSubject.next(userData); // Emit a new user value

  }

  public loginUser(mobileNumber: string): Observable<Partial<User>> {
      let payload = { mobile: mobileNumber }
      return this.http.post<UserHttpResponse>(this.apiBaseURL + 'api/v1/auth/login', payload, {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
          params: {}
      })
          .pipe(map((arr) => arr.data), catchError(this.handleError<any>(`loginUser`)));
  }
  public loginWithOTP(mobileNumber: string, otp: string): Observable<User> {
      let payload = { mobile: mobileNumber, authkey: `vprcsssemart${otp}` }
      return this.http.post<UserHttpResponse>(this.apiBaseURL + 'api/v1/auth/verify', payload, {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
          params: {}
      })
          .pipe(map((arr) => {
              if (arr.status === 'error') {
                  const err: any = arr.data.detail.message as string;
                  this.log(err)
              } else {
                  this.updateUser(arr.data)
              }
              return arr.data;
          }), catchError(this.handleError<any>(`loginWithOTP`)));
  }

  public registerUser(userName: string, mobileNumber: string): Observable<User> {
      let payload = { name: userName, mobile: mobileNumber, authkey: `vprcsssemart`, device: 'web' }
      return this.http.post<UserHttpResponse>(this.apiBaseURL + 'api/v1/auth/create', payload, {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
          params: {}
      })
          .pipe(map((arr) => {
              if (arr.status === 'error') {
                  const err: any = arr.data.detail.message as string;
                  this.log(err)
              }
              return arr.data;
          }), catchError(this.handleError<any>(`registerWithOTP`)));
  }

  public updateProfile(userName: string, email: string): Observable<Partial<UserProfile>> {
      let payload = { name: userName, email: email }
      return this.http.put<UserHttpResponse>(this.apiBaseURL + 'api/v1/user/update', payload, {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
          params: {}
      })
          .pipe(map((arr) => {
              if (arr.status === 'error') {
                  const err: any = arr.data.detail.message as string;
                  this.log(err)
              }
              return arr.data;
          }), catchError(this.handleError<any>(`updateProfile`)));
  }











  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return !!token; // Convert token to boolean
  }
  logout():boolean{
    localStorage.clear()
    return true
  }

  

}
