import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environments';
import { Tag } from '../model/tags';

@Injectable({
    providedIn: 'root'
})
export class TagService {
    Api = environment.Api;

    constructor(private http: HttpClient) { }

    getTagWithUUID(uuid: any): Observable<Tag> {
        return this.http.get<Tag>(`${this.Api}/tags/item/` + uuid);
    }

    getColorsVariants(uuid: any) {
        console.log(uuid)
        return this.http.get<any>(`${this.Api}/group/filter/${uuid}`)
    }

    getColorsVariantsTag(uuid: any) {
        return this.http.get<any>(`${this.Api}tags/filter/${uuid}`)
    }

    getFilteredProductsbtTag(uuid: any, params: any) {
        return this.http.get<any>(`${this.Api}tags/item/${uuid}?${params}`)
    }
}