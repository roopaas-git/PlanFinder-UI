import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APP_CONFIG, AppConfig } from '../config/app.config.module';
import { Observable } from 'rxjs';
import { ICounty } from '../model/county.model';
import { map } from 'rxjs/operators';


@Injectable()
export class CountyService {

    constructor(private http: HttpClient, @Inject(APP_CONFIG) private config: AppConfig) { }

    getCounties(state: number, salesRegionId: string, clientId: number): Observable<ICounty[]> {
        return this.http.get<ICounty[]>(`${this.config.apiEndpoint}County/Get/${state}/${salesRegionId}/${clientId}`).pipe(map((data: any) => {
            
            return data.result.counties
        }))
    }
}