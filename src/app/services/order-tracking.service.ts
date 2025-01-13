import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class OrderTrackingService {

  Api = environment.Api;

  constructor(private http: HttpClient) { }

  getOrderTraking(uuid:any): Observable<any[]> {
    // console.log(this.Api);
    return this.http.get<any[]>(`${this.Api}order/trackorder/${uuid}`)
  }

}
