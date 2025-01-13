import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';
import { Menu } from '../model/onlineShop';
import { STORE, Store, storeData } from '../model/stores';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  mugdhaUrl = environment.Api;
  constructor(private http: HttpClient) { }

  // getallproduct
  getAllProudctList(id: any): Observable<any> {
    return this.http.get<any>(`${this.mugdhaUrl}stores/` + id);
  }
  getColorsVariantsTag() {
    return this.http.get<any>(`${this.mugdhaUrl}storefilter`)
  }
  onlineShopMenus(): Observable<Menu> {
    return this.http.get<Menu>(`${this.mugdhaUrl}category/menus/all`);
  }

  getAllStore(): Observable<storeData> {
    return this.http.get<storeData>(this.mugdhaUrl + 'storeslist')
  }
  getAllStoreState(): Observable<storeData> {
    return this.http.get<storeData>(this.mugdhaUrl + 'stores')
  }

  getFilteredProductsbtTag(uuid: any, params: any) {
    return this.http.get<any>(`${this.mugdhaUrl}stores/${uuid}?${params}`)
  }

  getPaginationProducts(id: any, params: any): Observable<any> {
    return this.http.get<any>(`${this.mugdhaUrl}stores/${id}`, { params: params });
  }
}
