import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  ApiEndPoint = environment.ApiEndPoint;

  private wishlistCountSubject = new BehaviorSubject<number>(0);
  wishlistCount$ = this.wishlistCountSubject.asObservable();

  setWishlistCount(count: number) {
    this.wishlistCountSubject.next(count);
  }
  private wishlistSubject = new Subject<any>();

  wishlistEvent$ = this.wishlistSubject.asObservable();

  constructor(private http: HttpClient) { }

  getWishlist(): Observable<any[]> {
    // console.log(this.ApiEndPoint);
    return this.http.get<any[]>(`${this.ApiEndPoint}/wishlist`)
  }

  addToWishlist(item_uuid: any) {
    // console.log(item_uuid);
    const token = localStorage.getItem('token');
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.post<any>(`${this.ApiEndPoint}/wishlist`, { item_uuid }, { headers: httpHeaders })
  }

  addToWishlistCount(data: any) {
    this.wishlistSubject.next(data);
  }
}
