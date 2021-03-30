import { Component, OnInit } from '@angular/core';
import { Car } from 'src/app/model/car.model';
import { CarService } from 'src/app/services/car.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  cars: Car[];
  rowGroupMetadata: any;

  constructor(private carService: CarService) { }

  ngOnInit(): void {
    this.carService.getCarsMedium().then(cars => {
      this.cars = cars;
      console.log(" Cars : ", cars);
      this.updateRowGroupMetaData();
    });
  }

  onSort() {
    this.updateRowGroupMetaData();
  }

  updateRowGroupMetaData() {
    this.rowGroupMetadata = {};
    if (this.cars) {
      for (let i = 0; i < this.cars.length; i++) {
        let rowData = this.cars[i];
        let brand = rowData.brand;
        if (i == 0) {
          this.rowGroupMetadata[brand] = { index: 0, size: 1 };
          console.log("Row Group Meta Data in IF : ", this.rowGroupMetadata[brand]);
        }
        else {
          let previousRowData = this.cars[i - 1];
          //console.log("previous Row Data : ", previousRowData.brand);
          let previousRowGroup = previousRowData.brand;
          if (brand === previousRowGroup){
            this.rowGroupMetadata[brand].size++;
            console.log("Row Group Meta Data in IF IF : ", this.rowGroupMetadata[brand]);
          }
          else
          {
            this.rowGroupMetadata[brand] = { index: i, size: 1 };
            console.log("Row Group Meta Data in Else : ", this.rowGroupMetadata[brand]);
          }
        }
      }
    }
  }

}
