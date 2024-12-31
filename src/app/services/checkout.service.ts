import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { param } from 'jquery';
import { catchError, map, Observable, of, Subject, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environments';
import Swal from 'sweetalert2';
import { ToasterService } from './toaster.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  apiUrl = environment.apiUrl;
  ApiEndPoint = environment.ApiEndPoint;

  constructor(private http: HttpClient, private toasterService: ToasterService,private router:Router) { }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // console.log(error); // log to console instead
      this.log(`${error?.error?.message}`);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
  /** Log a CartService message with the MessageService */
  private log(message: string) {
    this.toasterService.addError(message);
  }

  placeorder(): Observable<any[]> {
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
      this.router.navigate(['/login']);
      return throwError("User not logged in");
    }
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.post<any>(`${this.ApiEndPoint}/order/placeorder`, { headers: httpHeaders })
  }

  buyNow(params:any): Observable<any[]> {
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
      
      this.router.navigate(['/login']);
      return throwError("User not logged in");
    }
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.post<any>(`${this.ApiEndPoint}/order/buynow`, params, { headers: httpHeaders })
  }

  createsession(orderID: any): Observable<any[]> {
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
      return throwError("User not logged in");
    }
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.post<any>(`${this.ApiEndPoint}/payment/createsession`, { orderID }, { headers: httpHeaders })
  }

  postelcode(code: any) {
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
      return throwError("User not logged in");
    }
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<any>(`${this.ApiEndPoint}postalcode/` + code, { headers: httpHeaders })
  }

  state() {
    return this.http.get<any>(`${this.ApiEndPoint}states`)
  }


  saveAddress(data: any) {
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
      return throwError("User not logged in");
    }
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.post<any>(`${this.ApiEndPoint}/address`, data, { headers: httpHeaders })
  }

  fetchAddress() {
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
      return throwError("User not logged in");
    }
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.get<any>(`${this.ApiEndPoint}/address`, { headers: httpHeaders })
  }
  


  fetchParticularAddress(uuid: any) {
    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire({
        position: 'top-end',
        icon: 'warning',
        title: 'Login to Access the App',
        showConfirmButton: false,
        width: '500px',
        timer: 2000,
        customClass: {
          popup: 'large-sa-popup',
        },
      });
      return throwError("User not logged in");
    }
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.get<any>(`${this.ApiEndPoint}/address/` + uuid, { headers: httpHeaders })
  }

  editedAddress(data: any, uuid: string) {
    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire({
        position: 'top-end',
        icon: 'warning',
        title: 'Login to Access the App',
        showConfirmButton: false,
        width: '500px',
        timer: 2000,
        customClass: {
          popup: 'large-sa-popup',
        },
      });
      return throwError("User not logged in");
    }
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.put<any>(`${this.ApiEndPoint}/address/` + uuid, data, { headers: httpHeaders })
  }

  deleteAddress(uuid: string) {
    return this.http.delete<any>(`${this.ApiEndPoint}/address/` + uuid)
  }

  selectDeliveryAddress(data: any) {
    return this.http.post<any>(`${this.ApiEndPoint}order/selectaddress/`, data, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: {}

    })
      .pipe(map((arr) => arr.data), catchError(this.handleError<any>(`persistCartItem`)));

  }

  
  orderCheckout(data:any,coupon:any){
    return this.http.post<any>(`${this.ApiEndPoint}order/checkout`,{ 
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      orderID:data,
      coupon:coupon

     })
     .pipe(map((arr) => arr.data), catchError(this.handleError<any>(`persistOrderConfirm`))); 
  }


  getPaginationProducts(id: any, params: any): Observable<any> {
    return this.http.get<any>(`${this.ApiEndPoint}/category/items/${id}`, { params: params });
  }
  orderConfirm(data: any) {
    return this.http.post<any>(`${this.ApiEndPoint}order/orderconfirm/`, { OrderID: data }, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: {}

    })
      .pipe(map((arr) => arr.data), catchError(this.handleError<any>(`persistOrderConfirm`)));
  }
  orderConfirmOnline(data: any) {
    return this.http.post<any>(`${this.ApiEndPoint}order/orderconfirm/online`, data, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: {}

    })
      .pipe(map((arr) => arr.data), catchError(this.handleError<any>(`persistOrderConfirm`)));
  }

  orderStatusCod(orderid: any) {
    return this.http.get<any>(`${this.ApiEndPoint}order/orderstatus/cod/` + orderid)
  }


  orderStatusOnline(orderid: any) {
    return this.http.get<any>(`${this.ApiEndPoint}/payment/orderstatus/` + orderid)
  }

  allOrders() {
    return this.http.get<any>(`${this.ApiEndPoint}/orders`)
  }

  fetchOrders(orderstatus: string) {
    return this.http.get<any>(`${this.ApiEndPoint}/orders?status=${orderstatus}`)
  }
  getcoupons(order:any,uuid: any) {
    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire({
        position: 'top-end',
        icon: 'warning',
        title: 'Login to Access the App',
        showConfirmButton: false,
        width: '500px',
        timer: 2000,
        customClass: {
          popup: 'large-sa-popup',
        },
      });
      return throwError("User not logged in");
    }
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`

    });
    return this.http.put<any>(`${this.ApiEndPoint}coupon/` + uuid,order, { headers: httpHeaders })
  }

}
