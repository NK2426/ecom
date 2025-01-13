import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environments';

import { Observable, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SearchService {

  Api = environment.Api;

  constructor(private http: HttpClient) { }

  search(data: any) {
    return this.http.get<any>(`${this.Api}/search?search=` + data);
    // return this.http.get<any>(`${this.Api}search/?search=`+data)
  }
  searchlist(data: any) {
    return this.http.get<any>(`${this.Api}/searchlist?search=` + data);
    // return this.http.get<any>(`${this.Api}search/?search=`+data)
  }

  getFilteredProducts(params: any) {
    return this.http.get<any>(`${this.Api}searchlist?${params}`)
}

  PaginationProducts(params: any): Observable<any> {
    
    return this.http.get<any>(`${this.Api}/searchlist`, { params:params });
  }

  getfilter() {
    return this.http.get<any>(`${this.Api}searchfilter`)
}
}
