import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class CancelOrderService {

  Api = environment.Api;

  constructor(private http: HttpClient) { }

  getReason(uuid: any): Observable<any[]> {
    // console.log(this.Api);
    return this.http.get<any[]>(`${this.Api}order/reason/${uuid}`)
  }

  cancelReason(id: any, uuid: any) {
    // console.log(id)
    return this.http.put(`${this.Api}order/cancel/${uuid}`, { "reason_id": id });
  }
  
  return(formData: any, uuid: any) {
    return this.http.put(`${this.Api}order/return/${uuid}`, formData);
  }
}
