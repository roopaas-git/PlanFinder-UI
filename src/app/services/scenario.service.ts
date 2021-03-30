import { Injectable, Inject } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { APP_CONFIG, AppConfig } from '../config/app.config.module';
import { Observable } from 'rxjs';
import { IScenario, IScenarioResults } from '../model/scenario.model';
import { map } from 'rxjs/operators';


@Injectable()
export class ScenarioService {

    constructor(private http: HttpClient, @Inject(APP_CONFIG) private config: AppConfig) { }

    getScenarios(userId: string): Observable<IScenario[]> {
        return this.http.get<IScenario[]>(`${this.config.apiEndpoint}Scenario/Get/${userId}`).pipe(map((data: any) => {
            return data.result;
        }));
    }

    getScenarioResultsById(scenarioId: number) {
        return this.http.get<IScenarioResults[]>(`${this.config.apiEndpoint}Scenario/GetResults/${scenarioId}`).pipe(map((data: any) => {
            console.log(" Data : ", data.result);
            return data.result;
        }));
    }
}