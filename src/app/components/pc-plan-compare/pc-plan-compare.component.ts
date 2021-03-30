import { Component, OnInit } from '@angular/core';
import { IPlans } from 'src/app/model/plans.model';
import { Table } from 'primeng/table/table';

@Component({
  selector: 'app-pc-plan-compare',
  templateUrl: './pc-plan-compare.component.html',
  styleUrls: ['./pc-plan-compare.component.css']
})
export class PcPlanCompareComponent implements OnInit {
  plans: IPlans[]
  constructor() { }

  ngOnInit(): void {
  }

}
