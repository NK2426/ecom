import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environments';

import { Observable, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SearchService {

  ApiEndPoint = environment.ApiEndPoint;

  constructor(private http: HttpClient) { }

  search(data: any) {
    return this.http.get<any>(`${this.ApiEndPoint}/search?search=` + data);
    // return this.http.get<any>(`${this.ApiEndPoint}search/?search=`+data)
  }
  searchlist(data: any) {
    return this.http.get<any>(`${this.ApiEndPoint}/searchlist?search=` + data);
    // return this.http.get<any>(`${this.ApiEndPoint}search/?search=`+data)
  }

  PaginationProducts(params: any): Observable<any> {
    
    return this.http.get<any>(`${this.ApiEndPoint}/searchlist`, { params:params });
  }
}
