// app-spinner.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AppSpinnerService {
    private spinnerSubject = new BehaviorSubject<boolean>(false);

    getSpinnerState() {
        return this.spinnerSubject.asObservable();
    }

    show() {
        this.spinnerSubject.next(true);
    }

    hide() {
        this.spinnerSubject.next(false);
    }
}
