import { NgModule, InjectionToken, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

export let APP_CONFIG = new InjectionToken<AppConfig>('app.config');

@Injectable()
export class AppConfig {
    apiEndpoint: string;
}

export const APP_DI_CONFIG: AppConfig = {
    apiEndpoint: environment.apiEndPoint
};

@NgModule({
    providers: [{
        provide: APP_CONFIG,
        useValue: APP_DI_CONFIG
    }]
})

export class AppConfigModule { }