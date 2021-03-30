import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  public showPlanCompare: boolean = false;

  toggleComparePlan() {
    this.showPlanCompare = !this.showPlanCompare;
  }
  
  constructor() { }

  ngOnInit(): void {
  }

}
