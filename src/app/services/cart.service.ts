import { Injectable, EventEmitter } from '@angular/core';
import { CartProduct, CartProductHttpResponse, CommonHttpResponse, PlaceOrder } from '../model/cart-items';
import { BehaviorSubject, catchError, map, Observable, of, Subject, tap, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvironmentService } from './environment.service';
import { ToasterService } from './toaster.service';
import { environment } from 'src/environments/environments';
import Swal from 'sweetalert2';


@Injectable({
  providedIn: 'root'
})
export class CartService {

  ApiEndPoint = environment.ApiEndPoint;
  private cartSubject = new Subject<any>();

  cartEvent$ = this.cartSubject.asObservable();

  private cartItems: any[];
  public itemsChanged: EventEmitter<any> = new EventEmitter<any>();
  private deletedItemIdSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  apiBaseURL!: string;
  constructor(private toastService: ToasterService, environmentService: EnvironmentService,
    private http: HttpClient) {
    this.cartItems = [];
    this.apiBaseURL = environmentService.getApiEndpoint();
  }


  /** Log a CartService message with the MessageService */
  private log(message: string) {
    this.toastService.addError(message);
  }


  /**
 * Handle Http operation that failed.
 * Let the app continue.
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // console.log(error); // log to console instead
      this.log(`${error?.error?.message}`);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
  private cartCountSubject = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCountSubject.asObservable();

  setCartCount(count: number) {
    this.cartCountSubject.next(count);
  }
  // public getCartItems() {
  //   return this.http.get<CartProductHttpResponse>(this.apiBaseURL + 'api/v1/cart', {
  //     headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  //     params: {}
  //   })
  //     .pipe(map((arr) => {
  //       this.cartItems = arr.data as CartProduct[];
  //       return arr.data

  //     }), catchError(this.handleError<any>(`getCartItems`)));
  // }


  // private getItems() {
  //   return this.cartItems;
  // }
  // // Get Product ids out of CartItem[] in a new array
  // private getItemIds() {
  //   return this.getItems().map((cartItem: CartProduct) => cartItem.itemslist_uuid);
  // }

  // // persist cart items to db
  // public persistCartItem(payload: any) {
  //   return this.http.post<CommonHttpResponse>(this.apiBaseURL + 'api/v1/cart/update', payload, {
  //     headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  //     params: {}
  //   })
  //     .pipe(map((arr) => arr.data), catchError(this.handleError<any>(`persistCartItem`)));
  // }

  // public addItem(item?: CartProduct | null) {
  //   if (!item) {
  //     return
  //   }
  //   // If item is already in cart, add to the amount, otherwise push item into cart
  //   if (this.getItemIds().includes(item.itemslist_uuid)) {
  //     this.cartItems.forEach(function (cartItem) {
  //       if (cartItem.itemslist_uuid === item.itemslist_uuid) {

  //         cartItem.amount = (item.amount * 1);

  //       }
  //     });
  //   } else {
  //     this.cartItems.push(item);
  //     this.toastService.add('Added to cart: ' + item.name);
  //   }
  //   this.itemsChanged.emit(this.cartItems.slice());
  // }

  // public addItems(items: CartProduct[]) {
  //   items.forEach((cartItem) => {
  //     this.addItem(cartItem);
  //   });
  // }


  // // remove cart items to db
  // public removeCartItem(itemlist_uuid: string) {
  //   return this.http.delete<CommonHttpResponse>(this.apiBaseURL + 'api/v1/cart/' + itemlist_uuid, {
  //     headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  //     params: {}
  //   })
  //     .pipe(map((arr) => arr), catchError(this.handleError<any>(`removeCartItem`)));
  // }


  // public removeItem(item: CartProduct | null) {
  //   const indexToRemove = this.cartItems.findIndex(element => element === item);
  //   this.cartItems.splice(indexToRemove, 1);
  //   this.itemsChanged.emit(this.cartItems.slice());
  // }

  // public updateItemAmount(item: CartProduct, newAmount: number) {
  //   this.cartItems.forEach((cartItem) => {
  //     if (cartItem.itemslist_uuid === item.itemslist_uuid) {
  //       cartItem.amount = newAmount;
  //     }
  //   });
  //   this.itemsChanged.emit(this.cartItems.slice());
  // }

  // public clearCart() {
  //   this.cartItems = [];
  //   this.itemsChanged.emit(this.cartItems.slice());
  // }

  // public getTotal(cartItems?: CartProduct[]) {
  //   if (cartItems?.length) this.cartItems = cartItems;
  //   let total = 0;
  //   this.cartItems.forEach((cartItem) => {
  //     total += cartItem.amount * cartItem.qty;
  //   });
  //   return total;
  // }


  // // place order 
  // public placeOrder(payload: any): Observable<PlaceOrder> {
  //   return this.http.post<CommonHttpResponse>(this.apiBaseURL + 'api/v1/order/placeorder', payload, {
  //     headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  //     params: {}
  //   })
  //     .pipe(map((arr) => arr.data), catchError(this.handleError<any>(`placeOrder`)));
  // }






  private cartBagSubject = new Subject<any>();

  cartBagEvent$ = this.cartBagSubject.asObservable();




  cartItemAdded: EventEmitter<void> = new EventEmitter<void>();

  //addToCart Product

  addToCart(item_uuid: any, itemslist_uuid: any, qty: any): Observable<any> {
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

    return this.http.post<any>(`${this.ApiEndPoint}/cart/update`, { item_uuid, itemslist_uuid, qty }, { headers: httpHeaders }).pipe(
      tap(() => {
        // Emit the quantity after adding to the cart
        this.emitQuantity(qty);
      }),
      catchError(error => {
        console.error('Error adding to cart:', error);
        return throwError(error);
      })
    );
  }

  private quantitySubject = new Subject<number>();

  emitQuantity(quantity: number) {
    this.quantitySubject.next(quantity);
  }

  getQuantity(): Observable<number> {
    return this.quantitySubject.asObservable();
  }

  //get product from cart

  getAll() {
    return this.http.get<CartProductHttpResponse>(`${this.ApiEndPoint}/cart`, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: {}
    })
      .pipe(map((arr) => {
        this.cartItems = arr.data as CartProduct[];
        return arr.data

      }), catchError(this.handleError<any>(`getCartItems`)));
  }

  deleteCartItem(item_uuid: string) {
    this.deletedItemIdSubject.next(item_uuid);
    return this.http.delete<CommonHttpResponse>(this.ApiEndPoint + 'cart/' + item_uuid, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: {}
  })
      .pipe(map((arr) => arr), catchError(this.handleError<any>(`removeCartItem`)));
      
  }

  // deleteCartItem(item_uuid: any): Observable<any> {
  //   return this.http.delete<any>(`${this.apiUrl}/cart/` + item_uuid);
  // }

  getDeletedItemId() {
    return this.deletedItemIdSubject.asObservable();
  }

  //emit current qty 
  addToCartCount(data: any) {
    this.cartSubject.next(data);
  }

  addToBagCount(data: any) {
    this.cartBagSubject.next(data);
    // console.log("from service Bage", data);

  }

}
