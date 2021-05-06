import { Injectable, Inject } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { APP_CONFIG, AppConfig } from '../config/app.config.module';
import { IEnrollmentPeriod } from '../model/enrollment.model';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';


@Injectable()
export class EnrollmentService {

    constructor(private http: HttpClient, @Inject(APP_CONFIG) private config: AppConfig) { }

    getEnrollmentPeriod(stateId: number, county: any): Observable<any> {
        let body = JSON.stringify(county);
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post<IEnrollmentPeriod[]>(`${this.config.apiEndpoint}Enrollment/Get/${stateId}`, county, { headers: headers })
            .pipe(map((data: any) => {                
                return data.result
            }))
    }
}