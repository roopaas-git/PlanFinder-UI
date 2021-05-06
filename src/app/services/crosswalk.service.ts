import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { APP_CONFIG, AppConfig } from '../config/app.config.module';
import { Observable } from 'rxjs';
import { ICrosswalk } from '../model/crosswalk.model';
import { SalesRegionService } from './salesRegion.service';
import { map } from 'rxjs/operators';


@Injectable()
export class CrosswalkService {

    constructor(private http: HttpClient, @Inject(APP_CONFIG) private config: AppConfig) { }

    getCrosswalks(State: number, Plantypes: string, Snptypes: string, county: any): Observable<ICrosswalk[]> {
        let body = JSON.stringify(county);
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post<ICrosswalk[]>(`${this.config.apiEndpoint}Crosswalk/Get/${State}/${Plantypes}/${Snptypes}`,body, { headers: headers })
            .pipe(map((data: any) => {
                
                return data.result.crosswalks
            }))
    }
}