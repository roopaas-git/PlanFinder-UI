import { Injectable, Inject } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { APP_CONFIG, AppConfig } from '../config/app.config.module';
import { Observable } from 'rxjs';
import { IBenefit } from '../model/benefit.model';
import { map } from 'rxjs/operators';


@Injectable()
export class BenefitService {
    
    constructor(private http : HttpClient, @Inject(APP_CONFIG) private config : AppConfig) { }

    getBenefits(): Observable<IBenefit[]> {
        return this.http.get<IBenefit[]>(`${this.config.apiEndpoint}Benefit/Get`).pipe(map((data: any) => {
            return data.result.benefits
        }))
    }
}