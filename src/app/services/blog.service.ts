import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  apiurl = environment.Api;

  constructor(private http: HttpClient) { }

  getBlogs(): Observable<any> {
    // console.log(options);
    const url = `${this.apiurl}blogs/`;
    return this.http.get<any>(url);
  }

  getBlog(blogId:any){
    const url = `${this.apiurl}blogs/${blogId}`;
    return this.http.get<any>(url);
  }
}
