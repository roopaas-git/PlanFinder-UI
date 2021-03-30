import { Injectable, Inject } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { APP_CONFIG, AppConfig } from '../config/app.config.module';
import { map } from 'rxjs/operators';
import { IUserInputs } from '../model/userInputs.model';


@Injectable()
export class UserInputsService {
    constructor(private http: HttpClient, @Inject(APP_CONFIG) private config: AppConfig) { }

    addUserInputs(data: IUserInputs) {
        let body = JSON.stringify(data);
        const headers = new HttpHeaders().set('content-type', 'application/json');
        return this.http.post<IUserInputs>(`${this.config.apiEndpoint}UserInputs/Save`, body, { headers: headers })
            .pipe(map((res: any) => {
                return res;
            }));
    }

    // addUserInputs(data: UserInputs) {
    //     let body = JSON.stringify(data);
    //     const headers = new HttpHeaders().set('content-type', 'application/json');
    //     return this.http.post<UserInputs>(`${this.config.apiEndpoint}UserInputs/Save`, body, { headers: headers })
    //         .pipe(map((res: any) => {
    //             return res;
    //         }),
    //             catchError(this.handleError));
    // }

    // handleError(error: HttpErrorResponse) {
    //     console.log("Sample Exception Handling");
    //     return throwError(error);
    // }
}