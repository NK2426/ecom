import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ParameterService {
  Api = environment.Api;

  constructor(private http: HttpClient) { }

  getParameters(uuid: any): Observable<any> {
    return this.http.get<any>(this.Api + '/itemmoredetail/' + uuid)
  }
}
