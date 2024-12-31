import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environments';
import { Tag } from '../model/tags';

@Injectable({
    providedIn: 'root'
})
export class TagService {
    ApiEndPoint = environment.ApiEndPoint;

    constructor(private http: HttpClient) { }

    getTagWithUUID(uuid: any): Observable<Tag> {
        return this.http.get<Tag>(`${this.ApiEndPoint}/tags/item/` + uuid);
    }
}