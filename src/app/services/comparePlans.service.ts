import { Injectable, Inject } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { APP_CONFIG, AppConfig } from '../config/app.config.module';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { IComparePlans, IComparePlansWithOrder, ICompareWithBasePlans } from '../model/comparePlans.model';
import { HttpHeaders } from '@angular/common/http';
import { IAllBenefitGroup } from "../model/benefitGroup.model";


@Injectable()
export class ComparePlansservice {
    constructor(private http: HttpClient, @Inject(APP_CONFIG) private config: AppConfig) { }

    getAllBenefitGroups(isCostShareOnly: boolean): Observable<IAllBenefitGroup[]> {
        return this.http.get<IAllBenefitGroup[]>(`${this.config.apiEndpoint}ComparePlans/GetAllBenefitGroups/${isCostShareOnly}/`).pipe(map((data: any) => {
            return data.result
        }))
    }

    getBenefitDetails(bidId: IComparePlans, isCostShareOnly: boolean, years: any[]): Observable<any[]> {
        let body = JSON.stringify(bidId);
        const headers = new HttpHeaders().set('content-type', 'application/json');
        console.log(years.toString());
        return this.http.post<IComparePlans>(`${this.config.apiEndpoint}ComparePlans/GetPlans/${isCostShareOnly}/${years.toString()}/`, body, { headers: headers }).pipe(map((data: any) => {

            return data.result
        }))
    }

    // This API is not used Hence Commenting 
    // getComparePlanBenefitDetails(compareWithBasePlan: ICompareWithBasePlans): Observable<any[]> {
    //     let body = JSON.stringify(compareWithBasePlan);
    //     const headers = new HttpHeaders().set('content-type', 'application/json');
    //     return this.http.post<ICompareWithBasePlans>(`${this.config.apiEndpoint}ComparePlans/CompareBasePlan/`, body, { headers: headers }).pipe(map((data: any) => {

    //         return data.result
    //     }))
    // }

    getComparePlanCompactBenefitDetails(compareWithBasePlan: ICompareWithBasePlans, isCostShareOnly:boolean ,years: any[]): Observable<any[]> {
        let body = JSON.stringify(compareWithBasePlan);
        const headers = new HttpHeaders().set('content-type', 'application/json');
        return this.http.post<ICompareWithBasePlans>(`${this.config.apiEndpoint}ComparePlans/CompareBasePlansDetails/${isCostShareOnly}/${years.toString()}/`, body, { headers: headers }).pipe(map((data: any) => {

            return data.result
        }))
    }

    getComparePlanBenefitInSortOrderDetails(comparePlansSort: IComparePlansWithOrder, isCostShareOnly: boolean,years: any[]): Observable<any[]> {
        let body = JSON.stringify(comparePlansSort);
        const headers = new HttpHeaders().set('content-type', 'application/json');
        return this.http.post<IComparePlansWithOrder>(`${this.config.apiEndpoint}ComparePlans/GetSortOrder/${isCostShareOnly}/${years.toString()}/`, body, { headers: headers }).pipe(map((data: any) => {

            return data.result
        }))
    }

    runPythonScript(basePlan: string, compareBidIds: string, userId: string) {
        return this.http.get<any[]>(`${this.config.apiEndpoint}Plans/Run/${basePlan}/${compareBidIds}/${userId}`).pipe(map((data: any) => {
            return data.result;
        }))
    }

    readDataFromJson(userId: string) {
        return this.http.get(`${this.config.apiEndpoint}Plans/ReadJsonFile/${userId}`).pipe(map((data: any) => {

            return data;
        }))
    }

    // handleError(error: HttpErrorResponse) {
    //     console.log("Sample Exception Handling");
    //     return throwError(error);
    // }
}