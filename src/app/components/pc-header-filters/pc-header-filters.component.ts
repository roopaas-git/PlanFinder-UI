import { Component, OnInit } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { IState } from 'src/app/model/state.model';
import { ISalesRegion } from 'src/app/model/salesRegion.model';
import { ICounty } from 'src/app/model/county.model';
import { IPlantype } from 'src/app/model/plantype.model';
import { ISnptype } from 'src/app/model/snptype.model';
import { ICrosswalk } from 'src/app/model/crosswalk.model';
import { UserService } from 'src/app/services/user.service';
import { StateService } from 'src/app/services/state.service';
import { SalesRegionService } from 'src/app/services/salesRegion.service';
import { CountyService } from 'src/app/services/county.service';
import { PlantypeService } from 'src/app/services/plantype.service';
import { SnptypeService } from 'src/app/services/snptype.service';
import { CrosswalkService } from 'src/app/services/crosswalk.service';
import { PlansService } from 'src/app/services/plans.service';
import { ActivatedRoute } from '@angular/router';
import { IUser } from 'src/app/model/user.model';
import { DataSharingService } from 'src/app/services/datasharing.service';
import { IPlans } from 'src/app/model/plans.model';

@Component({
  selector: 'app-pc-header-filters',
  templateUrl: './pc-header-filters.component.html',
  styleUrls: ['./pc-header-filters.component.css']
})
export class PcHeaderFiltersComponent implements OnInit {

  userId: string;
  clientId: number;
  firstName: string;

  states: IState[];
  salesRegions: ISalesRegion[];
  counties: ICounty[];
  plantypes: IPlantype[];
  snptypes: ISnptype[];
  crosswalk: ICrosswalk[];

  stateDropdownSettings: IDropdownSettings;
  countyDropdownSettings: IDropdownSettings;
  planTypeDropdownSettings: IDropdownSettings;
  snptypeDropdownSettings: IDropdownSettings;
  salesRegionDropdownSettings: IDropdownSettings;
  crossWalkDropdownSettings: IDropdownSettings;

  selectedStateItems = [];
  selectedSalesRegionItems = [];
  selectedCountyItems = [];
  selectedPlantypeItems = [];
  selectedSnptypesItems = [];
  selectedCrosswalkItems = [];

  private selectedState: number;
  private selectedSalesRegion: string
  private selectedCounty: string
  private selectedPlantype: string
  private selectedSnptype: string
  private selectedCrosswalk: string

  selectedCounties = [];
  selectedPlantypes: string;
  plans : IPlans[];

  constructor(private _userService: UserService, private _stateService: StateService, private _salesRegionService: SalesRegionService,
    private _countyService: CountyService, private _plantypeService: PlantypeService,
    private _snptypeService: SnptypeService, private _crossWalkService: CrosswalkService, private _plansService : PlansService,
    private _dataSharingService: DataSharingService, private route: ActivatedRoute) {
    route.queryParams.subscribe(params => {
      this.userId = route.snapshot.params.userId;
    });
  }

  ngOnInit() {
    this.bindUserDetails();
    this.bindDropdownsettings();
    this.getStatesDefaultValues();
  }

  bindUserDetails() {
    this._userService.getUserDetails(this.userId).subscribe((result: IUser[]) => {
      if (result.length > 0) {
        console.log("User Details :")
        this.firstName = result[0].firstName;
        this.clientId = result[0].clientId;
        this.bindFirstNames(this.firstName);
      }
    })
  }

  bindFirstNames(firstName: string) {
    this._dataSharingService.changeMessage(firstName);
  }


  getStatesDefaultValues() {
    this._stateService.getStates().subscribe((result: IState[]) => {
      console.log(result);
      if (result) {
        this.states = result;
        this.selectedStateItems = [{ id: result[0].id, state: result[0].state }];
        console.log("STate Id : ", result[0].id);
        this.getSalesRegionDefault(this.clientId, result[0].id);
      }
    });
  }

  getSalesRegionDefault(clientId: number, stateId: number) {
    this._salesRegionService.getSalesRegions(clientId, stateId).subscribe((result) => {
      if (result != null) {
        this.selectedState = stateId;
        this.salesRegions = result;
        this.selectedSalesRegionItems = [{ id: result[0].id, region: result[0].region }];
        this.getCountiesDefault(this.selectedState, result[0].id.toString());
      }
    });
  }

  getCountiesDefault(state: number, salesRegionId: string) {
    console.log("Sales Region : ", salesRegionId)
    this._countyService.getCounties(state, salesRegionId, this.clientId).subscribe((result) => {
      if (result != null) {
        this.selectedSalesRegion = salesRegionId;
        this.counties = result;
        result.forEach(element => {
          this.selectedCounties.push(element.id);
        });
        this.selectedCountyItems = result;
        this.getPlantypeDefault(this.selectedCounties);
      }
    });
  }

  getPlantypeDefault(county: any) {
    console.log("Selected Counties : ", county);
    this._plantypeService.getPlantypes(this.selectedState, county).subscribe((result) => {
      console.log("PlanTypes : ", result);
      if (result != null) {
        this.selectedCounty = county;
        this.plantypes = result;
        for (let i = 0; i < result.length; i++) {
          this.selectedPlantypes = i == 0 ? result[i].id.toString() : this.selectedPlantypes + "," + result[i].id.toString();
        }
        this.selectedPlantypeItems = result;
        this.getSnptypeDefault(this.selectedPlantypes);
      }
    });
  }


  getSnptypeDefault(plantype: string) {
    this._snptypeService.getSnptypes(this.selectedState, plantype, this.selectedCounty).subscribe((result) => {
      console.log("SnpTypes : ", result)
      if (result != null) {
        this.selectedPlantype = plantype;
        this.snptypes = result;
        this.selectedSnptypesItems = [{ id: result[0].id, snpType: result[0].snpType }];
        this.getCrosswalkDefault(result[0].id.toString());
      }
    });
  }

  getCrosswalkDefault(snptype: string) {
    this._crossWalkService.getCrosswalks(this.selectedState, this.selectedPlantype, snptype, this.selectedCounty).subscribe((result) => {
      console.log("Crosswalks : ", result)
      if (result != null) {
        this.selectedSnptype = snptype
        this.crosswalk = result
        this.selectedCrosswalkItems = [{ id: result[0].id, crosswalk: result[0].crosswalk }];
      }
    });
  }


  getAllPlans() {
    this.getSelectedCrossWalk();
    this.getAllPlans1();
  }

  getSelectedCrossWalk() {
    for (let index = 0; index < this.selectedCrosswalkItems.length; index++) {
      this.selectedCrosswalk = index == 0 ? this.selectedCrosswalkItems[index].id : this.selectedCrosswalk + "," + this.selectedCrosswalkItems[index].id;
    }
  }
  
  getAllPlans1() {
    this._plansService.getPlans(this.selectedState, this.selectedCounty, this.selectedPlantype, this.selectedSnptype, this.selectedCrosswalk)
      .subscribe((result: IPlans[]) => {
        if (result.length > 0) {
          this.plans = result;
          console.log("Plans Count : ", this.plans.length)
        }
      });
  }

  bindDropdownsettings() {
    this.stateDropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'state',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
      allowSearchFilter: true
    };

    this.salesRegionDropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'region',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
      allowSearchFilter: true
    };

    this.countyDropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'counties',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
      allowSearchFilter: true
    };

    this.planTypeDropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'plantype',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
      allowSearchFilter: true
    };

    this.snptypeDropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'snpType',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
      allowSearchFilter: true
    };

    this.crossWalkDropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'crosswalk',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
      allowSearchFilter: true
    };
  }
}
