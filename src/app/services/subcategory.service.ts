import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';
import { Subcategory, SubcategoryData, SubcategoryList } from '../model/subcategories';

@Injectable({
  providedIn: 'root'
})
export class SubcategoryService {
  apiUrl = environment.apiUrl;
  ApiEndPoint = environment.ApiEndPoint;

  constructor(private http: HttpClient) { }

  getSubSortCategories(id: any, params: any): Observable<Subcategory> {
    let httpParams = new HttpParams();
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        httpParams = httpParams.set(key, params[key]);
      }
    }
    return this.http.get<Subcategory>(`${this.ApiEndPoint}/group/items/${id}`, { params: httpParams });
  }

  // mugdha api
  getSubCategory(id: any): Observable<Subcategory> {
    return this.http.get<any>(`${this.ApiEndPoint}/category/groupall/${id}`)
  }
}
