import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Car } from '../model/car.model';
import { map } from 'rxjs/operators';


@Injectable()
export class CarService {
    brands: string[] = ['Audi', 'BMW', 'Fiat', 'Ford', 'Honda', 'Jaguar', 'Mercedes', 'Renault', 'Volvo', 'VW'];

    colors: string[] = ['Black', 'White', 'Red', 'Blue', 'Silver', 'Green', 'Yellow'];

    constructor(private http : HttpClient) {}

    getCarsSmall() {
        return this.http.get<Car[]>('assets/data/car.json').pipe(map((data: any) => {           
            return data.data;
        }))
    }

    getCarsMedium() {
        return this.http.get<any>('assets/data/car-medium.json')
        .toPromise()
        .then(res => <Car[]>res.data)
        .then(data => { return data; });
    }
}