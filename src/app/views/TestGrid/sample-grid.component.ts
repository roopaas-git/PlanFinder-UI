import { Component, OnInit, ViewChild } from '@angular/core';
import { CarService } from 'src/app/services/car.service';
import { Car } from 'src/app/model/car.model';
import jsPDF from 'jspdf';
import { Table } from 'primeng/table/table';
import { IPlansList } from 'src/app/model/plans.model';
import { isNgTemplate } from '@angular/compiler';

@Component({
  selector: 'app-sample-grid',
  templateUrl: './sample-grid.component.html',
  styleUrls: ['./sample-grid.component.css']
})

export class SampleGridComponent implements OnInit {
  orders: any[];
  val1: number = 20;
  rangeMinDefaultValue: number = -45550;
  rangeMinValue: number = -45550;
  rangeMaxValue: number = 10000;
  rangeValues: number[];
  cols: any[];
  cars: Car[];
  exportColumns: any[];
  plansList: IPlansList[] = [];
  cols1: IPlansList[] = [];
  currentYear: number = 2020;
  previousYear: number = 2019;
  rowGroupMetadata: any;

  @ViewChild('pTableId', { static: false }) pTableRef: Table;

  constructor(private carSerive: CarService) { }

  ngOnInit() {
    this.bindRangeValues();
    this.bindTable();
  }

  ngAfterViewInit() {
    const table = this.pTableRef.el.nativeElement.querySelector('table');
    table.setAttribute('id', 'myTableId');
  }

  getPreviousYears() {
    this.previousYear = this.previousYear > this.currentYear ? this.previousYear - 2 : this.previousYear + 2;
    console.log("Previos Years : ", this.previousYear);
  }

  bindTable() {
    //this.carSerive.getCarsSmall().then(cars => this.cars = cars);
    this.carSerive.getCarsSmall()
      .subscribe((result: any) => {
        if (result) {
          this.cars = result;
          console.log("Current Cars : ", this.cars);
          this.getColumns(this.cars);
          this.updateRowGroupMetaData();
        }
      });
  }

  preventInput(value) {
    console.log("Value : ", value);
    console.log(" Range MaxValue : ", this.rangeMaxValue);
    if (value >= this.rangeMaxValue) {
      console.log("Extraa");
      event.preventDefault()
      this.rangeValues[0] = parseInt(value.toString().substring(0, 4));
      // this.rangeValues[0] = this.rangeMaxValue - 1;
    }
  }

  updateRowGroupMetaData() {
    this.rowGroupMetadata = {};
    if (this.cars) {
      for (let i = 0; i < this.cars.length; i++) {
        let rowData = this.cars[i];
        let brand = rowData.brand;
        if (i == 0) {
          this.rowGroupMetadata[brand] = { index: 0, size: 1 };
        }
        else {
          let previousRowData = this.cars[i - 1];
          let previousRowGroup = previousRowData.brand;
          if (brand === previousRowGroup)
            this.rowGroupMetadata[brand].size++;
          else
            this.rowGroupMetadata[brand] = { index: i, size: 1 };
        }
      }
    }
  }

  bindRangeValues() {
    this.rangeValues = [this.rangeMinValue, this.rangeMaxValue];
  }

  ChangeMin(newValue) {
    console.log("Min Value :", newValue.values[0]);
    console.log("Max Value :", newValue.values[1]);
    this.rangeMinValue = newValue;
  }

  changeMaxRange(newValue) {
    console.log("Max Value :", newValue);
    this.rangeMaxValue = newValue;
    console.log("Range Max Value :", this.rangeValues);
  }

  getColumns(cars: any) {

    let val = cars[0];
    let col = Object.keys(val);
    console.log("Vals :", val);
    console.log("Item by Item :", Object.keys(val));
    col.forEach(items => {
      console.log("Items :", items);
      this.plansList.push({ field: items, header: items });
    });
    console.log("Plans List : ", this.plansList);
    this.cols = this.plansList;

    this.exportColumns = this.cols.map(col => ({ title: col.header, dataKey: col.field }));
  }

  exportPdf() {
    // import("jspdf").then(jsPDF => {
    //   import("jspdf-autotable").then(x => {
    //     const doc = new jsPDF.default(0, 0);
    //     doc.autoTable(this.exportColumns, this.cars);
    //     doc.save('SampleTest.pdf');
    //   })
    // })

    const doc = new jsPDF();
    var tab = document.querySelector('#myTableId');
    doc.fromHTML(tab, 15, 16);
    doc.save("output.pdf");
  }
}
