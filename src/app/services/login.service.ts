import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../model/user';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  loginApi = environment.Api;

  constructor(private http: HttpClient) { }

  login(data: User): Observable<any> {
    const postapiurl = `${this.loginApi}/auth/login`
    // console.log(data)
    return this.http.post(postapiurl, data);
  }
  loginwithGoogle(data: any): Observable<any> {
    const postapiurl = `${this.loginApi}/auth/login/google`
    // console.log(data)
    return this.http.post(postapiurl, data);
  }
  otpVerify(data: User): Observable<any> {
    // console.log(data)
    return this.http.post(`${this.loginApi}/auth/verify`, data);
  }

  email(data: any): Observable<any> {
    // console.log(data)
    return this.http.post(`${this.loginApi}/newsletter`, data);
  }

  getCoupon(): Observable<any> {
    return this.http.get<any>(this.loginApi + 'home/coupons');
  }

}
