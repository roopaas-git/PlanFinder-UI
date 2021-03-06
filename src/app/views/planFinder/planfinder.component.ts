import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { IState } from 'src/app/model/state.model';
import { StateService } from 'src/app/services/state.service';
import { ICounty } from 'src/app/model/county.model';
import { CountyService } from 'src/app/services/county.service';
import { PlantypeService } from 'src/app/services/plantype.service';
import { IPlantype } from 'src/app/model/plantype.model';
import { ISnptype } from 'src/app/model/snptype.model';
import { SnptypeService } from 'src/app/services/snptype.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { IPlans, IPlansList } from 'src/app/model/plans.model';
import { PlansService } from 'src/app/services/plans.service';
import { ISalesRegion } from 'src/app/model/salesRegion.model';
import { ActivatedRoute } from '@angular/router';
import { SalesRegionService } from 'src/app/services/salesRegion.service';
import { ICrosswalk } from 'src/app/model/crosswalk.model';
import { CrosswalkService } from 'src/app/services/crosswalk.service';
import { UserService } from 'src/app/services/user.service';
import { IUser } from 'src/app/model/user.model';
import { IBenefit } from 'src/app/model/benefit.model';
import { BenefitService } from 'src/app/services/benefit.service';
import { IEnrollmentPeriod } from 'src/app/model/enrollment.model';
import { EnrollmentService } from 'src/app/services/enrollment.service';
import { ComparePlansservice } from 'src/app/services/comparePlans.service';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { IUserInputs } from 'src/app/model/userInputs.model';
import { UserInputsService } from 'src/app/services/userInputs.service';
import { IApiResponse } from 'src/app/model/api_response.model';
import { } from 'xlsx'
import { ScenarioService } from 'src/app/services/scenario.service';
import { IScenario, IScenarioResults } from 'src/app/model/scenario.model';
import { IComparePlans, IComparePlansWithOrder, ICompareWithBasePlans } from 'src/app/model/comparePlans.model';
import { IPeriod } from 'src/app/model/period.model';

@Component({
  selector: 'app-planfinder',
  templateUrl: './planfinder.component.html',
  styleUrls: ['./planfinder.component.css']
})

export class PlanfinderComponent implements OnInit {
  userId: string;
  clientId: number;
  firstName: string;
  clientName: string;
  site: string;
  states: IState[];
  salesRegions: ISalesRegion[];
  counties: ICounty[];
  plantypes: IPlantype[];
  snptypes: ISnptype[];
  crosswalk: ICrosswalk[];
  plans: IPlans[];
  copyOfPlans: IPlans[];
  plansBenefits: any[];
  benefits: IBenefit[];
  enrollmentPeriod: IEnrollmentPeriod[];
  scenarios: IScenario[];
  plansBenifitsList: IPlansList[] = [];
  cols: any[];

  selectedStateItems = [];
  selectedSalesRegionItems = [];
  selectedCountyItems = [];
  selectedPlantypeItems = [];
  selectedSnptypesItems = [];
  selectedCrosswalkItems = [];
  selectedBidIds = [];
  selectedBenifit: string = "Premium";
  selectedEnrollmentFromPeriod: string = null;
  selectedEnrollmentToPeriod: string = null;
  CurrentPeriod: string;
  fromPeriod: string;
  toPeriod: string;
  stateDropdownSettings: IDropdownSettings;
  countyDropdownSettings: IDropdownSettings;
  planTypeDropdownSettings: IDropdownSettings;
  snptypeDropdownSettings: IDropdownSettings;
  salesRegionDropdownSettings: IDropdownSettings;
  crossWalkDropdownSettings: IDropdownSettings;
  salesRegiondisabled: boolean = false;
  countydisable: boolean = false;
  planTypedisable: boolean = false;
  snptypedisable: boolean = false;
  crossWalkdisabled: boolean = false;
  compareButtondisabled: boolean = false;
  showCompareButton: boolean = false;
  selectedState: number;
  selectedSalesRegion: string;
  selectedCounty: string;
  selectedPlantype: string;
  selectedSnptype: string;
  selectedCrosswalk: string;
  selectedCounties = [];
  selectedPlantypes: string;
  selectedSnptypes: string;
  icChecked: boolean = false;
  showPlanCompare: boolean = false;
  showScrollTopBtn: boolean;
  topPosToStartShowing = 100;
  showSiderbarFilterBtn: Boolean = true;
  rowGroupMetadata: any;

  premiumMinValue: number = 0;
  premiumMaxValue: number = 0;
  premiumRangeValues: number[];
  selectedPremiumMinValue: number = 0;
  selectedPremiumMaxValue: number = 0;
  selectedPremiumMaxInputValue: number = 0;
  premiumMinDefaultValue: number = 0;
  premiumMaxDefaultValue: number = 0;

  enrollmentMinValue: number = 0;
  enrollmentMaxValue: number = 0;
  enrollmentRangeValues: number[];
  selectedEnrollmentMinValue: number = 0;
  selectedEnrollmentMaxValue: number = 0;
  enrollmentMinDefaultValue: number = 0;
  enrollmentMaxDefaultValue: number = 0;

  enrollmentChangeMinValue: number = 0;
  enrollmentChangeMaxValue: number = 0;
  enrollmentChangeRangeValues: number[];
  selectedEnrollmentChangeMinValue: number = 0;
  selectedEnrollmentChangeMaxValue: number = 0;
  enrollmentChangeMinDefaultValue: number = 0;
  enrollmentChangeMaxDefaultValue: number = 0;

  moopMinValue: number = 0;
  moopMaxValue: number = 0;
  moopRangeValues: number[];
  selectedMoopMinValue: number = 0;
  selectedMoopMaxValue: number = 0;
  selectedMoopMaxInputValue: number = 0;
  moopMinDefaultValue: number = 0;
  moopMaxDefaultValue: number = 0;

  isPremiumChecked: boolean = false;
  isPartBChecked: boolean = false;
  isPlanCoverageChecked: boolean = false;
  isHealthDeductibleChecked: boolean = false;
  isDrugDedictibleChecked: boolean = false;
  isAmbulanceChecked: boolean = false;
  isComphrehensiveDentalChecked: boolean = false;
  isChiropractorChecked: boolean = false;
  isMealChecked: boolean = false;
  isFitnessChecked: boolean = false;
  isOTCChecked: boolean = false;
  isVisionChecked: boolean = false;
  isHearingChecked: boolean = false;
  isEmergencyChecked: boolean = false;
  isTeleHealthChecked: boolean = false;
  isHomeSupportChecked: boolean = false;
  isHomeSafteyChecked: boolean = false;
  isPersChecked: boolean = false;
  valuesFromPython = [];
  finalValuesFromPython = [];
  singleValueFromArray = [];
  scenarioName: string = '';
  SaveScenarioName: string = '';

  isColorCodeSelected: boolean = false;
  isYOYSelected: boolean = false;
  currentYear: number;
  previousYear: number;
  previousYears: string;
  currentBenifitYear: number;
  previousBenifitYear: number;
  previousBenifitYears: string;
  scenarioAlreadyExists: string = "";
  scenarioNamesOnly = [];
  userSelectedScenarioResults: IScenarioResults[];
  isEnrollmentSelected: number = 0;
  isDownload: boolean = true;
  basePlan: string = '';
  isEnrollmentGrowthEnabled: boolean = true;

  @ViewChild('saveModal') closeModal: ElementRef;
  @ViewChild('saveAsModal') closeSaveAsModal: ElementRef;
  @ViewChild('openModal') closeOpenModal: ElementRef;
  @ViewChild('colorModal') closeColorModal: ElementRef;

  @HostListener('window:scroll')

  checkScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

    if (scrollPosition >= this.topPosToStartShowing) {
      this.showScrollTopBtn = true;
    } else {
      this.showScrollTopBtn = false;
    }
  }

  constructor(private _userService: UserService, private _stateService: StateService, private _salesRegionService: SalesRegionService,
    private _countyService: CountyService, private _plantypeService: PlantypeService,
    private _snptypeService: SnptypeService, private _crossWalkService: CrosswalkService,
    private _plansService: PlansService, private _benefitService: BenefitService, private _enrollmentService: EnrollmentService,
    private _comparePlansService: ComparePlansservice, private _userInputService: UserInputsService,
    private _scenarioService: ScenarioService, private messageService: MessageService, private spinner: NgxSpinnerService,
    private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.userId = route.snapshot.params.userId;
    });
  }

  ngOnInit() {
    this.bindUserDetails();
    this.dropdownsettings();
    this.bindRangeDefaultValues();
    this.bindBenifits();
    this.bindScenarioNames();
    this.bindMaxperiod();
    this.bindMaxperiodYOY();
  }

  toggleComparePlan() {
    this.spinner.show();
    this.showPlanCompare = !this.showPlanCompare;
    this.showCompareButton = false;
    this.isDownload = false;
    this.isEnrollmentGrowthEnabled = false;
    this.isColorCodeSelected = false;
    this.goToTop();
    this.bindBenifits()
    this.bindPlanBenfefitDetails();
  }

  checkTrue(id) {
    return this.selectedBidIds.includes(id) ? true : false;
  }

  bindPlanBenfefitDetails() {
    let bidId: IComparePlans = {
      bidId: this.selectedBidIds.toString()
    }

    this._comparePlansService.getBenefitDetails(bidId)
      .subscribe((result: any[]) => {
        console.log(" Result : ", result);
        if (result.length > 0) {
          this.plansBenefits = result;
          console.log("Plan Benifits Count : ", this.plansBenefits.length);
          console.log("Plan Benifits : ", this.plansBenefits);
          this.getColumns(this.plansBenefits);
        }
      }, err => {
        console.log('HTTP Error', err);
        this.spinner.hide();
      });
  }

  getColumns(planBenefits: any) {
    let val = planBenefits[0];
    console.log(" Header : ", val);
    let col = Object.keys(val);
    col.forEach(items => {
      this.plansBenifitsList.push({ field: items, header: items });
    });
    console.log("Plans List : ", this.plansBenifitsList);
    this.cols = this.plansBenifitsList;
    this.updateRowGroupMetaData();
    this.spinner.hide();
  }

  toggleComparePlanBack() {
    this.showPlanCompare = !this.showPlanCompare;
    this.showCompareButton = this.selectedBidIds.length >= 2 ? true : false;
    this.plansBenefits = [];
    this.plansBenifitsList = [];
    this.finalValuesFromPython = null;
    this.isDownload = true;
    this.goToTop();
  }

  goToTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  bindUserDetails() {
    this._userService.getUserDetails(this.userId).subscribe((result: IUser[]) => {
      if (result.length > 0) {
        this.firstName = result[0].firstName;
        this.clientId = result[0].clientId;
        this.clientName = result[0].clientName;
        this.spinner.show();
        this.getStatesDefaultValues();
      }
    })
  }

  bindScenarioNames() {
    this._scenarioService.getScenarios(this.userId).subscribe((result: IScenario[]) => {
      if (result.length > 0) {
        console.log(" Scenarios Result : ", result);
        this.scenarios = result;
        result.forEach(element => {
          this.scenarioNamesOnly.push(element.scenario.toString().toLowerCase());
        });
        console.log("Scenario Names : ", this.scenarios);
      }
    })
  }

  bindMaxperiod() {
    this._plansService.getMaxPeriod().subscribe((result: IPeriod[]) => {
      if (result.length > 0) {
        this.currentYear = result[0].currentYear;
        this.previousYear = result[0].previousYear;
        this.previousYears = result[0].previousYear.toString();
        console.log("Current Year : ", this.currentYear);
        console.log("Current Year : ", this.previousYear);
        console.log("Current Year : ", this.previousYears);
      }
    })
  }

  bindMaxperiodYOY() {
    this._plansService.getMaxYOYPeriod().subscribe((result: IPeriod[]) => {
      if (result.length > 0) {
        this.currentBenifitYear = result[0].currentYear;
        this.previousBenifitYear = result[0].previousYear;
        this.previousBenifitYears = result[0].previousYear.toString();
        console.log("Current Benifit Year : ", this.currentBenifitYear);
        console.log("Current Benifit Year : ", this.previousBenifitYear);
        console.log("Current Benifit Year : ", this.previousBenifitYears);
      }
    })
  }

  bindBenifits() {
    this._benefitService.getBenefits().subscribe((result: IBenefit[]) => {
      if (result.length > 0) {
        this.benefits = result;
      }
    })
  }

  getStatesDefaultValues() {
    this._stateService.getStates().subscribe((result: IState[]) => {
      console.log(result);
      if (result) {
        this.states = result;
        this.selectedStateItems = [{ id: result[30].id, state: result[30].state }];
        this.getSalesRegionDefault(this.clientId, result[30].id);
      }
    });
  }

  getSalesRegionDefault(clientId: number, stateId: number) {
    this._salesRegionService.getSalesRegions(clientId, stateId).subscribe((result) => {
      if (result != null) {
        this.selectedState = stateId;
        this.salesRegions = result;
        this.selectedSalesRegionItems = result;
        for (let i = 0; i < result.length; i++) {
          this.selectedSalesRegion = i == 0 ? result[i].id.toString() : this.selectedSalesRegion + "," + result[i].id.toString();
        }
        this.getCountiesDefault(this.selectedState, this.selectedSalesRegion);
      }
    });
  }

  getCountiesDefault(state: number, salesRegionId: string) {
    console.log("Sales Region : ", salesRegionId)
    this._countyService.getCounties(state, salesRegionId, this.clientId).subscribe((result) => {
      if (result != null) {
        this.selectedSalesRegion = salesRegionId;
        this.counties = result;
        this.selectedCounties = [];
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
        for (let i = 0; i < result.length; i++) {
          this.selectedSnptype = i == 0 ? result[i].id.toString() : this.selectedSnptype + "," + result[i].id.toString();
        }
        this.selectedSnptypesItems = result;
        this.getCrosswalkDefault(this.selectedSnptype);
      }
    });
  }

  getCrosswalkDefault(snptype: string) {
    this._crossWalkService.getCrosswalks(this.selectedState, this.selectedPlantype, snptype, this.selectedCounty).subscribe((result) => {
      if (result != null) {
        this.selectedSnptype = snptype
        this.crosswalk = result
        this.selectedCrosswalkItems = result;
        this.getAllPlans();
      }
    });
  }

  getAllPlans() {
    this.getSelectedCrossWalk();
    this.getAllPlansDetails();
    this.getEnrollmentPeriod();
  }

  getSelectedCrossWalk() {
    for (let index = 0; index < this.selectedCrosswalkItems.length; index++) {
      this.selectedCrosswalk = index == 0 ? this.selectedCrosswalkItems[index].id : this.selectedCrosswalk + "," + this.selectedCrosswalkItems[index].id;
    }
  }

  getAllPlansDetails() {
    this._plansService.getPlans(this.selectedState, this.selectedCounty, this.selectedPlantype, this.selectedSnptype, this.selectedCrosswalk)
      .subscribe((result: IPlans[]) => {
        if (result.length > 0) {
          this.plans = result.sort((a, b) => { return a.premiumCD - b.premiumCD });
          this.copyOfPlans = result.sort((a, b) => { return a.premiumCD - b.premiumCD });
          console.log("Plans Count : ", this.plans.length);
          this.bindBenifits();
          this.getFilterValues();
        }
      });
  }

  getEnrollmentPeriod() {
    this._enrollmentService.getEnrollmentPeriod(this.selectedState, this.selectedCounty)
      .subscribe((result: any) => {
        if (result) {
          this.enrollmentPeriod = result.enrollments;
          this.CurrentPeriod = result.selectedMonth;
          this.fromPeriod = result.selectedMonth;
          this.toPeriod = result.selectedMonth;
          console.log("Current Period : ", this.CurrentPeriod);
        }
      });
  }

  getFilterValues() {
    if (this.plans != null) {
      this.premiumMinValue = Math.min.apply(Math, this.plans.map(function (o) { return o.premiumCD; }));
      this.premiumMaxValue = Math.max.apply(Math, this.plans.map(function (o) { return o.premiumCD; }));

      this.enrollmentMinValue = Math.min.apply(Math, this.plans.map(function (o) { return o.enrollment1; }));
      this.enrollmentMaxValue = Math.max.apply(Math, this.plans.map(function (o) { return o.enrollment1; }));

      this.enrollmentChangeMinValue = Math.min.apply(Math, this.plans.map(function (o) { return o.enrollment1; }));
      this.enrollmentChangeMaxValue = Math.max.apply(Math, this.plans.map(function (o) { return o.enrollment1; }));

      this.moopMinValue = Math.min.apply(Math, this.plans.map(function (o) { return o.moop }));
      this.moopMaxValue = Math.max.apply(Math, this.plans.map(function (o) { return o.moop }));

      this.bindRangeDefaultValues();
    }
  }

  getChangeInEnrollmentFilters() {
    if (this.plans != null) {
      this.premiumMinValue = Math.min.apply(Math, this.plans.map(function (o) { return o.premiumCD; }));
      this.premiumMaxValue = Math.max.apply(Math, this.plans.map(function (o) { return o.premiumCD; }));

      this.enrollmentChangeMinValue = Math.min.apply(Math, this.plans.map(function (o) { return o.enrollment1; }));
      this.enrollmentChangeMaxValue = Math.max.apply(Math, this.plans.map(function (o) { return o.enrollment1; }));


      this.moopMinValue = Math.min.apply(Math, this.plans.map(function (o) { return o.moop }));
      this.moopMaxValue = Math.max.apply(Math, this.plans.map(function (o) { return o.moop }));

      this.bindRangeDefaultValues();
    }
  }

  bindRangeDefaultValues() {
    this.premiumMinDefaultValue = this.premiumMinValue;
    this.premiumMaxDefaultValue = this.premiumMaxValue;

    this.premiumRangeValues = [this.premiumMinValue, this.premiumMaxValue];
    this.selectedPremiumMinValue = this.premiumMinValue;
    this.selectedPremiumMaxValue = this.premiumMaxValue;

    this.enrollmentMinDefaultValue = this.enrollmentMinValue;
    this.enrollmentMaxDefaultValue = this.enrollmentMaxValue;

    this.enrollmentRangeValues = [this.enrollmentMinValue, this.enrollmentMaxValue];
    this.selectedEnrollmentMinValue = this.enrollmentMinValue;
    this.selectedEnrollmentMaxValue = this.enrollmentMaxValue;


    this.enrollmentChangeMinDefaultValue = this.enrollmentChangeMinValue;
    this.enrollmentChangeMaxDefaultValue = this.enrollmentChangeMaxValue;

    this.enrollmentChangeRangeValues = [this.enrollmentChangeMinValue, this.enrollmentChangeMaxValue];
    this.selectedEnrollmentChangeMinValue = this.enrollmentChangeMinValue;
    this.selectedEnrollmentChangeMaxValue = this.enrollmentChangeMaxValue;

    this.moopMinDefaultValue = this.moopMinValue;
    this.moopMaxDefaultValue = this.moopMaxValue;

    this.moopRangeValues = [this.moopMinValue, this.moopMaxValue];
    this.selectedMoopMinValue = this.moopMinValue;
    this.selectedMoopMaxValue = this.moopMaxValue;
    this.spinner.hide();
  }

  bindRangeValues() {
    this.premiumRangeValues = [this.premiumMinValue, this.selectedPremiumMaxValue];
    this.selectedPremiumMinValue = this.premiumMinValue;
    this.selectedPremiumMaxValue = this.selectedPremiumMaxValue;

    this.moopRangeValues = [this.moopMinValue, this.selectedMoopMaxValue];
    this.selectedMoopMinValue = this.moopMinValue;
    this.selectedMoopMaxValue = this.selectedMoopMaxValue;
  }

  getCheckedBidId(plan: IPlans) {
    if (this.selectedBidIds.length > 0) {
      var checkBidId = this.selectedBidIds.includes(plan.bidId);
      if (checkBidId == true) {
        this.selectedBidIds = this.selectedBidIds.filter(item => item != plan.bidId);
      }
      else {
        this.selectedBidIds.push(plan.bidId)
      }
      this.selectedBidIds.length > 1 ? this.showCompareButton = true : this.showCompareButton = false;
    }
    else {
      if (this.selectedBidIds.length == 0) {
        this.selectedBidIds.push(plan.bidId);
      }
    }
  }

  ChangePremium(premiumValue) {
    this.selectedPremiumMinValue = premiumValue.values[0];
    this.selectedPremiumMaxValue = premiumValue.values[1];
    this.FilterAllPlans();
  }

  ChangeEnrollment(enrollmentValue) {
    this.selectedEnrollmentMinValue = enrollmentValue.values[0];
    this.selectedEnrollmentMaxValue = enrollmentValue.values[1];
    this.FilterAllPlans();
  }

  ChangeEnrollmentIn(enrollmentChangeValue) {
    this.selectedEnrollmentChangeMinValue = enrollmentChangeValue.values[0];
    this.selectedEnrollmentChangeMaxValue = enrollmentChangeValue.values[1];

    console.log(" Change Min : ", this.selectedEnrollmentChangeMinValue);
    console.log(" Change Max : ", this.selectedEnrollmentChangeMaxValue);
    this.FilterAllPlans();
  }

  ChangeMOOP(moopValue) {
    this.selectedMoopMinValue = moopValue.values[0];
    this.selectedMoopMaxValue = moopValue.values[1];
    this.FilterAllPlans();
  }

  ChangePremiumFromMinInput(newValue: string) {
    let value = + newValue.replace('$', '');
    if (value > this.selectedPremiumMaxValue) {
      this.messageService.add({ severity: 'error', summary: 'Should not > ' + this.selectedPremiumMaxValue + 'Value' });
    }
    else {
      this.premiumMinValue = + newValue.replace('$', '');
      this.bindRangeValues();
      this.FilterAllPlans();
    }
  }

  ChangePremiumFromMaxInput(newValue: string) {
    let selectedValue = + newValue.replace('$', '');
    if (selectedValue > this.premiumMaxValue) {
      this.messageService.add({ severity: 'error', summary: 'Should not > ' + this.premiumMaxValue + ' Value' });
    }
    else {
      this.selectedPremiumMaxValue = + newValue.replace('$', '');
      console.log(" Max Value : ", this.selectedPremiumMaxValue);
      this.bindRangeValues();
      this.FilterAllPlans();
    }
  }

  ChangeMoopFromMinInput(newValue: string) {
    let value = + newValue.replace('$', '');
    if (value > this.selectedMoopMaxValue) {
      this.messageService.add({ severity: 'error', summary: 'Should not > ' + this.selectedMoopMaxValue + ' Value' });
    }
    else {
      this.moopMinValue = value
      this.bindRangeValues();
      this.FilterAllPlans();
    }
  }

  ChangeMoopFromMaxInput(newValue: string) {
    let selectedValue = + newValue.replace('$', '');
    if (selectedValue > this.moopMaxValue) {
      this.messageService.add({ severity: 'error', summary: 'Should not > Max Value' });
    }
    else {
      this.selectedMoopMaxValue = + newValue.replace('$', '');
      this.bindRangeValues();
      this.FilterAllPlans();
    }
  }

  getStates() {
    this._stateService.getStates().subscribe((result: IState[]) => {
      console.log(result);
      if (result) {
        this.states = result;
      }
    });
  }

  getSalesRegion(clientId: number, stateId: number) {
    this._salesRegionService.getSalesRegions(clientId, stateId).subscribe((result) => {
      if (result != null) {
        this.selectedState = stateId;
        this.salesRegiondisabled = false;
        this.salesRegions = result;
      }
      else {
        this.salesRegiondisabled = true;
      }
    });
  }

  getCounties(state: number, salesRegionId: string) {
    console.log("Sales Region : ", salesRegionId)
    this._countyService.getCounties(state, salesRegionId, this.clientId).subscribe((result) => {
      if (result != null) {
        this.selectedSalesRegion = salesRegionId
        this.countydisable = false;
        this.counties = result;
      }
      else {
        this.countydisable = true;
      }
    });
  }

  getPlantype(county: any) {
    this._plantypeService.getPlantypes(this.selectedState, county).subscribe((result) => {
      console.log("PlanTypes : ", result)
      if (result != null) {
        this.selectedCounty = county
        this.planTypedisable = false
        this.plantypes = result
      }
      else {
        this.planTypedisable = true
      }
    })
  }

  getSnptype(plantype: string) {
    this._snptypeService.getSnptypes(this.selectedState, plantype, this.selectedCounty).subscribe((result) => {
      console.log("SnpTypes : ", result)
      if (result != null) {
        this.selectedPlantype = plantype
        this.snptypedisable = false
        this.snptypes = result
      }
      else {
        this.snptypedisable = false
      }
    });
  }

  getCrosswalk(snptype: string) {
    this._crossWalkService.getCrosswalks(this.selectedState, this.selectedPlantype, snptype, this.selectedCounty).subscribe((result) => {
      if (result != null) {
        this.selectedSnptype = snptype
        this.crossWalkdisabled = false
        this.crosswalk = result
        console.log("Crosswalks : ", this.crosswalk);
      }
    });
  }

  onStateItemSelect() {
    this.spinner.show();
    this.selectedSalesRegionItems = [];
    this.selectedCountyItems = [];
    this.selectedPlantypeItems = [];
    this.selectedSnptypesItems = [];
    this.selectedCrosswalkItems = [];
    this.clearLeftSideItems();
    this.getSalesRegionDefault(this.clientId, this.selectedStateItems[0].id);
  }

  onStateDeSelect() {
    this.clearLeftSideItems();
    this.selectedSalesRegionItems = [];
    this.selectedCountyItems = [];
    this.selectedPlantypeItems = [];
    this.selectedSnptypesItems = [];
    this.selectedCrosswalkItems = [];
  }

  onSalesRegionSelect() {
    this.clearLeftSideItems();
    this.selectedCountyItems = [];
    this.selectedPlantypeItems = [];
    this.selectedSnptypesItems = [];
    this.selectedCrosswalkItems = [];
    this.getCountiesDefault(this.selectedState, this.selectedSalesRegion);
  }

  onSalesRegionSelectAll(items: any) {
    this.clearLeftSideItems();
    this.selectedCountyItems = [];
    this.selectedPlantypeItems = [];
    this.selectedSnptypesItems = [];
    this.selectedCrosswalkItems = [];
    this.selectedSalesRegionItems = items;
    this.getCountiesDefault(this.selectedState, this.selectedSalesRegion);
  }

  onSalesRegionDeSelectAll(items: any) {
    this.clearLeftSideItems();
    this.selectedCountyItems = [];
    this.selectedPlantypeItems = [];
    this.selectedSnptypesItems = [];
    this.selectedCrosswalkItems = [];
  }

  onSalesRegionDeSelect() {
    this.clearLeftSideItems();
    this.selectedCountyItems = [];
    this.selectedPlantypeItems = [];
    this.selectedSnptypesItems = [];
    this.selectedCrosswalkItems = [];
    this.getCountiesDefault(this.selectedState, this.selectedSalesRegion);
  }

  onCountyItemSelect() {
    this.spinner.show();
    this.clearLeftSideItems();
    this.selectedPlantypeItems = [];
    this.selectedSnptypesItems = [];
    this.selectedCrosswalkItems = [];
    this.selectedCounties = [];
    for (let i = 0; i < this.selectedCountyItems.length; i++) {
      this.selectedCounties.push(this.selectedCountyItems[i].id);
    };
    this.getPlantypeDefault(this.selectedCounties);
  }

  onCountySelectAll(items: any) {
    this.spinner.show();
    this.clearLeftSideItems();
    this.selectedPlantypeItems = [];
    this.selectedSnptypesItems = [];
    this.selectedCrosswalkItems = [];
    this.selectedCountyItems = items
    this.selectedCounties = [];
    for (let i = 0; i < this.selectedCountyItems.length; i++) {
      this.selectedCounties.push(this.selectedCountyItems[i].id);
    };
    this.getPlantypeDefault(this.selectedCounties);
  }

  onCountyDeSelect() {
    this.spinner.show();
    this.clearLeftSideItems();
    this.selectedPlantypeItems = [];
    this.selectedSnptypesItems = [];
    this.selectedCrosswalkItems = [];
    this.selectedCounties = [];
    for (let i = 0; i < this.selectedCountyItems.length; i++) {
      this.selectedCounties.push(this.selectedCountyItems[i].id);
    };
    this.getPlantypeDefault(this.selectedCounties);
  }

  onCountyDeSelectAll(items: any) {
    this.clearLeftSideItems();
    this.selectedPlantypeItems = [];
    this.selectedSnptypesItems = [];
    this.selectedCrosswalkItems = [];
  }

  onPlanTypeItemSelect() {
    this.spinner.show();
    this.clearLeftSideItems();
    this.selectedSnptypesItems = [];
    this.selectedCrosswalkItems = [];
    this.selectedPlantypes = "";
    for (let i = 0; i < this.selectedPlantypeItems.length; i++) {
      this.selectedPlantypes = i == 0 ? this.selectedPlantypeItems[i].id.toString() : this.selectedPlantypes + "," + this.selectedPlantypeItems[i].id.toString();
    }
    this.getSnptypeDefault(this.selectedPlantypes);
  }

  onPlanTypeSelectAll(items: any) {
    this.spinner.show();
    this.clearLeftSideItems();
    this.selectedSnptypesItems = [];
    this.selectedCrosswalkItems = [];
    this.selectedPlantypeItems = items;
    this.selectedPlantypes = "";
    for (let i = 0; i < this.selectedPlantypeItems.length; i++) {
      this.selectedPlantypes = i == 0 ? this.selectedPlantypeItems[i].id.toString() : this.selectedPlantypes + "," + this.selectedPlantypeItems[i].id.toString();
    }
    this.selectedPlantypes == "" ? "" : this.getSnptypeDefault(this.selectedPlantypes);
  }

  onPlanTypeDeSelectAll(items: any) {
    this.clearLeftSideItems();
    this.selectedSnptypesItems = [];
    this.selectedCrosswalkItems = [];
  }

  onPlanTypeDeSelect() {
    this.spinner.show();
    this.clearLeftSideItems();
    this.selectedSnptypesItems = [];
    this.selectedCrosswalkItems = [];
    this.selectedPlantypes = "";
    for (let i = 0; i < this.selectedPlantypeItems.length; i++) {
      this.selectedPlantypes = i == 0 ? this.selectedPlantypeItems[i].id.toString() : this.selectedPlantypes + "," + this.selectedPlantypeItems[i].id.toString();
    }
    this.getSnptypeDefault(this.selectedPlantypes);
  }

  onSnptypeItemSelect() {
    this.spinner.show();
    this.clearLeftSideItems();
    this.selectedCrosswalkItems = [];
    this.selectedSnptype = "";
    for (let i = 0; i < this.selectedSnptypesItems.length; i++) {
      this.selectedPlantypes = i == 0 ? this.selectedSnptypesItems[i].id.toString() : this.selectedPlantypes + "," + this.selectedSnptypesItems[i].id.toString();
    }
    this.getCrosswalkDefault(this.selectedPlantypes);
  }

  onSnptypeSelectAll(items: any) {
    this.spinner.show();
    this.clearLeftSideItems();
    this.selectedCrosswalkItems = [];
    this.selectedSnptype = "";
    this.selectedSnptypesItems = items;
    for (let i = 0; i < this.selectedSnptypesItems.length; i++) {
      this.selectedPlantypes = i == 0 ? this.selectedSnptypesItems[i].id.toString() : this.selectedPlantypes + "," + this.selectedSnptypesItems[i].id.toString();
    }
    this.getCrosswalkDefault(this.selectedPlantypes);
  }

  onSnptypeDeSelect() {
    this.clearLeftSideItems();
    this.selectedCrosswalkItems = [];
    this.selectedSnptype = "";
    for (let i = 0; i < this.selectedSnptypesItems.length; i++) {
      this.selectedSnptype = i == 0 ? this.selectedSnptypesItems[i].id.toString() : this.selectedPlantypes + "," + this.selectedSnptypesItems[i].id.toString();
    }
    this.selectedSnptype == "" ? "" : this.getCrosswalkDefault(this.selectedSnptype);
  }

  onSnptypeDeSelectAll(items: any) {
    this.clearLeftSideItems();
    this.selectedCrosswalkItems = [];
  }

  onCrossWalkItemSelect() { this.clearLeftSideItems(); }
  onCrossWalkSelectAll(items: any) { this.clearLeftSideItems(); }
  onCrossWalkDeSelectAll(items: any) { this.clearLeftSideItems(); }
  onCrossWalkDeSelect() { this.clearLeftSideItems(); }

  OnBenefitSelect(item: string) {
    if (item != 'Select Benefit') {
      this.valuesFromPython = [];
      this.selectedBenifit = item;
      if (this.showPlanCompare) {
        this.spinner.show();
        this.plansBenefits = [];
        this.plansBenifitsList = [];
        this.cols = [];

        let premium: string = '0';
        let tpv: string = '0';
        let oopc: string = '0';
        let enrollmentGrowth: string = '0';

        this.selectedBenifit == "Premium" ? premium = "1" : premium = "0";
        this.selectedBenifit == "TPV" ? tpv = "1" : tpv = "0";
        this.selectedBenifit == "OOPC" ? oopc = "1" : oopc = "0";
        this.selectedBenifit == "Enrollment Growth" ? enrollmentGrowth = "1" : enrollmentGrowth = "0";

        this.basePlan = this.basePlan == '' ? 'Base' : this.basePlan;

        let comparePlansSort: IComparePlansWithOrder = {
          basePlan: this.basePlan,
          comparePlan: this.selectedBidIds.toString(),
          premium: premium,
          tpv: tpv,
          OOPC: oopc,
          enrollmentGrowth: enrollmentGrowth
        }

        console.log("Compare Plans Sort : ", comparePlansSort);

        this._comparePlansService.getComparePlanBenefitInSortOrderDetails(comparePlansSort)
          .subscribe((result: any[]) => {
            if (result.length > 0) {
              this.plansBenefits = result;
              console.log("Plan Benifits Count : ", this.plansBenefits.length);
              console.log("Plan Benifits : ", this.plansBenefits);
              this.getColumns(this.plansBenefits);
            }
          }, err => {
            console.log('HTTP Error', err);
            this.spinner.hide();
          });
      }
      else {
        if (this.selectedBenifit == "Premium") {
          this.plans = this.plans.sort((a, b) => { return a.premiumCD > b.premiumCD ? 1 : -1 });
          console.log("Plans After Premium : ", this.plans);
        }

        if (this.selectedBenifit == "TPV") {
          this.plans = this.plans.sort((a, b) => { return b.tpv > a.tpv ? 1 : -1 });
        }

        if (this.selectedBenifit == "OOPC") {
          this.plans = this.plans.sort((a, b) => { return a.oopc - b.oopc });
        }

        if (this.selectedBenifit == "Enrollment Growth") {
          this.plans = this.plans.sort((a, b) => { return b.enrollment > a.enrollment ? 1 : -1 });
         
        }
      }
    }
  }

  OnEnrollmentFromPeriodChange(fromPeriod: string) {
    this.selectedEnrollmentFromPeriod = fromPeriod;
    this.selectedEnrollmentToPeriod = this.toPeriod;

    this._plansService.getPlansBetweenPeriods(this.selectedState, this.selectedCounty, this.selectedPlantype, this.selectedSnptype, this.selectedCrosswalk, this.selectedEnrollmentFromPeriod, this.selectedEnrollmentToPeriod)
      .subscribe((result: IPlans[]) => {
        if (result.length > 0) {
          this.plans = result;
          this.copyOfPlans = result;
          console.log("Plans Count : ", this.plans.length);
          this.isEnrollmentSelected = 2;
          this.getChangeInEnrollmentFilters();
          this.FilterAllPlans();
        }
      });
  }

  OnEnrollmentToPeriodChange(toPeriod: string) {
    this.selectedEnrollmentToPeriod = toPeriod;
    this.selectedEnrollmentFromPeriod = this.fromPeriod;

    this._plansService.getPlansBetweenPeriods(this.selectedState, this.selectedCounty, this.selectedPlantype, this.selectedSnptype, this.selectedCrosswalk, this.selectedEnrollmentFromPeriod, this.selectedEnrollmentToPeriod)
      .subscribe((result: IPlans[]) => {
        if (result.length > 0) {
          this.plans = result;
          this.copyOfPlans = result;
          console.log("Plans Count : ", this.plans.length);
          this.isEnrollmentSelected = 2;
          this.getChangeInEnrollmentFilters();
          this.FilterAllPlans();
        }
      });
  }

  OnEnrollmentPeriodChange(period: string) {
    this.CurrentPeriod = period;
    this._plansService.getPlansByPeriod(this.selectedState, this.selectedCounty, this.selectedPlantype, this.selectedSnptype, this.selectedCrosswalk, this.CurrentPeriod)
      .subscribe((result: IPlans[]) => {
        if (result.length > 0) {
          this.plans = result;
          this.copyOfPlans = result;
          console.log("Plans Count : ", this.plans.length);
          this.isEnrollmentSelected = 1;
          this.getFilterValues();
          this.FilterAllPlans();
        }
      });
  }

  OnPartDChange() {
    this.FilterAllPlans();
  }

  OnPartBChange() {
    this.FilterAllPlans();
  }

  OnPlanCoverageChange() {
    this.FilterAllPlans();
  }

  OnHealthDedictibleChange() {
    this.FilterAllPlans();
  }

  OnDrugDeductibleChange() {
    this.FilterAllPlans();
  }

  OnAmbulanceChange() {
    this.FilterAllPlans();
  }

  OnComprehensiveDentalChange() {
    this.FilterAllPlans();
  }

  OnChiroPractorChange() {
    this.FilterAllPlans();
  }

  OnMealChange() {
    this.FilterAllPlans();
  }

  OnFitnessChange() {
    this.FilterAllPlans();
  }

  OnOTCChange() {
    this.FilterAllPlans();
  }

  OnVisionChange() {
    this.FilterAllPlans();
  }

  OnHearingChange() {
    this.FilterAllPlans();
  }

  OnEmergencyChange() {
    this.FilterAllPlans();
  }

  OnTeleHealthChange() {
    this.FilterAllPlans();
  }

  OnHomeSupport() {
    this.FilterAllPlans();
  }

  OnHomeSafetyChange() {
    this.FilterAllPlans();
  }

  OnPersChange() {
    this.FilterAllPlans();
  }

  FilterAllPlans() {
    let partD = this.isPremiumChecked == true ? 0 : -1;
    let partB = this.isPartBChecked == true ? 0 : -1;
    let planCoverage = this.isPlanCoverageChecked == true ? 'MA' : 'Test';
    let healthDeductible = this.isHealthDeductibleChecked == true ? 0 : -1;
    let drugDeductible = this.isDrugDedictibleChecked == true ? 0 : -1;
    let ambulance = this.isAmbulanceChecked == true ? '00' : '-1';
    let compDental = this.isComphrehensiveDentalChecked == true ? '0000000' : '-1';
    let Fitness = this.isFitnessChecked == true ? '-' : '-1';
    let vision = this.isVisionChecked == true ? '00' : '-1';
    let hearing = this.isHearingChecked == true ? '00' : '-1';
    let emergency = this.isEmergencyChecked == true ? '000' : '-1';
    let teleHealth = this.isTeleHealthChecked == true ? '-' : '-1';
    let homeSupport = this.isHomeSupportChecked == true ? '-' : '-1';
    let homeSaftey = this.isHomeSafteyChecked == true ? '-' : '-1';
    let pers = this.isPersChecked == true ? '-' : '-1';

    let plans1 = [...this.copyOfPlans];

    if (this.isPremiumChecked == true) {
      this.plans = plans1.filter(x => x.premiumCD == x.partD && x.partD != partD && x.partBGiveBack != partB && x.planCoverage != planCoverage &&
        x.healthDeductible != healthDeductible && x.anualDrugDeductible != drugDeductible && x.premiumCD >= this.selectedPremiumMinValue &&
        x.premiumCD <= this.selectedPremiumMaxValue && x.moop >= this.selectedMoopMinValue && x.moop <= this.selectedMoopMaxValue && !x.sbAmbulance.includes(ambulance) && !x.sbCompDental.includes(compDental) &&
        !x.sbFitness.includes(Fitness) && x.sbHearing != hearing && x.sbVision != vision && x.sbWorldWideEmergency != emergency && x.sbTeleHealth != teleHealth && x.sbHomeSaftey != homeSaftey &&
        x.sbHomeSupport != homeSupport && x.sbPers != pers);

      if (this.isEnrollmentSelected == 2) {
        this.plans = this.plans.filter(x => x.enrollment1 >= this.selectedEnrollmentChangeMinValue && x.enrollment1 <= this.selectedEnrollmentChangeMaxValue);
      }
      else {
        this.plans = this.plans.filter(x => x.enrollment1 >= this.selectedEnrollmentMinValue && x.enrollment1 <= this.selectedEnrollmentMaxValue);
      }

      this.plans = this.plans.filter(x => x.enrollment1 >= this.selectedEnrollmentChangeMinValue && x.enrollment1 <= this.selectedEnrollmentChangeMaxValue);
      this.plans = this.plans.filter(x => this.isMealChecked == true ? x.sbMeal == 1 : x.sbMeal != -1);
      this.plans = this.plans.filter(x => this.isChiropractorChecked == true ? x.sbChiropractor == 1 : x.sbChiropractor != -1)
      this.plans = this.plans.filter(x => this.isOTCChecked == true ? x.sbOTC == 1 : x.sbOTC != -1);
    }
    else {
      this.plans = plans1.filter(x => x.partBGiveBack != partB && x.planCoverage != planCoverage && x.healthDeductible != healthDeductible &&
        x.anualDrugDeductible != drugDeductible && x.premiumCD >= this.selectedPremiumMinValue && x.premiumCD <= this.selectedPremiumMaxValue &&
        x.moop >= this.selectedMoopMinValue && x.moop <= this.selectedMoopMaxValue && !x.sbAmbulance.includes(ambulance) && !x.sbCompDental.includes(compDental) && !x.sbFitness.includes(Fitness) &&
        x.sbHearing != hearing && x.sbVision != vision && x.sbWorldWideEmergency != emergency && x.sbTeleHealth != teleHealth && x.sbHomeSaftey != homeSaftey &&
        x.sbHomeSupport != homeSupport && x.sbPers != pers
      );

      if (this.isEnrollmentSelected == 2) {
        this.plans = this.plans.filter(x => x.enrollment1 >= this.selectedEnrollmentChangeMinValue && x.enrollment1 <= this.selectedEnrollmentChangeMaxValue);
      }
      else {
        this.plans = this.plans.filter(x => x.enrollment1 >= this.selectedEnrollmentMinValue && x.enrollment1 <= this.selectedEnrollmentMaxValue);
      }

      this.plans = this.plans.filter(x => x.enrollment >= this.selectedEnrollmentChangeMinValue && x.enrollment <= this.selectedEnrollmentChangeMaxValue);
      this.plans = this.plans.filter(x => this.isMealChecked == true ? x.sbMeal == 1 : x.sbMeal != -1);
      this.plans = this.plans.filter(x => this.isChiropractorChecked == true ? x.sbChiropractor == 1 : x.sbChiropractor != -1)
      this.plans = this.plans.filter(x => this.isOTCChecked == true ? x.sbOTC == 1 : x.sbOTC != -1);

      if (this.selectedBenifit == "Premium") {
        this.plans = this.plans.sort((a, b) => { return a.premiumCD - b.premiumCD });
      }

      if (this.selectedBenifit == "TPV") {
        this.plans = this.plans.sort((a, b) => { return b.tpv > a.tpv ? 1 : -1 });
      }

      if (this.selectedBenifit == "OOPC") {
        this.plans = this.plans.sort((a, b) => { return a.oopc - b.oopc });
      }
      if (this.selectedBenifit == "Enrollment Growth") {
        this.plans = this.plans.sort((a, b) => { return b.enrollment > a.enrollment ? 1 : -1 });
      }
    }

    if (this.selectedBidIds.length > 0) {
      let bidIds = [...this.selectedBidIds];
      bidIds.forEach(element => {
        var res = this.plans.filter(x => x.bidId == element);
        if (res.length <= 0) {
          const index = this.selectedBidIds.indexOf(element, 0);
          if (index > -1) { this.selectedBidIds.splice(index, 1); }
        }
      });
    }

    this.showCompareButton = this.selectedBidIds.length >= 2 ? true : false;

    console.log("Count of plans after Filters : ", this.plans.length);
  }

  dropdownsettings() {
    this.stateDropdownSettings = {
      singleSelection: true,
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

  handleClick(items: any) {
    console.log("Selected Column : ", items);
  }

  onBasePlanSelect(selectedPlan: string) {
    this.spinner.show();
    this.closeColorModal.nativeElement.click()
    let compareBidIds1 = [...this.selectedBidIds]
    let comparePlans = compareBidIds1.toString();

    if (this.isColorCodeSelected == false) {
      this.isColorCodeSelected = true;
    }

    this.basePlan = selectedPlan;
    this.valuesFromPython = null;
    this.getCompareBasePlanS(this.basePlan, comparePlans);
  }

  getCompareBasePlanS(basePlan: string, comparePlans: string) {
    console.log(" In CompareBase Plan :");
    let compareWithBasePlan: ICompareWithBasePlans = {
      basePlan: basePlan,
      comparePlan: comparePlans
    }

    this._comparePlansService.getComparePlanCompactBenefitDetails(compareWithBasePlan)
      .subscribe((result: any[]) => {
        console.log("Result in getCompareBasePlans :", result);
        if (result.length > 0) {
          this.plansBenefits = [];
          this.plansBenifitsList = [];
          this.cols = [];
          this.plansBenefits = result;
          this.getColumns(this.plansBenefits);
          this.runscript(basePlan, comparePlans, this.userId);
        }
      }, err => {
        console.log('HTTP Error', err);
        this.spinner.hide();
      });
  }

  runscript(basePlan: string, compareBidIds: string, userId: string) {
    this._comparePlansService.runPythonScript(basePlan, compareBidIds, userId).subscribe((result: string) => {
      console.log("Result From Script : ", result);
      if (result) {
        this.getValuesfromJsonReturnByPython(result);
      }
    });
  }

  getValuesfromJsonReturnByPython(userId: string) {
    this._comparePlansService.readDataFromJson(userId).subscribe((result: any[]) => {
      if (result) {
        this.valuesFromPython = result;
        console.log(" Python : ", this.valuesFromPython);
      }
    })
    this.spinner.hide();
  }

  applyColors(count, year, columnValue, headerValue) {
    if (year == this.previousBenifitYears) {
      return;
    }

    if (this.valuesFromPython && this.valuesFromPython.length) {
      if (this.valuesFromPython.length > 0) {
        if (count == 1) {
          this.singleValueFromArray = this.valuesFromPython.filter(x => x.Benefit.trim() == columnValue.trim());
        }
      }
    }

    if (headerValue != 'benefits') {
      let headerBidId = headerValue.substring(headerValue.lastIndexOf("(") + 1, headerValue.length - 1);
      if (this.valuesFromPython && this.valuesFromPython.length) {
        if (this.valuesFromPython.length > 0) {
          if (this.singleValueFromArray && this.singleValueFromArray.length) {
            let val = this.singleValueFromArray[0][headerBidId];
            let color = val == 1 ? "red" : (val == 2 ? "green" : (val == 4 ? "gray" : "transparent"));
            return color;
          }
        }
      }
    }
  }

  ToggleYear(header) {
    let color = header = "year " ? "disable" : "null";
    return color;
  }

  getYOY() {
    this.spinner.show();
    this.isYOYSelected = !this.isYOYSelected;
    this.previousBenifitYear = this.previousBenifitYear > this.currentBenifitYear ? this.previousBenifitYear - 2 : this.previousBenifitYear + 2;
    this.updateRowGroupMetaData();
  }

  saveUserInputs(event) {
    if (this.scenarioAlreadyExists == "Scenario Name Alredy Exist") { return; }
    let elementId: string = (event.target as Element).id;
    let selectedModal = elementId == "btnSaveScenario" ? 1 : 2;
    let ScenarioValue = selectedModal == 1 ? this.SaveScenarioName : this.scenarioName;
    if (ScenarioValue == "") { return; }
    let userInputData: IUserInputs = {
      Scenario: ScenarioValue,
      stateId: this.selectedState,
      SalesRegionId: this.selectedSalesRegion,
      CountyId: this.selectedCounties,
      PlanTypeId: this.selectedPlantype,
      SnpTypeId: this.selectedSnptype,
      CrossWalkId: this.selectedCrosswalk,
      bidId: this.selectedBidIds.toString(),
      PremiumMin: this.selectedPremiumMinValue,
      PremiumMax: this.selectedPremiumMaxValue,
      IsPartDPremium: this.isPremiumChecked,
      IsPartBGiveBack: this.isPartBChecked,
      IsPlanCoverage: this.isPlanCoverageChecked,
      EnrollmentMonth: this.CurrentPeriod,
      EnrollmentFromMonth: this.selectedEnrollmentFromPeriod == null ? this.CurrentPeriod : this.selectedEnrollmentFromPeriod,
      EnrollmentToMonth: this.selectedEnrollmentToPeriod == null ? this.CurrentPeriod : this.selectedEnrollmentToPeriod,
      EnrollmentMin: this.selectedEnrollmentMinValue,
      EnrollmentMax: this.selectedEnrollmentMaxValue,
      EnrollmentChangeMin: this.selectedEnrollmentChangeMinValue,
      EnrollmentChangeMax: this.selectedEnrollmentChangeMaxValue,
      IsHealthDeductible: this.isHealthDeductibleChecked,
      isDrugDeductible: this.isDrugDedictibleChecked,
      MoopMin: this.selectedMoopMinValue,
      MoopMax: this.selectedMoopMaxValue,
      isAmbulance: this.isAmbulanceChecked,
      isComprehensiveDental: this.isComphrehensiveDentalChecked,
      isChiropractor: this.isChiropractorChecked,
      isMeal: this.isMealChecked,
      isFitness: this.isFitnessChecked,
      isOTC: this.isOTCChecked,
      isVision: this.isVisionChecked,
      isHearing: this.isHearingChecked,
      isEmergency: this.isEmergencyChecked,
      isTeleHealth: this.isTeleHealthChecked,
      ishomeSupport: this.isHomeSupportChecked,
      isHomeSaftey: this.isHomeSafteyChecked,
      isPers: this.isPersChecked,
      UserId: this.userId,
      IsEnrollmentSelected: this.isEnrollmentSelected,
      isSortBy: this.selectedBenifit
    }

    this._userInputService.addUserInputs(userInputData).subscribe((res: IApiResponse) => {
      if (res.success) {
        selectedModal == 1 ? this.closeModal.nativeElement.click() : this.closeSaveAsModal.nativeElement.click();
        selectedModal == 1 ? this.SaveScenarioName = "" : this.scenarioName = "";
        this.messageService.add({ severity: 'success', summary: 'Saved successfully' });
        this.bindScenarioNames();
      }
      else {
        selectedModal == 1 ? this.closeModal.nativeElement.click() : this.closeSaveAsModal.nativeElement.click();
        selectedModal == 1 ? this.SaveScenarioName = "" : this.scenarioName = "";
        this.messageService.add({ severity: 'error', summary: res.error });
      }
    })
  }

  updateRowGroupMetaData() {
    this.rowGroupMetadata = {};
    if (this.plansBenefits) {
      for (let i = 0; i < this.plansBenefits.length; i++) {
        let rowData = this.plansBenefits[i];
        let brand = rowData.sortGroup;
        let year = rowData.year;
        if (i == 0) {
          this.rowGroupMetadata[brand] = { index: 0, size: 1 };
        }
        else {
          if (year != this.previousBenifitYears) {
            let previousRowData = this.plansBenefits[i - 1];
            let previousRowGroup = previousRowData.sortGroup;
            if (brand === previousRowGroup) {
              this.rowGroupMetadata[brand].size++;
            }
            else {
              this.rowGroupMetadata[brand] = { index: i, size: 1 };
            }
          }
          else {
            if (this.isYOYSelected) {
              let previousRowData = this.plansBenefits[i - 1];
              let previousRowGroup = previousRowData.sortGroup;
              if (brand == 'Plan Information' && year != this.previousBenifitYear) {
              }
              else if (brand === previousRowGroup) {
                this.rowGroupMetadata[brand].size++;
              }
              else {
                this.rowGroupMetadata[brand] = { index: i, size: 1 };
              }
            }
          }
        }
      }
    }
    this.spinner.hide();
  }

  onSort() {
    this.updateRowGroupMetaData();
  }

  renameKey(obj, oldKey, newKey) {
    obj[newKey] = obj[oldKey];
    delete obj[oldKey];
  }

  exportExcel() {
    if (this.plansBenefits != null) {
      let plansBenefitCopy = this.isYOYSelected == true ? this.plansBenefits : this.plansBenefits.filter(x => x.year == this.CurrentPeriod);
      import("xlsx").then(xlsx => {
        const worksheet = xlsx.utils.json_to_sheet(plansBenefitCopy);
        const workbook = { Sheets: { 'Benefits': worksheet }, SheetNames: ['Benefits'] };
        const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, "BenefitsFile");
      });
    }
    else {
      this.messageService.add({ severity: 'error', summary: 'Benefits is null' });
    }
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    import("file-saver").then(FileSaver => {
      let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      let EXCEL_EXTENSION = '.xlsx';
      const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
      });
      FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    });
  }

  OnScenarioSelect(id: number) {
    console.log(" Selected Scenario Id : ", id);
    this._scenarioService.getScenarioResultsById(id).subscribe((result) => {
      if (result != null) {
        this.spinner.show();
        this.closeOpenModal.nativeElement.click();
        console.log(" State Id : ", result[0].stateId);
        this.userSelectedScenarioResults = result;
        console.log(" Sce Result : ", this.userSelectedScenarioResults);
        let planTypes = result[0].planTypeId.split(",");
        let snpTypes = result[0].snpTypeId.split(",");
        let crossWalks = result[0].crossWalkId.split(",");
        this.loadStateValues(result[0].stateId, result[0].salesRegionId, result[0].countyId, planTypes, snpTypes, crossWalks);
      }
    });
  }

  loadStateValues(id: number, salesRegionId: string, countyId: string, planTypes: [], snpTypes: string[], crossWalks: string[]) {
    this._stateService.getStates().subscribe((result: IState[]) => {
      console.log(result);
      if (result) {
        this.states = result;
        this.selectedStateItems = [{ id: result[id - 1].id, state: result[id - 1].state }];
        this.loadSalesRegionValues(this.clientId, result[id - 1].id, salesRegionId, countyId, planTypes, snpTypes, crossWalks);
      }
    });
  }

  loadSalesRegionValues(clientId: number, stateId: number, salesRegionId: string, countyId: string, planTypes: [], snpTypes: string[], crossWalks: string[]) {
    this._salesRegionService.getSalesRegions(clientId, stateId).subscribe((result) => {
      if (result != null) {
        this.selectedState = stateId;
        this.salesRegions = result;
        var userSelectedItems = salesRegionId.split(",");
        result.forEach(element => {
          if (userSelectedItems.includes(element.id.toString())) {
            this.selectedSalesRegionItems = [{ id: element.id, region: element.region }];
          }
        });
        for (let i = 0; i < result.length; i++) {
          this.selectedSalesRegion = i == 0 ? result[i].id.toString() : this.selectedSalesRegion + "," + result[i].id.toString();
        }
        this.loadCountiesValues(this.selectedState, this.selectedSalesRegion, countyId, planTypes, snpTypes, crossWalks);
      }
    });
  }

  loadCountiesValues(state: number, salesRegionId: string, countyId: string, planTypes: [], snpTypes: string[], crossWalks: string[]) {
    this.selectedCountyItems = [];
    this._countyService.getCounties(state, salesRegionId, this.clientId).subscribe((result) => {
      if (result != null) {
        this.selectedSalesRegion = salesRegionId;
        this.counties = result;
        this.selectedCounties = [];
        var userSelectedCounties = countyId.split(",");
        let userSelectedCountyItems = [];
        result.forEach(element => {
          if (userSelectedCounties.includes(element.id.toString())) {
            this.selectedCounties.push(element.id);
            userSelectedCountyItems.push({ id: element.id, counties: element.counties });
          }
        });
        this.selectedCountyItems = userSelectedCountyItems;
        this.loadPlantypeValues(this.selectedCounties, planTypes, snpTypes, crossWalks);
      }
    });
  }

  loadPlantypeValues(county: any, userPlanTypes: string[], snpTypes: string[], crossWalks: string[]) {
    this.selectedPlantypeItems = [];
    this._plantypeService.getPlantypes(this.selectedState, county).subscribe((result) => {
      if (result != null) {
        this.selectedCounty = county;
        this.plantypes = result;
        console.log("Result Plan Types : ", result);
        let userSelectedPlanTypeItems = [];
        result.forEach(element => {
          if (userPlanTypes.includes(element.id.toString())) {
            userSelectedPlanTypeItems.push({ id: element.id, plantype: element.plantype });
          }
        });
        for (let i = 0; i < result.length; i++) {
          this.selectedPlantypes = i == 0 ? result[i].id.toString() : this.selectedPlantypes + "," + result[i].id.toString();
        }
        this.selectedPlantypeItems = userSelectedPlanTypeItems;
        this.loadSnptypevalues(this.selectedPlantypes, snpTypes, crossWalks);
      }
    });
  }

  loadSnptypevalues(plantype: string, userSnpTypes: string[], crossWalks: string[]) {
    this.selectedSnptypesItems = [];
    this._snptypeService.getSnptypes(this.selectedState, plantype, this.selectedCounty).subscribe((result) => {
      if (result != null) {
        this.selectedPlantype = plantype;
        this.snptypes = result;
        console.log("Result Snp Types : ", result);
        let userSelectedSnpTypeItems = [];
        result.forEach(element => {
          if (userSnpTypes.includes(element.id.toString())) {
            userSelectedSnpTypeItems.push({ id: element.id, snpType: element.snpType });
          }
        });
        for (let i = 0; i < result.length; i++) {
          this.selectedSnptype = i == 0 ? result[i].id.toString() : this.selectedSnptype + "," + result[i].id.toString();
        }
        this.selectedSnptypesItems = userSelectedSnpTypeItems;
        this.loadCrosswalkValues(this.selectedSnptype, crossWalks);
      }
    });
  }

  loadCrosswalkValues(snptype: string, userCrossWalks: string[]) {
    this.selectedCrosswalkItems = [];
    this._crossWalkService.getCrosswalks(this.selectedState, this.selectedPlantype, snptype, this.selectedCounty).subscribe((result) => {
      if (result != null) {
        this.selectedSnptype = snptype
        this.crosswalk = result
        let userSelectedCrossWalkItems = [];
        result.forEach(element => {
          if (userCrossWalks.includes(element.id.toString())) {
            userSelectedCrossWalkItems.push({ id: element.id, crosswalk: element.crosswalk });
          }
        });
        for (let index = 0; index < this.selectedCrosswalkItems.length; index++) {
          this.selectedCrosswalk = index == 0 ? this.selectedCrosswalkItems[index].id : this.selectedCrosswalk + "," + this.selectedCrosswalkItems[index].id;
        }
        this.selectedCrosswalkItems = userSelectedCrossWalkItems;
        this.checkForLoadAllPlans();
      }
    });
  }

  checkForLoadAllPlans() {
    this.CurrentPeriod = this.userSelectedScenarioResults[0].enrollmentMonth;
    this.fromPeriod = this.userSelectedScenarioResults[0].enrollmentFromMonth;
    this.toPeriod = this.userSelectedScenarioResults[0].enrollmentToMonth;

    this.isEnrollmentSelected = this.userSelectedScenarioResults[0].isEnrollmentSelected;
    this.isEnrollmentSelected == 0 ? this.loadAllPlans() : (this.isEnrollmentSelected == 1 ? this.loadPlansBasedOnEnrollmentMonth() : this.loadPlansBasedOnEnrollmentRange());
  }

  loadAllPlans() {
    this._plansService.getPlans(this.selectedState, this.selectedCounty, this.selectedPlantype, this.selectedSnptype, this.selectedCrosswalk)
      .subscribe((result: IPlans[]) => {
        if (result.length > 0) {
          this.plans = result;
          this.copyOfPlans = result;
          console.log(" Plans Result : ", this.plans);
          console.log("Plans Count : ", this.plans.length);
          this.loadDefaultRangeValues();
          this.loadLeftFilterValues();
          this.loadBidIds();
        }
      });
  }

  loadPlansBasedOnEnrollmentMonth() {
    this._plansService.getPlansByPeriod(this.selectedState, this.selectedCounty, this.selectedPlantype, this.selectedSnptype, this.selectedCrosswalk, this.CurrentPeriod)
      .subscribe((result: IPlans[]) => {
        if (result.length > 0) {
          this.plans = result;
          this.copyOfPlans = result;
          console.log("Plans Count : ", this.plans.length);
          this.isEnrollmentSelected = 1;
          this.loadDefaultRangeValues();
          this.loadLeftFilterValues();
          this.loadBidIds();
        }
      });
  }

  loadPlansBasedOnEnrollmentRange() {
    this.selectedEnrollmentFromPeriod = this.fromPeriod;
    this.selectedEnrollmentToPeriod = this.toPeriod;

    this._plansService.getPlansBetweenPeriods(this.selectedState, this.selectedCounty, this.selectedPlantype, this.selectedSnptype, this.selectedCrosswalk,
      this.selectedEnrollmentFromPeriod, this.selectedEnrollmentToPeriod)
      .subscribe((result: IPlans[]) => {
        if (result.length > 0) {
          this.plans = result;
          this.copyOfPlans = result;
          console.log("Plans Count : ", this.plans.length);
          this.isEnrollmentSelected = 2;
          this.loadDefaultRangeValues();
          this.loadLeftFilterValues();
          this.loadBidIds();
        }
      });
  }

  loadDefaultRangeValues() {
    if (this.plans != null) {
      this.premiumMinValue = Math.min.apply(Math, this.plans.map(function (o) { return o.premiumCD; }));
      this.premiumMaxValue = Math.max.apply(Math, this.plans.map(function (o) { return o.premiumCD; }));

      this.enrollmentMinValue = Math.min.apply(Math, this.plans.map(function (o) { return o.enrollment; }));
      this.enrollmentMaxValue = Math.max.apply(Math, this.plans.map(function (o) { return o.enrollment; }));

      this.enrollmentChangeMinValue = Math.min.apply(Math, this.plans.map(function (o) { return o.enrollment; }));
      this.enrollmentChangeMaxValue = Math.max.apply(Math, this.plans.map(function (o) { return o.enrollment; }));

      this.moopMinValue = Math.min.apply(Math, this.plans.map(function (o) { return o.moop }));
      this.moopMaxValue = Math.max.apply(Math, this.plans.map(function (o) { return o.moop }));

      this.loadRangeValues();
    }
  }

  loadRangeValues() {
    this.premiumMinDefaultValue = this.premiumMinValue;
    this.premiumMaxDefaultValue = this.premiumMaxValue;
    this.enrollmentMinDefaultValue = this.enrollmentMinValue;
    this.enrollmentMaxDefaultValue = this.enrollmentMaxValue;
    this.enrollmentChangeMinDefaultValue = this.enrollmentChangeMinValue;
    this.enrollmentChangeMaxDefaultValue = this.enrollmentChangeMaxValue;

    let pMinValue = this.userSelectedScenarioResults[0].premiumMin;
    let pMaxValue = this.userSelectedScenarioResults[0].premiumMax;
    let eMinValue = this.userSelectedScenarioResults[0].enrollmentMin;
    let eMaxValue = this.userSelectedScenarioResults[0].enrollmentMax;
    let eChangeMinValue = this.userSelectedScenarioResults[0].enrollmentChangeMin;
    let eChangeMaxValue = this.userSelectedScenarioResults[0].enrollmentChangeMax;
    let mMinValue = this.userSelectedScenarioResults[0].moopMin;
    let mMaxValue = this.userSelectedScenarioResults[0].moopMax;

    this.premiumRangeValues = [pMinValue, pMaxValue];
    this.selectedPremiumMinValue = pMinValue;
    this.selectedPremiumMaxValue = pMaxValue;

    this.enrollmentRangeValues = [eMinValue, eMaxValue];
    this.selectedEnrollmentMinValue = eMinValue;
    this.selectedEnrollmentMaxValue = eMaxValue;

    this.enrollmentChangeRangeValues = [eChangeMinValue, eChangeMaxValue];
    this.selectedEnrollmentChangeMinValue = eChangeMinValue;
    this.selectedEnrollmentChangeMaxValue = eChangeMaxValue;

    this.moopRangeValues = [mMinValue, mMaxValue];
    this.selectedMoopMinValue = mMinValue;
    this.selectedMoopMaxValue = mMaxValue;
  }

  loadLeftFilterValues() {
    if (this.userSelectedScenarioResults != null) {
      this.isPremiumChecked = this.userSelectedScenarioResults[0].isPartDPremium;
      this.isPartBChecked = this.userSelectedScenarioResults[0].isPartBGiveBack;
      this.isPlanCoverageChecked = this.userSelectedScenarioResults[0].isPlanCoverage;
      this.isHealthDeductibleChecked = this.userSelectedScenarioResults[0].isHealthDeductible;
      this.isDrugDedictibleChecked = this.userSelectedScenarioResults[0].isDrugDeductible;
      this.isAmbulanceChecked = this.userSelectedScenarioResults[0].isAmbulance;
      this.isComphrehensiveDentalChecked = this.userSelectedScenarioResults[0].isComprehensiveDental;
      this.isChiropractorChecked = this.userSelectedScenarioResults[0].isChiropractor;
      this.isMealChecked = this.userSelectedScenarioResults[0].isMeal;
      this.isFitnessChecked = this.userSelectedScenarioResults[0].isFitness;
      this.isOTCChecked = this.userSelectedScenarioResults[0].isOTC;
      this.isVisionChecked = this.userSelectedScenarioResults[0].isVision;
      this.isHearingChecked = this.userSelectedScenarioResults[0].isHearing;
      this.isEmergencyChecked = this.userSelectedScenarioResults[0].isEmergency;
      this.isTeleHealthChecked = this.userSelectedScenarioResults[0].isTeleHealth;
      this.isHomeSupportChecked = this.userSelectedScenarioResults[0].ishomeSupport;
      this.isHomeSafteyChecked = this.userSelectedScenarioResults[0].isHomeSaftey;
      this.isPersChecked = this.userSelectedScenarioResults[0].isPers;
      this.selectedBenifit = this.userSelectedScenarioResults[0].isSortBy;
      this.loadFilterPlanValues();
    }
  }

  loadFilterPlanValues() {
    let partD = this.isPremiumChecked == true ? 0 : -1;
    let partB = this.isPartBChecked == true ? 0 : -1;
    let planCoverage = this.isPlanCoverageChecked == true ? 'MA' : 'Test';
    let healthDeductible = this.isHealthDeductibleChecked == true ? 0 : -1;
    let drugDeductible = this.isDrugDedictibleChecked == true ? 0 : -1;
    let ambulance = this.isAmbulanceChecked == true ? '00' : '-1';
    let compDental = this.isComphrehensiveDentalChecked == true ? '0000000' : '-1';
    let Fitness = this.isFitnessChecked == true ? '-' : '-1';
    let vision = this.isVisionChecked == true ? '00' : '-1';
    let hearing = this.isHearingChecked == true ? '00' : '-1';
    let emergency = this.isEmergencyChecked == true ? '000' : '-1';
    let teleHealth = this.isTeleHealthChecked == true ? '-' : '-1';
    let homeSupport = this.isHomeSupportChecked == true ? '-' : '-1';
    let homeSaftey = this.isHomeSafteyChecked == true ? '-' : '-1';
    let pers = this.isPersChecked == true ? '-' : '-1';

    let plans1 = [...this.copyOfPlans];

    if (this.isPremiumChecked == true) {

      console.log("Count of plans after Filters : ", this.plans.length);

      this.plans = plans1.filter(x => x.premiumCD == x.partD && x.partD != partD && x.partBGiveBack != partB && x.planCoverage != planCoverage &&
        x.healthDeductible != healthDeductible && x.anualDrugDeductible != drugDeductible && x.premiumCD >= this.selectedPremiumMinValue &&
        x.premiumCD <= this.selectedPremiumMaxValue && x.moop >= this.selectedMoopMinValue && x.moop <= this.selectedMoopMaxValue && !x.sbAmbulance.includes(ambulance) && !x.sbCompDental.includes(compDental) &&
        !x.sbFitness.includes(Fitness) && x.sbHearing != hearing && x.sbVision != vision && x.sbWorldWideEmergency != emergency && x.sbTeleHealth != teleHealth && x.sbHomeSaftey != homeSaftey &&
        x.sbHomeSupport != homeSupport && x.sbPers != pers);

      if (this.isEnrollmentSelected == 2) {
        this.plans = this.plans.filter(x => x.enrollment1 >= this.selectedEnrollmentChangeMinValue && x.enrollment1 <= this.selectedEnrollmentChangeMaxValue);
      }
      else {
        this.plans = this.plans.filter(x => x.enrollment1 >= this.selectedEnrollmentMinValue && x.enrollment1 <= this.selectedEnrollmentMaxValue);
      }

      this.plans = this.plans.filter(x => x.enrollment1 >= this.selectedEnrollmentChangeMinValue && x.enrollment1 <= this.selectedEnrollmentChangeMaxValue);
      this.plans = this.plans.filter(x => this.isMealChecked == true ? x.sbMeal == 1 : x.sbMeal != -1);
      this.plans = this.plans.filter(x => this.isChiropractorChecked == true ? x.sbChiropractor == 1 : x.sbChiropractor != -1)
      this.plans = this.plans.filter(x => this.isOTCChecked == true ? x.sbOTC == 1 : x.sbOTC != -1);
    }
    else {
      this.plans = plans1.filter(x => x.partBGiveBack != partB && x.planCoverage != planCoverage && x.healthDeductible != healthDeductible &&
        x.anualDrugDeductible != drugDeductible && x.premiumCD >= this.selectedPremiumMinValue && x.premiumCD <= this.selectedPremiumMaxValue &&
        x.enrollment >= this.selectedEnrollmentMinValue && x.enrollment <= this.selectedEnrollmentMaxValue && x.moop >= this.selectedMoopMinValue &&
        x.moop <= this.selectedMoopMaxValue && !x.sbAmbulance.includes(ambulance) && !x.sbCompDental.includes(compDental) && !x.sbFitness.includes(Fitness) &&
        x.sbHearing != hearing && x.sbVision != vision && x.sbWorldWideEmergency != emergency && x.sbTeleHealth != teleHealth && x.sbHomeSaftey != homeSaftey &&
        x.sbHomeSupport != homeSupport && x.sbPers != pers
      );

      this.plans = this.plans.filter(x => x.enrollment >= this.selectedEnrollmentChangeMinValue && x.enrollment <= this.selectedEnrollmentChangeMaxValue);
      this.plans = this.plans.filter(x => this.isMealChecked == true ? x.sbMeal == 1 : x.sbMeal != -1);
      this.plans = this.plans.filter(x => this.isChiropractorChecked == true ? x.sbChiropractor == 1 : x.sbChiropractor != -1)
      this.plans = this.plans.filter(x => this.isOTCChecked == true ? x.sbOTC == 1 : x.sbOTC != -1);
    }

    if (this.selectedBenifit == "Premium") {
      this.plans = this.plans.sort((a, b) => { return a.premiumCD - b.premiumCD });
    }

    if (this.selectedBenifit == "TPV") {
      this.plans = this.plans.sort((a, b) => { return b.tpv > a.tpv ? 1 : -1 });
    }

    if (this.selectedBenifit == "OOPC") {
      this.plans = this.plans.sort((a, b) => { return a.oopc - b.oopc });
    }

    if (this.selectedBenifit == "Enrollment Growth") {
      this.plans = this.plans.sort((a, b) => { return b.enrollment > a.enrollment ? 1 : -1 });
    }

    console.log("Count of plans after Filters : ", this.plans.length);
    this.spinner.hide();
  }

  loadBidIds() {
    if (this.userSelectedScenarioResults != null) {
      if (this.userSelectedScenarioResults[0].bidId != "") {
        this.selectedBidIds = this.userSelectedScenarioResults[0].bidId.split(",");
      }
      else {
        this.selectedBidIds = [];
      }
      console.log(" Selected Bid Id's : ", this.selectedBidIds.length);
      this.selectedBidIds.length > 1 ? this.showCompareButton = true : this.showCompareButton = false;
    }
  }

  checkScenarioName() {
    if (this.scenarioNamesOnly.includes(this.SaveScenarioName.toLowerCase())) {
      this.scenarioAlreadyExists = "Scenario Name Alredy Exist";
    }
    else {
      this.scenarioAlreadyExists = "";
    }
  }

  checkSaveASScenarioName() {
    if (this.scenarioNamesOnly.includes(this.scenarioName.toLowerCase())) {
      this.scenarioAlreadyExists = "Scenario Name Alredy Exist";
    }
    else {
      this.scenarioAlreadyExists = "";
    }
  }

  clearLeftSideItems() {
    this.showPlanCompare = false;
    this.showCompareButton = false;
    this.selectedBidIds = [];
    this.plansBenefits = [];
    this.plansBenifitsList = [];
    this.valuesFromPython = [];
    this.isPremiumChecked = false;
    this.isPartBChecked = false;
    this.isPlanCoverageChecked = false;
    this.isHealthDeductibleChecked = false;
    this.isDrugDedictibleChecked = false;
    this.isAmbulanceChecked = false;
    this.isComphrehensiveDentalChecked = false;
    this.isChiropractorChecked = false;
    this.isMealChecked = false;
    this.isFitnessChecked = false;
    this.isOTCChecked = false;
    this.isVisionChecked = false;
    this.isHearingChecked = false;
    this.isEmergencyChecked = false;
    this.isTeleHealthChecked = false;
    this.isHomeSupportChecked = false;
    this.isHomeSafteyChecked = false;
    this.isPersChecked = false;
    this.isDownload = true;
  }
}
