import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  ApiEndPoint = environment.ApiEndPoint;

  constructor(private http: HttpClient) {
  }

  sentContactFormData(data: any): Observable<any> {
    const postapiurl = `${this.ApiEndPoint}/contact`
    // console.log(data)
    return this.http.post(postapiurl, data);
  }
}
