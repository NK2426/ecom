import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class OrderstatusService {
  Api = environment.Api;
  constructor(private http: HttpClient) { }

  viewOrder(uuid: any) {
    return this.http.get<any>(`${this.Api}/order/view/` + uuid);
  }
  cancelOrder(uuid: any) {
    const token = localStorage.getItem('token');
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.put<any>(`${this.Api}/order/cancel/` + uuid, { headers: httpHeaders });
  }
  rateitemWithReview(uuid: any,data:any) {
    const token = localStorage.getItem('token');
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.put<any>(`${this.Api}/addreviews/` + uuid, data,{ headers: httpHeaders });
  }
  rateitem(uuid: any,data:any) {
    const token = localStorage.getItem('token');
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.put<any>(`${this.Api}/addrating/` + uuid, {rating:data},{ headers: httpHeaders });
  }

  refundDetails(uuid: any): Observable<any> {
    return this.http.post(`${this.Api}order/refunddetail/${uuid}`, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }
  // refundDetails(uuid: any): Observable<any> {
  //   return this.http.post(`https://mugdhaapp-dev.mugdhaapp.com/api/v1/order/refunddetail/${uuid}`,{
  //     headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  // });
  // }

  downloadInvoice(id:any) {
    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire({
        position: 'top-end',
        icon: 'warning',
        title: 'Login to Access the App',
        showConfirmButton: false,
        width: '300px',
        timer: 2000,
        customClass: {
          popup: 'large-sa-popup',
        },
      });

    }
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.get<any>(`${this.Api}/order/pdf/`+id, { headers: httpHeaders })
  }

}
