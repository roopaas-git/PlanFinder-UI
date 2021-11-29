import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { APP_CONFIG, AppConfig } from '../config/app.config.module';
import { Observable } from 'rxjs';
import { IPlans } from '../model/plans.model';
import { map } from 'rxjs/operators';
import { IPeriod } from '../model/period.model';


@Injectable()
export class PlansService {

    constructor(private http: HttpClient, @Inject(APP_CONFIG) private config: AppConfig) { }

    getPlans(state: number, county: string, plantype: string, snptype: string, crosswalk: string) {
        let body = JSON.stringify(county);
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post<IPlans[]>(`${this.config.apiEndpoint}Plans/Get/${state}/${plantype}/${snptype}/${crosswalk}`, county, { headers: headers })
            .pipe(map((data: any) => {
                
                return data.result;
            }))
    }


    getPlansByPeriod(state: number, county: string, plantype: string, snptype: string, crosswalk: string, period: string) {
        let body = JSON.stringify(county);
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post<IPlans[]>(`${this.config.apiEndpoint}Plans/GetByPeriod/${state}/${plantype}/${snptype}/${crosswalk}/${period}`, county, { headers: headers })
            .pipe(map((data: any) => {
                
                return data.result;
            }))
    }

    getPlansBetweenPeriods(state: number, county: string, plantype: string, snptype: string, crosswalk: string, fromPeriod: string, toPeriod: string) {
        let body = JSON.stringify(county);
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post<IPlans[]>(`${this.config.apiEndpoint}Plans/GetEnrollementsBetweenPeriod/${state}/${plantype}/${snptype}/${crosswalk}/${fromPeriod}/${toPeriod}`, county, { headers: headers })
            .pipe(map((data: any) => {
                
                return data.result;
            }))
    }


    getMaxPeriod() {
        return this.http.get<IPeriod[]>(`${this.config.apiEndpoint}Plans/GetMaxYear`).pipe(map((data: any) => {
            if (data.success == true) return data.result
            else return null
        }))
    }

    getMaxYOYPeriod() {
        return this.http.get<IPeriod[]>(`${this.config.apiEndpoint}Plans/GetMaxYOYYear`).pipe(map((data: any) => {
            if (data.success == true) return data.result
            else return null
        }))
    }
}