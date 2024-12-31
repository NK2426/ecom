import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class OrderTrackingService {

  ApiEndPoint = environment.ApiEndPoint;

  constructor(private http: HttpClient) { }

  getOrderTraking(uuid:any): Observable<any[]> {
    // console.log(this.ApiEndPoint);
    return this.http.get<any[]>(`${this.ApiEndPoint}order/trackorder/${uuid}`)
  }

}
