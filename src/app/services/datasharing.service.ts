import { Injectable } from "@angular/core";
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';


@Injectable()
export class DataSharingService {
    
    private messageSource = new BehaviorSubject('Welcome');
    currentMessage = this.messageSource.asObservable();
    
    constructor() { }

    changeMessage(message: string) {
        this.messageSource.next(message);
    }
}