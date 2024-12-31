import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class LiveEventsService {


  apiurl = environment.ApiEndPoint;

  constructor(private http: HttpClient) { }

  getEvents(): Observable<any> {
    // console.log(options);
    const url = `${this.apiurl}events/`;
    return this.http.get<any>(url);
  }

  singleEvent(eventID:any){
    const url = `${this.apiurl}events/${eventID}`;
    return this.http.get<any>(url);
  }
}

