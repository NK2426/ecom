// src/app/services/environment.service.ts
import { Injectable } from '@angular/core';

export function initializeEnvironment(environmentService: EnvironmentService) {
    return () => environmentService.initialize();
}

@Injectable({
    providedIn: 'root',
})
export class EnvironmentService {
    private isProduction!: boolean;
    private apiEndpoint!: string;

    initialize(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const hostname = window.location.hostname;
            this.isProduction = !/(localhost|dev|staging|qa|int)/.test(hostname);

            this.apiEndpoint = this.isProduction
                ? 'https://sssemartapp.superssmart.com/'
                : 'https://sssemartapp-staging.superssmart.com/';

            resolve();
        });
    }

    isProductionEnv(): boolean {
        return this.isProduction;
    }

    getApiEndpoint(): string {
        return this.apiEndpoint;
    }
}
