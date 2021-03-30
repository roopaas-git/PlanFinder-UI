import { Injectable, Inject } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { APP_CONFIG, AppConfig } from '../config/app.config.module';
import { Observable } from 'rxjs';
import { IUser } from '../model/user.model';
import { map } from 'rxjs/operators';

@Injectable()
export class UserService {

    constructor(private http: HttpClient, @Inject(APP_CONFIG) private config: AppConfig) { }

    getUserDetails(userId: string): Observable<IUser[]> {
        return this.http.get<IUser[]>(`${this.config.apiEndpoint}User/Get/${userId}`)
            .pipe(map((data: any) => {
                return data.result.users;
            }))
    }
}