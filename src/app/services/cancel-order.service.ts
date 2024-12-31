import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class CancelOrderService {

  ApiEndPoint = environment.ApiEndPoint;

  constructor(private http: HttpClient) { }

  getReason(uuid: any): Observable<any[]> {
    // console.log(this.ApiEndPoint);
    return this.http.get<any[]>(`${this.ApiEndPoint}order/reason/${uuid}`)
  }

  cancelReason(id: any, uuid: any) {
    // console.log(id)
    return this.http.put(`${this.ApiEndPoint}order/cancel/${uuid}`, { "reason_id": id });
  }
  
  return(formData: any, uuid: any) {
    return this.http.put(`${this.ApiEndPoint}order/return/${uuid}`, formData);
  }
}
