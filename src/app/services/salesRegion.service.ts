import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APP_CONFIG, AppConfig } from '../config/app.config.module';
import { Observable } from 'rxjs';
import { ISalesRegion } from '../model/salesRegion.model';
import { map } from 'rxjs/operators';

@Injectable()
export class SalesRegionService {

    constructor(private http: HttpClient, @Inject(APP_CONFIG) private config: AppConfig) { }

    getSalesRegions(clientId: number,stateId: number): Observable<ISalesRegion[]> {
        return this.http.get<ISalesRegion[]>(`${this.config.apiEndpoint}SalesRegion/Get/${clientId}/${stateId}`).pipe(map((data: any)=>{
            return data.result.regions;
        }))
    }

}