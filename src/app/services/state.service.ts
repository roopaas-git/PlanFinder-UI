import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig, APP_CONFIG } from '../config/app.config.module';
import { map } from 'rxjs/operators';
import { IState } from '../model/state.model';
import { Observable } from 'rxjs';

@Injectable()
export class StateService {

    constructor(private http: HttpClient, @Inject(APP_CONFIG) private config: AppConfig) { }

    getStates() : Observable<IState[]> {
        return this.http.get<IState[]>(`${this.config.apiEndpoint}state`).pipe(map((data: any) => {
            if(data.success == true) return data.result.states 
            else return null
        }))
    }
}