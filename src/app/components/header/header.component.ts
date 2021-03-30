import { Component, OnInit, Input } from '@angular/core';
import { DataSharingService } from 'src/app/services/datasharing.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Input() firstName : string;
  @Input() clientName : string;

  constructor(private _dataSharingService: DataSharingService) { }

  ngOnInit() {
    this._dataSharingService.currentMessage.subscribe(message => this.firstName = message);
  }

}
