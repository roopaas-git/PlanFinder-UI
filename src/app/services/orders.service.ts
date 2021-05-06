import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable()
export class OrderService {
    constructor(private http: HttpClient) { }

    getOrders() {
        return this.http.get('assets/data/orders.json').pipe(map((data: any) => {            
            return data;
        }))
    }
}