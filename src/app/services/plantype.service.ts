import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { APP_CONFIG, AppConfig } from '../config/app.config.module';
import { Observable } from 'rxjs';
import { IPlantype } from '../model/plantype.model';
import { map } from 'rxjs/operators';


@Injectable()
export class PlantypeService {
    constructor(private http: HttpClient, @Inject(APP_CONFIG) private config: AppConfig) { }

    getPlantypes(stateId: number, county: any): Observable<IPlantype[]> {
        let body = JSON.stringify(county);
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post<IPlantype[]>(`${this.config.apiEndpoint}PlanType/Get/${stateId}`, county, { headers: headers })
            .pipe(map((data: any) => {
                return data.result.planTypes
            }))
    }
}