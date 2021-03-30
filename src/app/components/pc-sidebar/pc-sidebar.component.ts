import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pc-sidebar',
  templateUrl: './pc-sidebar.component.html',
  styleUrls: ['./pc-sidebar.component.css']
})
export class PcSidebarComponent implements OnInit {
  premiumRangeValues: number[] = [20, 180];
  constructor() { }

  ngOnInit(): void {
  }
}
