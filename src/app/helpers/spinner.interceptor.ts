// loading-spinner.interceptor.ts
import {
    HttpEvent, HttpHandler, HttpInterceptor,
    HttpRequest, HttpResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AppSpinnerService } from '../services/app-spinner.service';


@Injectable()
export class LoadingSpinnerInterceptor implements HttpInterceptor {
    constructor(private spinnerService: AppSpinnerService) { }

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        this.spinnerService.show();
        return next.handle(req).pipe(
            tap(
                (event) => {
                    if (event instanceof HttpResponse) {
                        this.spinnerService.hide();
                    }
                },
                (error) => {
                    this.spinnerService.hide();
                }
            )
        );
    }
}
