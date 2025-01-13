import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SingnUp } from '../model/signup';
import { environment } from 'src/environments/environments';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class SignupService {
  Api = environment.Api;
  constructor(private http: HttpClient) { }

  signup(data: SingnUp): Observable<any> {
    const postapiurl = `${this.Api}/auth/create`;
    // console.log(data)
    return this.http.post(postapiurl, data);
  }

  login(data: User): Observable<any> {
    const postapiurl = `${this.Api}/auth/login`
    // console.log(data)
    return this.http.post(postapiurl, data);
  }

}
