import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environments';
import { Tag } from '../model/tags';

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    Api = environment.Api;

    constructor(private http: HttpClient) { }

    getCategoryWithUUID(uuid: any): Observable<Tag> {
        return this.http.get<Tag>(`${this.Api}category/items/` + uuid);
    }

    getSubcatProducts(options: any): Observable<any> {
        // console.log(options);
        const url = `${this.Api}category/items/${options}`;
        return this.http.get<any>(url);
      }

      getColorsVariants(uuid: any) {
        return this.http.get<any>(`${this.Api}category/filter/${uuid}`)
      }
      getFilteredProducts(uuid: any, params: any) {
        return this.http.get<any>(`${this.Api}category/items/${uuid}?${params}`)
      }

      getSubSortCategories(id: any, params: any): Observable<any> {
        let httpParams = new HttpParams();
        for (const key in params) {
          if (params.hasOwnProperty(key)) {
            httpParams = httpParams.set(key, params[key]);
          }
        }
        return this.http.get<any>(`${this.Api}/category/items/${id}`, { params: httpParams });
      }
      getPaginationProducts(id: any, params: any): Observable<any> {
        return this.http.get<any>(`${this.Api}/category/items/${id}`, { params: params });
      }
}