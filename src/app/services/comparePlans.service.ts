import { Injectable, Inject } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { APP_CONFIG, AppConfig } from '../config/app.config.module';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { IComparePlans, IComparePlansWithOrder, ICompareWithBasePlans } from '../model/comparePlans.model';
import { HttpHeaders } from '@angular/common/http';


@Injectable()
export class ComparePlansservice {
    constructor(private http: HttpClient, @Inject(APP_CONFIG) private config: AppConfig) { }

    getBenefitDetails(bidId : IComparePlans): Observable<any[]> {
        let body = JSON.stringify(bidId);
        const headers = new HttpHeaders().set('content-type', 'application/json');
        return this.http.post<IComparePlans>(`${this.config.apiEndpoint}ComparePlans/GetPlans/`, body, { headers: headers }).pipe(map((data: any) => {
            console.log(data.result);
            return data.result
        }))
    }


    getComparePlanBenefitDetails(compareWithBasePlan : ICompareWithBasePlans): Observable<any[]> {
        let body = JSON.stringify(compareWithBasePlan);
        const headers = new HttpHeaders().set('content-type', 'application/json');
        return this.http.post<ICompareWithBasePlans>(`${this.config.apiEndpoint}ComparePlans/CompareBasePlan/`, body, { headers: headers }).pipe(map((data: any) => {
            console.log(data.result);
            return data.result
        }))
    }

    getComparePlanCompactBenefitDetails(compareWithBasePlan : ICompareWithBasePlans): Observable<any[]> {
        let body = JSON.stringify(compareWithBasePlan);
        const headers = new HttpHeaders().set('content-type', 'application/json');
        return this.http.post<ICompareWithBasePlans>(`${this.config.apiEndpoint}ComparePlans/CompareBasePlansDetails/`, body, { headers: headers }).pipe(map((data: any) => {
            console.log("Main Result from Service : ",data.result);
            return data.result
        }))
    }

    getComparePlanBenefitInSortOrderDetails(comparePlansSort : IComparePlansWithOrder): Observable<any[]> {
        let body = JSON.stringify(comparePlansSort);
        const headers = new HttpHeaders().set('content-type', 'application/json');
        return this.http.post<IComparePlansWithOrder>(`${this.config.apiEndpoint}ComparePlans/GetSortOrder/`, body, { headers: headers }).pipe(map((data: any) => {
            console.log("Result from Service : " ,data.result);
            return data.result
        }))
    }

    runPythonScript(basePlan: string, compareBidIds: string, userId: string) {
        console.log(" Run Script : ");
        return this.http.get<any[]>(`${this.config.apiEndpoint}Plans/Run/${basePlan}/${compareBidIds}/${userId}`).pipe(map((data: any) => {
            console.log("Run Script Result : ", data.result);
            return data.result;
        }))
    }

    readDataFromJson(userId: string) {
        return this.http.get(`${this.config.apiEndpoint}Plans/ReadJsonFile/${userId}`).pipe(map((data: any) => {
            console.log("Data : ", data);
            return data;
        }))
    }

    // handleError(error: HttpErrorResponse) {
    //     console.log("Sample Exception Handling");
    //     return throwError(error);
    // }
}