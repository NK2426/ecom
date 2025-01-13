import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoaderService } from '../helpers/loader.service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {

  constructor(private loaderService: LoaderService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loaderService.show(); // Start loader
    // console.log('insode');
    return next.handle(req).pipe(
      finalize(() => {
        // console.log('insode hide');
        this.loaderService.hide(); // Stop loader when the request finishes (success or error)
      })
    );
  }
}
