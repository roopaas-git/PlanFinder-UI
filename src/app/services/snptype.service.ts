import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { APP_CONFIG, AppConfig } from '../config/app.config.module';
import { Observable } from 'rxjs';
import { ISnptype } from '../model/snptype.model';
import { map } from 'rxjs/operators';


@Injectable()
export class SnptypeService {

    constructor(private http: HttpClient, @Inject(APP_CONFIG) private config: AppConfig) { }

    getSnptypes(state: number, plantype: string, county: any,): Observable<ISnptype[]> {
        let body = JSON.stringify(county);
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post<ISnptype[]>(`${this.config.apiEndpoint}Snptype/Get/${state}/${plantype}`, body, { headers: headers })
            .pipe(map((data: any) => {
                console.log(data.result.snpTypes)
                return data.result.snpTypes
            }))
    }
}