



import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environments';
import { SingleProduct } from '../model/single-product';
import { Category, CategoryList } from '../model/categories';
import { Reels } from '../model/reels';
import { Bridal } from '../model/bridalcollection';
import { Exclusive } from '../model/exclusive';
import { Newarrivals } from '../model/newarrivals';


@Injectable({
  providedIn: 'root'
})
export class ApiserviceService {
  apiurl = environment.Api;
  private jsonUrl = 'assets/country.json';

  constructor(private http: HttpClient) { }

  getProducts(options: any = {}): Observable<any> {
    // console.log(options);
    const url = `${this.apiurl}products/`;
    return this.http.get<any>(url, options);
  }

  getAllProudctList(options: any = {}): Observable<any> {
    // console.log(options);
    const url = `${this.apiurl}home/products/`;
    return this.http.get<any>(url, options);
  }
  getColorsVariantsTag() {
    return this.http.get<any>(`${this.apiurl}storefilter`)
  }

  getFilteredProductsbtTag( params: any) {
    return this.http.get<any>(`${this.apiurl}home/products/?${params}`)
  }
  getPaginationProductsShop( params: any) {
    return this.http.get<any>(`${this.apiurl}home/products/?${params}`)
  }

  getSubcatProducts(options: any): Observable<any> {
    // console.log(options);
    const url = `${this.apiurl}/group/items/${options}`;
    return this.http.get<any>(url);
  }

  getPaginationProducts(id: any, params: any): Observable<any> {
    return this.http.get<any>(`${this.apiurl}/group/items/${id}`, { params: params });
  }
  //Single Product
  getProduct(options: any): Observable<any> {
    // console.log(this.apiurl);
    // console.log(options);
    const url = `${this.apiurl}/item/${options}`;
    return this.http.get<any>(url);
  }

  //single product variant
  getProductVariant(prodId: any, payload: any): Observable<any> {
    const url = `${this.apiurl}/item/${prodId}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(url, payload, { headers });
  }

  getSimilar(uuid: any): Observable<SingleProduct> {
    // console.log(this.apiurl);
    return this.http.get<any>(`${this.apiurl}/similaritems/${uuid}`)
  }

  getTrendingReels(): Observable<SingleProduct> {
    return this.http.get<any>(`${this.apiurl}/item/videos/all`)
  }

  // Bridal collection
  bridalCollection(): Observable<Bridal> {
    return this.http.get<Bridal>(`${this.apiurl}/tags/bridal`)
  }

  // Exclusive collection
  exclusiveCollection(): Observable<Exclusive> {
    return this.http.get<Exclusive>(`${this.apiurl}/tags/exclusive`)
  }

  // NewArrivals
  newArrivalApi(): Observable<Newarrivals> {
    return this.http.get<Newarrivals>(`${this.apiurl}/tags/newarrivals`)
  }

  // Banner
  getHomeBanner(): Observable<any> {
    return this.http.get<any>(`${this.apiurl}/webhome?page=0`)
  }

    // testimonials
    testimonials(): Observable<any> {
      return this.http.get<any>(`${this.apiurl}/home/testimonials`)
    }
  getCategoriesFetch(): Observable<Category> {
    // console.log(this.apiurl);
    return this.http.get<Category>(`${this.apiurl}/department`)
  }

  // Get all tags
  getAllTags(): Observable<any> {
    return this.http.get<any>(`${this.apiurl}/tags`)
  }

  getStore() {
    // console.log(this.apiurl);
    return this.http.get<any>(`${this.apiurl}home/stores`)
  }

  getStoreByState(id: any) {
    // console.log(this.apiurl);
    return this.http.get<any>(`${this.apiurl}home/stores/state/${id}`)
  }

  getBridesOfMugdha() {
    return this.http.get<any>(`${this.apiurl}getBridesOfMugdha.php`)
  }

  getTestimonials() {
    return this.http.get<any>(`${this.apiurl}fetch_testimonials.php`)
  }

  getColorsVariants(uuid: any) {
    return this.http.get<any>(`${this.apiurl}group/filter/${uuid}`)
  }

  getFilteredProducts(uuid: any, params: any) {
    return this.http.get<any>(`${this.apiurl}group/items/${uuid}?${params}`)
  }


  getProfile() {
    return this.http.get<any>(`${this.apiurl}user/profile`)
  }

  updateProfile(data: any) {
    // console.log(data)
    return this.http.put(`${this.apiurl}user/update`, data);
  }

  getWeight(uuid: any) {
    return this.http.get<any>(`${this.apiurl}item/available/${uuid}`)
  }

  homeBanner() {
    return this.http.get<any>(`${this.apiurl}home`)
  }

  groupList() {
    return this.http.get<any>(`${this.apiurl}groupslist`)
  }



  getCountries(): Observable<any[]> {
    return this.http.get<any[]>(this.jsonUrl);
  }
  productsList() {
    return this.http.get<any>(`${this.apiurl}home/products`)
  }

  PaginationProducts(params: any): Observable<any> {
    return this.http.get<any>(`${this.apiurl}/home/products`, { params: params });
  }

  getAllSlot(): Observable<any> {
    return this.http.get<any>(this.apiurl + 'videoslots')
  }

  slotAvailable(id: any,date:any): Observable<any> {
    return this.http.get<any>(this.apiurl + 'slot/' + id+'/'+date);
  }

  callSchedule(formData: any): Observable<any> {
    return this.http.post<any>(this.apiurl + 'create/request', formData)
  }

  getRating(id:any): Observable<any> {
    return this.http.get<any>(this.apiurl + 'home/userratings/'+id)
  }

}
