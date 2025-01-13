import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
  })
  export class LoaderService {
    private requestCount = 0;
    private isLoadingSubject = new BehaviorSubject<boolean>(false);
    public isLoading$ = this.isLoadingSubject.asObservable();
  
    show() {
      this.requestCount++;   
      this.isLoadingSubject.next(true);
    }
  
    hide() {
      this.requestCount--;
      // console.log(this.requestCount);
      if (this.requestCount === 1) {
        this.isLoadingSubject.next(false);
      }
    }
  }