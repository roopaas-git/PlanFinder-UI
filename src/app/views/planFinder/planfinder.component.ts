import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { IState } from 'src/app/model/state.model';
import { StateService } from 'src/app/services/state.service';
import { ICounty } from 'src/app/model/county.model';
import { CountyService } from 'src/app/services/county.service';
import { PlantypeService } from 'src/app/services/plantype.service';
import { IPlantype } from 'src/app/model/plantype.model';
import { ISnptype } from 'src/app/model/snptype.model';
import { SnptypeService } from 'src/app/services/snptype.service';
import { IDropdownSettings, MultiSelectComponent } from 'ng-multiselect-dropdown';
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
import { IAllBenefitGroup } from 'src/app/model/benefitGroup.model';
import * as ExcelJS from "exceljs/dist/exceljs.min.js";
import { UiSwitchModule } from 'ngx-toggle-switch';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

declare var $: any;

declare global {
  interface JQuery {
    (selector: string): JQuery;
    floatingScrollbar(): JQuery;
  }
}

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
  customSelectedBids = [];
  customSelectedPlanName = [];
  selectedStateItems = [];
  selectedSalesRegionItems = [];
  selectedCountyItems = [];
  selectedYoYItems = [];
  selectedYears = [];
  selectedPlantypeItems = [];
  selectedSnptypesItems = [];
  selectedCrosswalkItems = [];
  selectedBidIds = [];
  selectedPlanName = [];
  selectedBenifit: string = "Premium";
  selectedEnrollmentFromPeriod: string = null;
  selectedEnrollmentToPeriod: string = null;
  CurrentPeriod: string;
  fromPeriod: string;
  toPeriod: string;
  stateDropdownSettings: IDropdownSettings;
  countyDropdownSettings: IDropdownSettings;
  yoyDropdownSettings: IDropdownSettings;
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
  isSelectAllChecked: boolean = false;
  showAll: number = 0;
  isAllClicked: boolean = false;
  isTop5Clicked: boolean = false;
  isTop10Clicked: boolean = false;
  isTop15Clicked: boolean = false;
  showPlanCompare: boolean = false;
  showScrollTopBtn: boolean;
  showDiscoverMoreBtn: boolean;
  topPosToStartShowing = 100;
  topPosForDivScroll = 170;
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

  HDMinValue: number = 0;
  HDMaxValue: number = 0;
  HDRangeValues: number[];
  selectedHDMinValue: number = 0;
  selectedHDMaxValue: number = 0;
  selectedHDMaxInputValue: number = 0;
  HDMinDefaultValue: number = 0;
  HDMaxDefaultValue: number = 0;

  DDMinValue: number = 0;
  DDMaxValue: number = 0;
  DDRangeValues: number[];
  selectedDDMinValue: number = 0;
  selectedDDMaxValue: number = 0;
  selectedDDMaxInputValue: number = 0;
  DDMinDefaultValue: number = 0;
  DDMaxDefaultValue: number = 0;

  isPremiumChecked: boolean = false;
  isPartBChecked: boolean = false;
  isPlanCoverageChecked: boolean = false;
  // isHealthDeductibleChecked: boolean = false;
  // isDrugDedictibleChecked: boolean = false;
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
  optionsYOY = [];
  previousBenifitYear: number;
  previousBenifitYears: string;
  scenarioAlreadyExists: string = "";
  checkValidScenario: boolean = false;
  scenarioNamesOnly = [];
  userSelectedScenarioResults: IScenarioResults[];
  isEnrollmentSelected: number = 0;
  isDownload: boolean = true;
  basePlan: string = '';
  isEnrollmentGrowthEnabled: boolean = true;

  filterBenefitGroups: IAllBenefitGroup[];
  selectedFilterBenefitGroups: string;
  selectedFilterBenefitGroupsItems = [];
  filterBenefitGroupsDropdownSettings: IDropdownSettings;
  filterBenefitGroupsCount: number = 0;
  isFilterBenefitGroupsEnabled: boolean = false;
  masterPlansBenefits: any[];
  isCostShareOnly: boolean = true;
  isReInitializescroller: boolean = false;
  isIncrementalLoad: boolean = false;
  advanceBenefitSearchItems = [];
  filteredBenefits: any[];
  isTopFilterChangeActive: boolean = false;
  isTopFilterChangeActiveNotify: boolean = false;
  showModalBox: boolean = false;
  utcServerDateMonth = new Date().getUTCMonth();
  selectedBenefitModel: any;
  selectedEnrollmentModel: any;
  selectedEnrollmentToModel:any;
  selectedEnrollmentFromModel:any;
  disableSliderPremium: boolean = false;
  disableSliderEnr: boolean = false;
  disableSliderChangeEnr: boolean = false;
  disableSliderHD: boolean = false;
  disableSliderDD: boolean = false;
  disableSliderMOOP: boolean = false;

  floatCheck: boolean = false;

  @ViewChild('saveModal') closeModal: ElementRef;
  @ViewChild('saveAsModal') closeSaveAsModal: ElementRef;
  @ViewChild('openModal') closeOpenModal: ElementRef;
  @ViewChild('colorModal') closeColorModal: ElementRef;

  @HostListener('window:scroll')

  checkScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    var scrollPositionAfter;
    if (scrollPosition >= this.topPosToStartShowing) {
      this.showScrollTopBtn = true;

    } else {
      this.showScrollTopBtn = false;
      this.floatCheck = false;
    }

    if (this.floatCheck == true) {
      this.showDiscoverMoreBtn = false;
      scrollPositionAfter = window.pageYOffset;
      if (scrollPosition >= scrollPositionAfter) {
        this.floatCheck = false;
      }
    }
    else {
      if (scrollPosition >= this.topPosForDivScroll) {
        this.showDiscoverMoreBtn = true;
      }
      else {
        this.showDiscoverMoreBtn = false;

      }
    }
  }
  showTopDiv() {
    this.floatCheck = true;
    this.showDiscoverMoreBtn = false;
  }
  settingYOYColour() {
    getComputedStyle(document.documentElement)
      .getPropertyValue('--colour-ab-c');
    getComputedStyle(document.documentElement)
      .getPropertyValue('--colour-ab-cd');
    var largest = Math.max.apply(0, this.optionsYOY);
    if (this.selectedYoYItems[0] == largest) {
      document.documentElement.style.setProperty('--colour-ab-c', '#81A5E7');
      document.documentElement.style.setProperty('--colour-ab-cd', '#F8C4C1');
    }
    else {
      document.documentElement.style.setProperty('--colour-ab-c', '#F8C4C1');
      document.documentElement.style.setProperty('--colour-ab-cd', '#81A5E7');

    }
  }
  addingOptionsForYOY() {
    this.optionsYOY = [];
    var year = this.currentBenifitYear;
    this.selectedYears = [];

    for (let i = 1; i <= 2; i++) {
      this.optionsYOY.push(year - i);
    }
    this.selectedYears.push(this.currentBenifitYear);
    //this.selectedYoyItems.push(this.optionsYOY[0]);
  }
  constructor(private _userService: UserService, private _stateService: StateService, private _salesRegionService: SalesRegionService,
    private _countyService: CountyService, private _plantypeService: PlantypeService,
    private _snptypeService: SnptypeService, private _crossWalkService: CrosswalkService,
    private _plansService: PlansService, private _benefitService: BenefitService, private _enrollmentService: EnrollmentService,
    private _comparePlansService: ComparePlansservice, private _userInputService: UserInputsService,
    private _scenarioService: ScenarioService, private messageService: MessageService, private spinner: NgxSpinnerService, private confirmationService: ConfirmationService,
    private route: ActivatedRoute,
    private eleRef: ElementRef) {
    this.route.queryParams.subscribe(params => {
      this.userId = route.snapshot.params.userId;
    });
  }

  ngOnInit() {
    this.bindUserDetails();
    this.dropdownsettings();
    this.bindRangeDefaultValues();
    this.bindBenifits();
    // this.bindAllPlanBenefitGroups();
    this.bindScenarioNames();
    this.bindMaxperiod();
    this.bindMaxperiodYOY();
  }
  pushIntoCustomBids() {
    this.customSelectedBids = [];
    this.customSelectedPlanName = [];
    for (var i = 0; i < this.selectedBidIds.length; i++) {
      this.customSelectedBids.push({ bid: this.selectedBidIds[i], bidid: this.selectedBidIds[i] });
      this.customSelectedPlanName.push({ pname: this.selectedPlanName[i] + " " + "(" + this.selectedBidIds[i] + ")", pidName: this.selectedBidIds[i] });
    }
    if (this.isColorCodeSelected) {
      // Dont open the modal
      this.showModalBox = false;
      this.rebindPlanBenfefitDetails();
      this.messageService.add({ severity: 'success', summary: 'Color Code removed' });
    } else {
      // Open the modal
      this.showModalBox = true;
    }
  }

  clearSelection(dropdown) {
    //clears open view dropdown selections
    dropdown.updateSelectedOption(null);
  }

  toggleComparePlan() {
    this.spinner.show();
    this.showPlanCompare = !this.showPlanCompare;
    this.showCompareButton = false;
    this.isDownload = false;
    this.isEnrollmentGrowthEnabled = false;
    this.isColorCodeSelected = false;
    //this.goToTop();
    this.isReInitializescroller = false;
    if (this.userSelectedScenarioResults == null) {      
      this.bindAllPlanBenefitGroups();
     this.selectedBenefitModel = this.benefits[0];     
    }
    // if (this.userSelectedScenarioResults == null) {      
    //   this.bindAllPlanBenefitGroups();
    // }
    this.addingOptionsForYOY();    
    this.selectedYoYItems = [];
    this.bindPlanBenfefitDetails();
    //this.bindBenifits();
    this.goToTop();
  }

  checkTrue(id) {

    return this.selectedBidIds.includes(id) ? true : false;

  }

  bindPlanBenfefitDetails() {
    let bidId: IComparePlans = {
      bidId: this.selectedBidIds.toString(),
      stateId: this.selectedState,
      counties: this.selectedCounty,
      years: this.selectedYears.toString(),
      monthNumber: this.utcServerDateMonth
    }
    this._comparePlansService.getBenefitDetails(bidId, this.isCostShareOnly)
      .subscribe((result: any[]) => {
        if (result.length > 0) {
          this.masterPlansBenefits = [];
          this.masterPlansBenefits = result;
          this.plansBenefits = [];
          if (this.isFilterBenefitGroupsEnabled) {
            this.masterPlansBenefits.forEach(element => {
              let existItem = [];
              existItem = this.selectedFilterBenefitGroupsItems.filter((val) => val.benefitGroup === element.sortGroup);
              if (existItem.length >= 1) {
                this.plansBenefits.push(element);
              }
            });
          }
          else {
            this.plansBenefits = this.masterPlansBenefits;
          }

          this.appfloatingscrollerStatus(true, this.isReInitializescroller);
          this.getColumns(this.plansBenefits);
        }
      }, err => {
        console.log('HTTP Error', err);
        this.spinner.hide();
      });
  }

  getPlanBenefitItems() {
    this.filteredBenefits = [];
    this.advanceBenefitSearchItems = [];
    this.plansBenefits.forEach(element => {
      if (element.year == this.currentBenifitYear) {
        this.advanceBenefitSearchItems.push({ benefits: element.benefits });
      }
    });
  }

  filterBenefits(event) {
    this.filteredBenefits = [];
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < this.advanceBenefitSearchItems.length; i++) {
      let tempbenefit = this.advanceBenefitSearchItems[i];

      if (tempbenefit.benefits.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(tempbenefit);
      }
    }
    this.filteredBenefits = filtered;
  }

  onSelectFilterBenefit(event) {
    this.spinner.show();
    $().rowHighlighter(true, event.benefits);
    this.spinner.hide();
    $().rowHighlighter(false, event.benefits);
  }

  appfloatingscrollerStatus(statusType, isReInitialize) {
    if (this.selectedBidIds.length > 5) {
      if (statusType) {
        if (!isReInitialize) {
          $('.pc-plans-body').floatingScrollbar('initialize');
        } else {
          $('.pc-plans-body').floatingScrollbar('reinitialize');
        }
      }
      else {
        $('#floating-scrollbar').css("display", "none");
      }
    } else {
      $('#floating-scrollbar').css("display", "none");
    }
  }

  isBenefitGroupSelected()
  {
    if(this.selectedFilterBenefitGroupsItems.length == 0)
    {
      this.messageService.add({ severity: 'error', summary: 'REQUIRED! Benefit Group.' });
      return false;
    }
    return true;
  }

  rebindPlanBenfefitDetails() {
    if(this.isBenefitGroupSelected())
    {
    if (this.isColorCodeSelected == true) {
      this.isColorCodeSelected = false;
      this.valuesFromPython = [];
    }
    this.plansBenefits = [];
    if (this.isFilterBenefitGroupsEnabled) {
      this.masterPlansBenefits.forEach(element => {
        let existItem = [];
        existItem = this.selectedFilterBenefitGroupsItems.filter((val) => val.benefitGroup === element.sortGroup);
        if (existItem.length >= 1) {
          this.plansBenefits.push(element);
        }
      });
    }
    else {
      this.plansBenefits = this.masterPlansBenefits;
    }
    this.getColumns(this.plansBenefits);
    this.goToTop();
    this.floatCheck = false;
  }
}


  getColumns(planBenefits: any) {
    this.plansBenifitsList = [];
    let val = planBenefits[0];
    let col = Object.keys(val);
    col.forEach(items => {
      this.plansBenifitsList.push({ field: items, header: items });
    });
    this.cols = this.plansBenifitsList;
    this.getPlanBenefitItems();
    this.updateRowGroupMetaData();
    //this.spinner.hide();
  }

  toggleComparePlanBack() {
    this.isReInitializescroller = false;
    this.appfloatingscrollerStatus(false, this.isReInitializescroller);
    this.showPlanCompare = !this.showPlanCompare;
    this.showCompareButton = this.selectedBidIds.length >= 2 ? true : false;
    this.selectedBenefitModel = this.benefits[(this.benefits.find(x=>x.benefit == this.selectedBenifit).id)-1];
    this.plansBenefits = [];
    this.plansBenifitsList = [];
    this.finalValuesFromPython = null;
    this.isDownload = true;
    this.goToTop();
    this.floatCheck = false;
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
        this.scenarioNamesOnly=[];
        this.scenarios = result;
        result.forEach(element => {
          this.scenarioNamesOnly.push(element.scenario.toString().toLowerCase());         
        });       
      }
    })
  }

  bindMaxperiod() {
    this._plansService.getMaxPeriod().subscribe((result: IPeriod[]) => {
      if (result.length > 0) {
        this.currentYear = result[0].currentYear;
        this.previousYear = result[0].previousYear;
        this.previousYears = result[0].previousYear.toString();
      }
    })
  }

  bindMaxperiodYOY() {
    this._plansService.getMaxYOYPeriod().subscribe((result: IPeriod[]) => {
      if (result.length > 0) {
        this.currentBenifitYear = result[0].currentYear;
        this.previousBenifitYear = result[0].previousYear;
        this.previousBenifitYears = result[0].previousYear.toString();
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

  bindAllPlanBenefitGroups() {
    this._comparePlansService.getAllBenefitGroups(this.isCostShareOnly).subscribe((result: IAllBenefitGroup[]) => {
      if (result.length > 0) {
        this.filterBenefitGroups = result;
        for (let i = 0; i < result.length; i++) {
          this.selectedFilterBenefitGroups = i == 0 ? result[i].id.toString() : this.selectedFilterBenefitGroups + "," + result[i].id.toString();
        }
        this.selectedFilterBenefitGroupsItems = result;
        this.filterBenefitGroupsCount = result.length;
        this.isFilterBenefitGroupsEnabled = false;
      }
    })
  }

  loadAllPlanBenefitGroupsValues(userPlanBenefits: string[]) {
    this.selectedFilterBenefitGroupsItems = [];
    this._comparePlansService.getAllBenefitGroups(this.isCostShareOnly).subscribe((result: IAllBenefitGroup[]) => {
      if (result != null) {
        this.filterBenefitGroups = result;
        let userSelectedFilterBenefitsItems = [];
        result.forEach(element => {
          if (userPlanBenefits.includes(element.id.toString())) {
            userSelectedFilterBenefitsItems.push({ id: element.id, benefitGroup: element.benefitGroup });
          }
        });
        for (let i = 0; i < result.length; i++) {
          this.selectedFilterBenefitGroups = i == 0 ? result[i].id.toString() : this.selectedFilterBenefitGroups + "," + result[i].id.toString();
        }
        this.selectedFilterBenefitGroupsItems = userSelectedFilterBenefitsItems;
        this.isReInitializescroller = true;
        this.checkAllBenefitGroupsSelected();
      }
    });
  }

  getStatesDefaultValues() {
    this._stateService.getStates().subscribe((result: IState[]) => {
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
    this._countyService.getCounties(state, salesRegionId, this.clientId).subscribe((result) => {
      if (result != null) {
        this.selectedSalesRegion = salesRegionId;
        this.counties = result;
        this.selectedCounties = [];
        result.forEach(element => {
          this.selectedCounties.push(element.id);
        });
        //this.selectedCountyItems = [{ id: result[17].id, counties: result[17].counties }]
        //this.selectedCounties.push(result[17].id);
        this.selectedCountyItems = result;
        this.getPlantypeDefault(this.selectedCounties);
      }
    });
  }

  getPlantypeDefault(county: any) {
    this._plantypeService.getPlantypes(this.selectedState, county).subscribe((result) => {
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
        if (!this.isIncrementalLoad) {
          this.getAllPlans();
          this.isIncrementalLoad = true;
        }
        else {
          this.spinner.hide();
          if(!this.isTopFilterChangeActive)
    {
          this.isTopFilterChangeActive = true;
          this.onChangeTopFilterNotifier();
    }
        }
      }
    });
  }

  onChangeTopFilterNotifier() {
    setTimeout(() => {
      if (this.isTopFilterChangeActive) {
        this.isTopFilterChangeActiveNotify = true;
        this.messageService.add({ severity: 'warn', summary: 'Please click on FIND PLANS' });
        this.isTopFilterChangeActive = false;
      }
    }, 5000);
  }

  getAllPlans() {
    this.spinner.show();
    this.isSelectAllChecked = false;
    this.selectedBidIds = [];
    this.selectedPlanName = [];
    this.showCompareButton = false;
    this.getSelectedCrossWalk();
    this.getAllPlansDetails();
    this.getEnrollmentPeriod();
    this.bindAllPlanBenefitGroups();
    this.isAllClicked = false;
    this.isTop5Clicked = false;
    this.isTop10Clicked = false;
    this.isTop15Clicked = false;
    this.clearLeftSideItems();
    if (this.userSelectedScenarioResults == null) {      
      this.selectedBenefitModel=[];
      let sBenefit = this.selectedBenifit;
      this.selectedBenefitModel = this.benefits[(this.benefits.find(x=>x.benefit == "Premium").id)-1];
      this.selectedBenifit="Premium";
       }
    setTimeout(() => {  this.checkRangeDisable(); }, 10000);
  }

  getSelectedCrossWalk() {
    if (this.selectedCrosswalkItems.length > 0) {
      for (let index = 0; index < this.selectedCrosswalkItems.length; index++) {
        this.selectedCrosswalk = index == 0 ? this.selectedCrosswalkItems[index].id : this.selectedCrosswalk + "," + this.selectedCrosswalkItems[index].id;
      }
    } else {
      this.selectedCrosswalk = "0";
    }
  }

  getAllPlansDetails() {
    this._plansService.getPlans(this.selectedState, this.selectedCounty, this.selectedPlantype, this.selectedSnptype, this.selectedCrosswalk)
      .subscribe((result: IPlans[]) => {
        if (result.length > 0) {
          this.plans = result.sort((a, b) => { return a.premiumCD - b.premiumCD });
          this.copyOfPlans = result.sort((a, b) => { return a.premiumCD - b.premiumCD });
          this.isTopFilterChangeActive = false;
          this.isTopFilterChangeActiveNotify = false;
          this.bindBenifits();
          this.getFilterValues();
        }
        else
        {
          this.isTopFilterChangeActive = false;
          this.isTopFilterChangeActiveNotify = true;
          this.messageService.add({ severity: 'warn', summary: 'No Plan(s) Found.' });
        }
        this.plans = result;
        this.spinner.hide();
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

      this.HDMinValue = Math.min.apply(Math, this.plans.map(function (o) { return o.healthDeductible }));
      this.HDMaxValue = Math.max.apply(Math, this.plans.map(function (o) { return o.healthDeductible }));

      this.DDMinValue = Math.min.apply(Math, this.plans.map(function (o) { return o.anualDrugDeductible }));
      this.DDMaxValue = Math.max.apply(Math, this.plans.map(function (o) { return o.anualDrugDeductible }));

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

      this.HDMinValue = Math.min.apply(Math, this.plans.map(function (o) { return o.healthDeductible }));
      this.HDMaxValue = Math.max.apply(Math, this.plans.map(function (o) { return o.healthDeductible }));

      this.DDMinValue = Math.min.apply(Math, this.plans.map(function (o) { return o.anualDrugDeductible }));
      this.DDMaxValue = Math.max.apply(Math, this.plans.map(function (o) { return o.anualDrugDeductible }));

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

    this.HDMinDefaultValue = this.HDMinValue;
    this.HDMaxDefaultValue = this.HDMaxValue;

    this.HDRangeValues = [this.HDMinValue, this.HDMaxValue];
    this.selectedHDMinValue = this.HDMinValue;
    this.selectedHDMaxValue = this.HDMaxValue;

    this.DDMinDefaultValue = this.DDMinValue;
    this.DDMaxDefaultValue = this.DDMaxValue;

    this.DDRangeValues = [this.DDMinValue, this.DDMaxValue];
    this.selectedDDMinValue = this.DDMinValue;
    this.selectedDDMaxValue = this.DDMaxValue;
    this.spinner.hide();  
  }

  bindRangeValues() {
    this.premiumRangeValues = [this.premiumMinValue, this.selectedPremiumMaxValue];
    this.selectedPremiumMinValue = this.premiumMinValue;
    this.selectedPremiumMaxValue = this.selectedPremiumMaxValue;

    this.moopRangeValues = [this.moopMinValue, this.selectedMoopMaxValue];
    this.selectedMoopMinValue = this.moopMinValue;
    this.selectedMoopMaxValue = this.selectedMoopMaxValue;

    this.HDRangeValues = [this.HDMinValue, this.selectedHDMaxValue];
    this.selectedHDMinValue = this.HDMinValue;
    this.selectedHDMaxValue = this.selectedHDMaxValue;

    this.DDRangeValues = [this.DDMinValue, this.selectedDDMaxValue];
    this.selectedDDMinValue = this.DDMinValue;
    this.selectedDDMaxValue = this.selectedDDMaxValue;
  }
  checkSelectTrue(val) {
    this.isSelectAllChecked = val ? true : false;
  }
  checkUncheckAll() {
    this.selectedBidIds = [];
    this.selectedPlanName = [];
    if (this.isSelectAllChecked) {
      for (var i = 0; i < this.plans.length; i++) {
        this.selectedBidIds.push(this.plans[i].bidId);
        this.selectedPlanName.push(this.plans[i].planName);
      }
    }

    this.selectedBidIds.length > 1 ? this.showCompareButton = true : this.showCompareButton = false; 
  }

  getCheckedBidId(plan: IPlans) {
    if (this.selectedBidIds.length > 0) {
      var checkBidId = this.selectedBidIds.includes(plan.bidId);
      if (checkBidId == true) {
        this.selectedBidIds = this.selectedBidIds.filter(item => item != plan.bidId);
        this.selectedPlanName = this.selectedPlanName.filter(item => item != plan.planName);
      }
      else {
        this.selectedBidIds.push(plan.bidId);
        this.selectedPlanName.push(plan.planName);
      }
      this.selectedBidIds.length > 1 ? this.showCompareButton = true : this.showCompareButton = false;
    }
    else {
      if (this.selectedBidIds.length == 0) {
        this.selectedBidIds.push(plan.bidId);
        this.selectedPlanName.push(plan.planName);
      }
    }

  }

  ChangePremium(premiumValue) {
    this.selectedPremiumMinValue = premiumValue.values[0];
    this.selectedPremiumMaxValue = premiumValue.values[1];    
    this.FilterAllPlans();
    this.ReClickLink();
  }

  ChangeEnrollment(enrollmentValue) {
    this.selectedEnrollmentMinValue = enrollmentValue.values[0];
    this.selectedEnrollmentMaxValue = enrollmentValue.values[1];
    this.FilterAllPlans();
    this.ReClickLink();
  }

  ChangeEnrollmentIn(enrollmentChangeValue) {
    this.selectedEnrollmentChangeMinValue = enrollmentChangeValue.values[0];
    this.selectedEnrollmentChangeMaxValue = enrollmentChangeValue.values[1];
    this.FilterAllPlans();
    this.ReClickLink();
  }

  ChangeMOOP(moopValue) {
    this.selectedMoopMinValue = moopValue.values[0];
    this.selectedMoopMaxValue = moopValue.values[1];
    this.FilterAllPlans();
    this.ReClickLink();
  }

  ChangeHD(HDValue) {
    this.selectedHDMinValue = HDValue.values[0];
    this.selectedHDMaxValue = HDValue.values[1];
    this.FilterAllPlans();
    this.ReClickLink();
  }
  ChangeDD(DDValue) {
    this.selectedDDMinValue = DDValue.values[0];
    this.selectedDDMaxValue = DDValue.values[1];
    this.FilterAllPlans();
    this.ReClickLink();
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
    this.ReClickLink();
  }

  ChangePremiumFromMaxInput(newValue: string) {
    let selectedValue = + newValue.replace('$', '');
    if (selectedValue > this.premiumMaxValue) {
      this.messageService.add({ severity: 'error', summary: 'Should not > ' + this.premiumMaxValue + ' Value' });
    }
    else {
      this.selectedPremiumMaxValue = + newValue.replace('$', '');
      this.bindRangeValues();
      this.FilterAllPlans();
    }
    this.ReClickLink();
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
    this.ReClickLink();
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
    this.ReClickLink();
  }
  ChangeHDFromMinInput(newValue: string) {
    let value = + newValue.replace('$', '');
    if (value > this.selectedHDMaxValue) {
      this.messageService.add({ severity: 'error', summary: 'Should not > ' + this.selectedHDMaxValue + ' Value' });
    }
    else {
      this.HDMinValue = value
      this.bindRangeValues();
      this.FilterAllPlans();
    }
    this.ReClickLink();
  }

  ChangeHDFromMaxInput(newValue: string) {
    let selectedValue = + newValue.replace('$', '');
    if (selectedValue > this.HDMaxValue) {
      this.messageService.add({ severity: 'error', summary: 'Should not > Max Value' });
    }
    else {
      this.selectedHDMaxValue = + newValue.replace('$', '');
      this.bindRangeValues();
      this.FilterAllPlans();
    }
    this.ReClickLink();
  }

  ChangeDDFromMinInput(newValue: string) {
    let value = + newValue.replace('$', '');
    if (value > this.selectedDDMaxValue) {
      this.messageService.add({ severity: 'error', summary: 'Should not > ' + this.selectedDDMaxValue + ' Value' });
    }
    else {
      this.DDMinValue = value
      this.bindRangeValues();
      this.FilterAllPlans();
    }
    this.ReClickLink();
  }

  ChangeDDFromMaxInput(newValue: string) {
    let selectedValue = + newValue.replace('$', '');
    if (selectedValue > this.DDMaxValue) {
      this.messageService.add({ severity: 'error', summary: 'Should not > Max Value' });
    }
    else {
      this.selectedDDMaxValue = + newValue.replace('$', '');
      this.bindRangeValues();
      this.FilterAllPlans();
    }
    this.ReClickLink();
  }

  getStates() {
    this._stateService.getStates().subscribe((result: IState[]) => {
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
      }
    });
  }

  onYoYItemSelect() {
    this.settingYOYColour();
    this.spinner.show();
    this.selectedYears = [];
    this.isYOYSelected = false;
    if(this.isColorCodeSelected==true)
    {
    this.isColorCodeSelected = false;
    this.showModalBox = false;
    this.messageService.add({ severity: 'success', summary: 'Color Code removed' });
    }
    this.selectedYears.push(this.currentBenifitYear);

    for (let i = 0; i < this.selectedYoYItems.length; i++) {
      this.selectedYears.push(this.selectedYoYItems[i]);
    };

    if (this.selectedYears.length > 1) {
      this.isYOYSelected = true;
    }
    this.bindPlanBenfefitDetails();
    //this.getYOY();
  }
  onYoYItemDeSelect() {
    this.settingYOYColour();
    this.spinner.show();
    this.selectedYears = [];
    this.isYOYSelected = false;
    if(this.isColorCodeSelected==true)
    {
    this.isColorCodeSelected = false;
    this.showModalBox = false;
    this.messageService.add({ severity: 'success', summary: 'Color Code removed' });
    }
    this.selectedYears.push(this.currentBenifitYear);
    for (let i = 0; i < this.selectedYoYItems.length; i++) {
      this.selectedYears.push(this.selectedYoYItems);
    };
    if (this.selectedYears.length > 1) {
      this.isYOYSelected = true;
    }
    this.bindPlanBenfefitDetails();
    //this.getYOY();
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
    this.isSelectAllChecked = false;
    this.isAllClicked = false;
    this.isTop5Clicked = false;
    this.isTop10Clicked = false;
    this.isTop15Clicked = false;
  }

  onStateDeSelect() {
    this.clearLeftSideItems();
    this.selectedSalesRegionItems = [];
    this.selectedCountyItems = [];
    this.selectedPlantypeItems = [];
    this.selectedSnptypesItems = [];
    this.selectedCrosswalkItems = [];
    this.isSelectAllChecked = false;
    this.isAllClicked = false;
    this.isTop5Clicked = false;
    this.isTop10Clicked = false;
    this.isTop15Clicked = false;
    if(!this.isTopFilterChangeActive)
    {
    this.isTopFilterChangeActive = true;
    this.onChangeTopFilterNotifier();
    }
  }

  onSalesRegionSelect() {
    this.clearLeftSideItems();
    this.selectedCountyItems = [];
    this.selectedPlantypeItems = [];
    this.selectedSnptypesItems = [];
    this.selectedCrosswalkItems = [];
    this.isSelectAllChecked = false;
    this.isAllClicked = false;
    this.isTop5Clicked = false;
    this.isTop10Clicked = false;
    this.isTop15Clicked = false;
    this.getCountiesDefault(this.selectedState, this.selectedSalesRegion);

  }

  onSalesRegionSelectAll(items: any) {
    this.clearLeftSideItems();
    this.selectedCountyItems = [];
    this.selectedPlantypeItems = [];
    this.selectedSnptypesItems = [];
    this.selectedCrosswalkItems = [];
    this.selectedSalesRegionItems = items;
    this.isSelectAllChecked = false;
    this.isAllClicked = false;
    this.isTop5Clicked = false;
    this.isTop10Clicked = false;
    this.isTop15Clicked = false;
    this.getCountiesDefault(this.selectedState, this.selectedSalesRegion);

  }

  onSalesRegionDeSelectAll(items: any) {
    this.clearLeftSideItems();
    this.selectedCountyItems = [];
    this.selectedPlantypeItems = [];
    this.selectedSnptypesItems = [];
    this.selectedCrosswalkItems = [];
    this.isSelectAllChecked = false;
    this.isAllClicked = false;
    this.isTop5Clicked = false;
    this.isTop10Clicked = false;
    this.isTop15Clicked = false;
    if(!this.isTopFilterChangeActive)
    {
    this.isTopFilterChangeActive = true;
    this.onChangeTopFilterNotifier();
    }
  }

  onSalesRegionDeSelect() {
    this.clearLeftSideItems();
    this.selectedCountyItems = [];
    this.selectedPlantypeItems = [];
    this.selectedSnptypesItems = [];
    this.selectedCrosswalkItems = [];
    this.isSelectAllChecked = false;
    this.isAllClicked = false;
    this.isTop5Clicked = false;
    this.isTop10Clicked = false;
    this.isTop15Clicked = false;
   // this.getCountiesDefault(this.selectedState, this.selectedSalesRegion);
   if(!this.isTopFilterChangeActive)
    {
    this.isTopFilterChangeActive = true;
    this.onChangeTopFilterNotifier();
    }
  }

  onCountyItemSelect() {
    this.spinner.show();
    this.clearLeftSideItems();
    this.selectedPlantypeItems = [];
    this.selectedSnptypesItems = [];
    this.selectedCrosswalkItems = [];
    this.selectedCounties = [];
    this.isSelectAllChecked = false;
    this.isAllClicked = false;
    this.isTop5Clicked = false;
    this.isTop10Clicked = false;
    this.isTop15Clicked = false;
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
    this.isSelectAllChecked = false;
    this.isAllClicked = false;
    this.isTop5Clicked = false;
    this.isTop10Clicked = false;
    this.isTop15Clicked = false;
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
    this.isSelectAllChecked = false;
    this.isAllClicked = false;
    this.isTop5Clicked = false;
    this.isTop10Clicked = false;
    this.isTop15Clicked = false;
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
    this.isSelectAllChecked = false;
    this.isAllClicked = false;
    this.isTop5Clicked = false;
    this.isTop10Clicked = false;
    this.isTop15Clicked = false;
    if(!this.isTopFilterChangeActive)
    {
    this.isTopFilterChangeActive = true;
    this.onChangeTopFilterNotifier();
    }
  }

  onPlanTypeItemSelect() {
    this.spinner.show();
    this.clearLeftSideItems();
    this.selectedSnptypesItems = [];
    this.selectedCrosswalkItems = [];
    this.selectedPlantypes = "";
    this.isSelectAllChecked = false;
    this.isAllClicked = false;
    this.isTop5Clicked = false;
    this.isTop10Clicked = false;
    this.isTop15Clicked = false;
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
    this.isSelectAllChecked = false;
    this.isAllClicked = false;
    this.isTop5Clicked = false;
    this.isTop10Clicked = false;
    this.isTop15Clicked = false;
    for (let i = 0; i < this.selectedPlantypeItems.length; i++) {
      this.selectedPlantypes = i == 0 ? this.selectedPlantypeItems[i].id.toString() : this.selectedPlantypes + "," + this.selectedPlantypeItems[i].id.toString();
    }
    this.selectedPlantypes == "" ? "" : this.getSnptypeDefault(this.selectedPlantypes);
  }

  onPlanTypeDeSelectAll(items: any) {
    this.clearLeftSideItems();
    this.selectedPlantypeItems = [];
    this.selectedPlantype = "0";
    this.selectedSnptypesItems = [];
    this.selectedSnptypes = "";
    this.selectedSnptype = "0";
    this.selectedCrosswalkItems = [];
    this.selectedCrosswalk = "";
    this.selectedCrosswalk = "0";
    this.isSelectAllChecked = false;
    this.isAllClicked = false;
    this.isTop5Clicked = false;
    this.isTop10Clicked = false;
    this.isTop15Clicked = false;
    if(!this.isTopFilterChangeActive)
    {
    this.isTopFilterChangeActive = true;
    this.onChangeTopFilterNotifier();
    }
  }

  onPlanTypeDeSelect() {
    this.spinner.show();
    this.clearLeftSideItems();
    this.selectedSnptypesItems = [];
    this.selectedCrosswalkItems = [];
    this.selectedPlantypes = "";
    this.isSelectAllChecked = false;
    this.isAllClicked = false;
    this.isTop5Clicked = false;
    this.isTop10Clicked = false;
    this.isTop15Clicked = false;
    if (this.selectedPlantypeItems.length > 0) {
      for (let i = 0; i < this.selectedPlantypeItems.length; i++) {
        this.selectedPlantypes = i == 0 ? this.selectedPlantypeItems[i].id.toString() : this.selectedPlantypes + "," + this.selectedPlantypeItems[i].id.toString();
      }
      this.getSnptypeDefault(this.selectedPlantypes);
    } else {
      this.selectedPlantype = "0";
      this.selectedSnptype = "0";
      this.selectedCrosswalk = "0";
      this.spinner.hide();
    }
  }

  onSnptypeItemSelect() {
    this.spinner.show();
    this.clearLeftSideItems();
    this.selectedCrosswalkItems = [];
    this.selectedSnptype = "";
    this.isSelectAllChecked = false;
    this.isAllClicked = false;
    this.isTop5Clicked = false;
    this.isTop10Clicked = false;
    this.isTop15Clicked = false;
    for (let i = 0; i < this.selectedSnptypesItems.length; i++) {
      this.selectedSnptype = i == 0 ? this.selectedSnptypesItems[i].id.toString() : this.selectedSnptype + "," + this.selectedSnptypesItems[i].id.toString();
    }
    this.getCrosswalkDefault(this.selectedSnptype);
  }

  onSnptypeSelectAll(items: any) {
    this.spinner.show();
    this.clearLeftSideItems();
    this.selectedCrosswalkItems = [];
    this.selectedSnptype = "";
    this.selectedSnptypesItems = items;
    this.isSelectAllChecked = false;
    this.isAllClicked = false;
    this.isTop5Clicked = false;
    this.isTop10Clicked = false;
    this.isTop15Clicked = false;
    for (let i = 0; i < this.selectedSnptypesItems.length; i++) {
      this.selectedSnptype = i == 0 ? this.selectedSnptypesItems[i].id.toString() : this.selectedSnptype + "," + this.selectedSnptypesItems[i].id.toString();
    }
    this.getCrosswalkDefault(this.selectedSnptype);
  }

  onSnptypeDeSelect() {
    this.clearLeftSideItems();
    this.selectedCrosswalkItems = [];
    this.selectedSnptype = "";
    this.isSelectAllChecked = false;
    this.isAllClicked = false;
    this.isTop5Clicked = false;
    this.isTop10Clicked = false;
    this.isTop15Clicked = false;
    if (this.selectedSnptypesItems.length > 0) {
      for (let i = 0; i < this.selectedSnptypesItems.length; i++) {
        this.selectedSnptype = i == 0 ? this.selectedSnptypesItems[i].id.toString() : this.selectedSnptype + "," + this.selectedSnptypesItems[i].id.toString();
      }
      this.getCrosswalkDefault(this.selectedSnptype);
    } else {
      this.selectedSnptype = "0";
      this.selectedCrosswalk = "0";
      this.spinner.hide();
    }
    // this.selectedSnptype == "" ? "" : this.getCrosswalkDefault(this.selectedSnptype);
  }

  onSnptypeDeSelectAll(items: any) {
    this.clearLeftSideItems();
    this.selectedSnptypesItems = [];
    this.selectedSnptype = "0";
    this.selectedCrosswalkItems = [];
    this.selectedCrosswalk = "0";
    this.isSelectAllChecked = false;
    this.isAllClicked = false;
    this.isTop5Clicked = false;
    this.isTop10Clicked = false;
    this.isTop15Clicked = false;
    if(!this.isTopFilterChangeActive)
    {
    this.isTopFilterChangeActive = true;
    this.onChangeTopFilterNotifier();
    }
  }

  onCrossWalkItemSelect() {
    this.clearLeftSideItems();
    if(!this.isTopFilterChangeActive)
    {
    this.isTopFilterChangeActive = true;
    this.onChangeTopFilterNotifier();
    }
    this.isSelectAllChecked = false;
    this.isAllClicked = false;
    this.isTop5Clicked = false;
    this.isTop10Clicked = false;
    this.isTop15Clicked = false;
  }
  onCrossWalkSelectAll(items: any) {
    this.clearLeftSideItems();
    if(!this.isTopFilterChangeActive)
    {
    this.isTopFilterChangeActive = true;
    this.onChangeTopFilterNotifier();
    }
    this.isSelectAllChecked = false; this.isAllClicked = false;
    this.isTop5Clicked = false;
    this.isTop10Clicked = false;
    this.isTop15Clicked = false;
  }
  onCrossWalkDeSelectAll(items: any) {
    this.selectedCrosswalkItems = [];
    this.clearLeftSideItems();
    if(!this.isTopFilterChangeActive)
    {
    this.isTopFilterChangeActive = true;
    this.onChangeTopFilterNotifier();
    }
    this.isSelectAllChecked = false; this.isAllClicked = false;
    this.isTop5Clicked = false;
    this.isTop10Clicked = false;
    this.isTop15Clicked = false;
    if(!this.isTopFilterChangeActive)
    {
    this.isTopFilterChangeActive = true;
    this.onChangeTopFilterNotifier();
    }
  }
  onCrossWalkDeSelect() {
    this.clearLeftSideItems();
    if(!this.isTopFilterChangeActive)
    {
    this.isTopFilterChangeActive = true;
    this.onChangeTopFilterNotifier();
    }
    this.isSelectAllChecked = false; this.isAllClicked = false;
    this.isTop5Clicked = false;
    this.isTop10Clicked = false;
    this.isTop15Clicked = false;
  }

  onAllBenefitGroupsItemSelect() {
    this.selectedFilterBenefitGroups = "";
    for (let i = 0; i < this.selectedFilterBenefitGroupsItems.length; i++) {
      this.selectedFilterBenefitGroups = i == 0 ? this.selectedFilterBenefitGroupsItems[i].id.toString() : this.selectedFilterBenefitGroups + "," + this.selectedFilterBenefitGroupsItems[i].id.toString();
    }
    this.checkAllBenefitGroupsSelected();
  }

  onAllBenefitGroupsDeSelect() {
    this.selectedFilterBenefitGroups = "";
    for (let i = 0; i < this.selectedFilterBenefitGroupsItems.length; i++) {
      this.selectedFilterBenefitGroups = i == 0 ? this.selectedFilterBenefitGroupsItems[i].id.toString() : this.selectedFilterBenefitGroups + "," + this.selectedFilterBenefitGroupsItems[i].id.toString();
    }
    this.checkAllBenefitGroupsSelected();
  }

  onAllBenefitGroupsSelectAll(items: any) {
    this.spinner.show();
    this.selectedFilterBenefitGroupsItems = items;
    this.selectedFilterBenefitGroups = "";
    for (let i = 0; i < this.selectedFilterBenefitGroupsItems.length; i++) {
      this.selectedFilterBenefitGroups = i == 0 ? this.selectedFilterBenefitGroupsItems[i].id.toString() : this.selectedFilterBenefitGroups + "," + this.selectedFilterBenefitGroupsItems[i].id.toString();
    }
    this.checkAllBenefitGroupsSelected();
  }

  onAllBenefitGroupsDeSelectAll(items: any) {
    this.spinner.show();
    this.checkAllBenefitGroupsSelected();
  }

  checkAllBenefitGroupsSelected() {
    if (this.selectedFilterBenefitGroupsItems.length == this.filterBenefitGroupsCount) {
      this.isFilterBenefitGroupsEnabled = false;
    }
    else {
      this.isFilterBenefitGroupsEnabled = true;
    }
    this.spinner.hide();
  }

  onCostOnlyToggleChange(status: any) {
    this.spinner.show();
    this.isCostShareOnly = status;
    //this.bindAllPlanBenefitGroups();
    if (this.selectedBenifit == 'Premium') {
      this.bindPlanBenfefitDetails();
    } else {
      this.OnBenefitSelect(this.selectedBenifit);
    }
    if (this.isColorCodeSelected == true) {
      this.isColorCodeSelected = false;
      this.valuesFromPython = [];
    }
    this.floatCheck = false;
    this.goToTop();
  }

  OnBenefitSelect(item: string) {        
    if (item != 'Select Benefit') {     
      this.valuesFromPython = [];
      this.selectedBenifit = item;
      this.selectedBenefitModel = [];
      this.selectedBenefitModel = this.benefits[(this.benefits.find(x=>x.benefit == item).id)-1];
      if (this.showPlanCompare) {
        this.spinner.show();
        this.plansBenefits = [];
        this.plansBenifitsList = [];
        this.cols = [];

        let premium: string = '0';
        let tpv: string = '0';
        let oopc: string = '0';
        let enrollments: string = '0';
        let enrollmentGrowth: string = '0';

        this.selectedBenifit == "Premium" ? premium = "1" : premium = "0";
        this.selectedBenifit == "TPV" ? tpv = "1" : tpv = "0";
        this.selectedBenifit == "OOPC" ? oopc = "1" : oopc = "0";
        this.selectedBenifit == "Enrollments" ? enrollments = "1" : enrollments = "0";
        this.selectedBenifit == "Enrollment Growth" ? enrollmentGrowth = "1" : enrollmentGrowth = "0";

        this.basePlan = this.basePlan == '' ? 'Base' : this.basePlan;

        let comparePlansSort: IComparePlansWithOrder = {
          basePlan: this.basePlan,
          comparePlan: this.selectedBidIds.toString(),
          premium: premium,
          tpv: tpv,
          OOPC: oopc,
          enrollment : enrollments,
          enrollmentGrowth: enrollmentGrowth,
          stateId: this.selectedState,
          counties: this.selectedCounty,
          years: this.selectedYears.toString(),
          monthNumber: this.utcServerDateMonth
        }

        this._comparePlansService.getComparePlanBenefitInSortOrderDetails(comparePlansSort, this.isCostShareOnly)
          .subscribe((result: any[]) => {
            if (result.length > 0) {
              this.masterPlansBenefits = [];
              this.masterPlansBenefits = result;
              this.plansBenefits = [];
              if (this.isFilterBenefitGroupsEnabled) {
                this.masterPlansBenefits.forEach(element => {
                  let existItem = [];
                  existItem = this.selectedFilterBenefitGroupsItems.filter((val) => val.benefitGroup === element.sortGroup);
                  if (existItem.length >= 1) {
                    this.plansBenefits.push(element);
                  }
                });
              }
              else {
                this.plansBenefits = this.masterPlansBenefits;
              }
              this.getColumns(this.plansBenefits);
              this.ReClickLink(); 
              this.showCompareButton = false
            }
          }, err => {
            console.log('HTTP Error', err);
            this.spinner.hide();
          });
      }
      else {
        if (this.selectedBenifit == "Premium") {
          this.plans = this.plans.sort((a, b) => { return a.premiumCD > b.premiumCD ? 1 : -1 }); 
        }

        if (this.selectedBenifit == "TPV") {
          this.plans = this.plans.sort((a, b) => { return a.tpv > b.tpv ? 1 : -1 });
        }

        if (this.selectedBenifit == "OOPC") {
          this.plans = this.plans.sort((a, b) => { return a.oopc - b.oopc });
        }

        if (this.selectedBenifit == "Enrollments") {
          this.plans = this.plans.sort((a, b) => { return b.enrollment > a.enrollment ? 1 : -1 });
        }

        if (this.selectedBenifit == "Enrollment Growth") {
          this.plans = this.plans.sort((a, b) => { return b.enrollmentGrowth > a.enrollmentGrowth ? 1 : -1 });
        }
        this.ReClickLink();    
      }
    }
  }

  OnEnrollmentFromPeriodChange(fromPeriod: string) {
    this.selectedEnrollmentFromPeriod = fromPeriod;
    this.fromPeriod = fromPeriod;
    this.selectedEnrollmentToPeriod = this.toPeriod;

    this._plansService.getPlansBetweenPeriods(this.selectedState, this.selectedCounty, this.selectedPlantype, this.selectedSnptype, this.selectedCrosswalk, this.selectedEnrollmentFromPeriod, this.selectedEnrollmentToPeriod)
      .subscribe((result: IPlans[]) => {
        if (result.length > 0) {
          this.plans = result;
          this.copyOfPlans = result;
          this.isEnrollmentSelected = 2;
          this.getChangeInEnrollmentFilters();
          this.FilterAllPlans();
          this.ReClickLink();
        }
      });
    this.ReClickLink();
  }

  OnEnrollmentToPeriodChange(toPeriod: string) {
    this.selectedEnrollmentToPeriod = toPeriod;
    this.toPeriod = toPeriod;
    this.selectedEnrollmentFromPeriod = this.fromPeriod;

    this._plansService.getPlansBetweenPeriods(this.selectedState, this.selectedCounty, this.selectedPlantype, this.selectedSnptype, this.selectedCrosswalk, this.selectedEnrollmentFromPeriod, this.selectedEnrollmentToPeriod)
      .subscribe((result: IPlans[]) => {
        if (result.length > 0) {
          this.plans = result;
          this.copyOfPlans = result;
          this.isEnrollmentSelected = 2;
          this.getChangeInEnrollmentFilters();
          this.FilterAllPlans();
          this.ReClickLink();
        }
      });
    this.ReClickLink();
  }

  OnEnrollmentPeriodChange(period: string) {
    this.CurrentPeriod = period;
    this._plansService.getPlansByPeriod(this.selectedState, this.selectedCounty, this.selectedPlantype, this.selectedSnptype, this.selectedCrosswalk, this.CurrentPeriod)
      .subscribe((result: IPlans[]) => {
        if (result.length > 0) {
          this.plans = result;
          this.copyOfPlans = result;
          this.isEnrollmentSelected = 1;
          this.getFilterValues();
          this.FilterAllPlans();
          this.ReClickLink();
        }
      });
    this.ReClickLink();
  }
  ReClickLink() {
    if (this.isAllClicked == true) {
      this.QuickFilter(0);
    }
    if (this.isTop5Clicked == true) {
      this.QuickFilter(5);
    }
    if (this.isTop10Clicked == true) {
      this.QuickFilter(10);
    }
    if (this.isTop15Clicked == true) {
      this.QuickFilter(15);
    }
  }

  OnPartDChange() {
    this.FilterAllPlans();
    this.ReClickLink();
  }

  OnPartBChange() {
    this.FilterAllPlans();
    this.ReClickLink();
  }

  OnPlanCoverageChange() {
    this.FilterAllPlans();
    this.ReClickLink();
  }

  // OnHealthDedictibleChange() {
  //   this.FilterAllPlans();
  // }

  // OnDrugDeductibleChange() {
  //   this.FilterAllPlans();
  // }

  OnAmbulanceChange() {
    this.FilterAllPlans();
    this.ReClickLink();
  }

  OnComprehensiveDentalChange() {
    this.FilterAllPlans();
    this.ReClickLink();
  }

  OnChiroPractorChange() {
    this.FilterAllPlans();
    this.ReClickLink();
  }

  OnMealChange() {
    this.FilterAllPlans();
    this.ReClickLink();
  }

  OnFitnessChange() {
    this.FilterAllPlans();
    this.ReClickLink();
  }

  OnOTCChange() {
    this.FilterAllPlans();
    this.ReClickLink();
  }

  OnVisionChange() {
    this.FilterAllPlans();
    this.ReClickLink();
  }

  OnHearingChange() {
    this.FilterAllPlans();
    this.ReClickLink();
  }

  OnEmergencyChange() {
    this.FilterAllPlans();
    this.ReClickLink();
  }

  OnTeleHealthChange() {
    this.FilterAllPlans();
    this.ReClickLink();
  }

  OnHomeSupport() {
    this.FilterAllPlans();
    this.ReClickLink();
  }

  OnHomeSafetyChange() {
    this.FilterAllPlans();
    this.ReClickLink();
  }

  OnPersChange() {
    this.FilterAllPlans();
    this.ReClickLink();
  }

  FilterAllPlans() {
    let partD = this.isPremiumChecked == true ? 0 : -1;
    let partB = this.isPartBChecked == true ? 0 : -1;
    let planCoverage = this.isPlanCoverageChecked == true ? 'MA' : 'Test';
    // let healthDeductible = this.isHealthDeductibleChecked == true ? 0 : -1;
    // let drugDeductible = this.isDrugDedictibleChecked == true ? 0 : -1;
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
        // x.healthDeductible != healthDeductible && x.anualDrugDeductible != drugDeductible 
        x.healthDeductible >= this.selectedHDMinValue && x.healthDeductible <= this.selectedHDMaxValue &&
        x.anualDrugDeductible >= this.selectedDDMinValue && x.anualDrugDeductible <= this.selectedDDMaxValue
        && x.premiumCD >= this.selectedPremiumMinValue &&
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
      this.plans = plans1.filter(x => x.partBGiveBack != partB && x.planCoverage != planCoverage &&
        // x.healthDeductible != healthDeductible &&  x.anualDrugDeductible != drugDeductible 
        x.healthDeductible >= this.selectedHDMinValue && x.healthDeductible <= this.selectedHDMaxValue &&
        x.anualDrugDeductible >= this.selectedDDMinValue && x.anualDrugDeductible <= this.selectedDDMaxValue
        && x.premiumCD >= this.selectedPremiumMinValue && x.premiumCD <= this.selectedPremiumMaxValue &&
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
      
      if (this.selectedBenifit == "Enrollments") {
        this.plans = this.plans.sort((a, b) => { return b.enrollment > a.enrollment ? 1 : -1 });
      }

      if (this.selectedBenifit == "Enrollment Growth") {
        this.plans = this.plans.sort((a, b) => { return b.enrollmentGrowth > a.enrollmentGrowth ? 1 : -1 });
      }
    }

    if (this.showAll != 0) {
      this.plans = this.plans.slice(0, this.showAll);
      this.showAll = 0;
    }
    if (this.isSelectAllChecked) {
      this.selectedBidIds = [];
      this.selectedPlanName = [];
      for (var i = 0; i < this.plans.length; i++) {
        this.selectedBidIds.push(this.plans[i].bidId);
        this.selectedPlanName.push(this.plans[i].planName);
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
    this.yoyDropdownSettings = {
      singleSelection: false,
      itemsShowLimit: 2,
      allowSearchFilter: true,
      enableCheckAll: false
    }

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

    this.filterBenefitGroupsDropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'benefitGroup',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
      allowSearchFilter: true
    };
  }

  handleClick(items: any) {
    console.log("Selected Column : ", items);
  }

  QuickFilter(count: number) {
    this.showAll = count;
    if (count == 0) {
      this.isAllClicked = true;
      this.isTop5Clicked = false;
      this.isTop10Clicked = false;
      this.isTop15Clicked = false;
    }
    if (count == 5) {
      this.isAllClicked = false;
      this.isTop5Clicked = true;
      this.isTop10Clicked = false;
      this.isTop15Clicked = false;
    }
    if (count == 10) {
      this.isAllClicked = false;
      this.isTop5Clicked = false;
      this.isTop10Clicked = true;
      this.isTop15Clicked = false;
    }
    if (count == 15) {
      this.isAllClicked = false;
      this.isTop5Clicked = false;
      this.isTop10Clicked = false;
      this.isTop15Clicked = true;
    }

    this.FilterAllPlans();
    // let plans1 = [...this.copyOfPlans];
    // if (count != 0) {
    //   this.plans = plans1.slice(0, count);
    // }
    // else {
    //   this.plans = plans1;
    // }
    // if (this.isSelectAllChecked) {
    //   this.selectedBidIds = [];
    //   for (var i = 0; i < this.plans.length; i++) {
    //     this.selectedBidIds.push(this.plans[i].bidId);
    //   }
    // }

  }

  onBasePlanSelect(selectedPlan: string) {
    this.spinner.show();
    this.closeColorModal.nativeElement.click()
    let compareBidIds1 = [...this.selectedBidIds]
    let comparePlans = compareBidIds1.toString();

    if (this.isColorCodeSelected == false) {
      this.isColorCodeSelected = true;
    }
    var newSelectedPlan = selectedPlan.substr(0, selectedPlan.indexOf(' '));
    this.basePlan = selectedPlan;
    this.valuesFromPython = null;
    this.getCompareBasePlanS(this.basePlan, comparePlans);
    this.floatCheck = false;
    this.goToTop();
  }

  getCompareBasePlanS(basePlan: string, comparePlans: string) {
    let compareWithBasePlan: ICompareWithBasePlans = {
      basePlan: basePlan,
      comparePlan: comparePlans,
      stateId: this.selectedState,
      counties: this.selectedCounty,
      years: this.selectedYears.toString(),
      monthNumber: this.utcServerDateMonth
    }

    this._comparePlansService.getComparePlanCompactBenefitDetails(compareWithBasePlan, this.isCostShareOnly)
      .subscribe((result: any[]) => {
        if (result.length > 0) {
          this.plansBenefits = [];
          this.plansBenifitsList = [];
          this.cols = [];
          //this.plansBenefits = result;
          result.forEach(element => {
            let existItem = [];
            existItem = this.selectedFilterBenefitGroupsItems.filter((val) => val.benefitGroup === element.sortGroup);
            if (existItem.length >= 1) {
              this.plansBenefits.push(element);
            }
          });
          this.getColumns(this.plansBenefits);
          //console.log(this.plansBenefits);
          this.runscript(basePlan, comparePlans, this.userId);
        }
      }, err => {
        console.log('HTTP Error', err);
        this.spinner.hide();
      });
  }

  runscript(basePlan: string, compareBidIds: string, userId: string) {
    this._comparePlansService.runPythonScript(basePlan, compareBidIds, userId).subscribe((result: string) => {
      if (result) {
        this.getValuesfromJsonReturnByPython(result);
      }
    });
  }

  getValuesfromJsonReturnByPython(userId: string) {
    this._comparePlansService.readDataFromJson(userId).subscribe((result: any[]) => {
      if (result) {
        this.valuesFromPython = result;
        this.messageService.add({ severity: 'success', summary: 'Color Code Applied' });
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
    //this.spinner.show();
    this.isYOYSelected = !this.isYOYSelected;
    this.previousBenifitYear = this.previousBenifitYear > this.currentBenifitYear ? this.previousBenifitYear - 2 : this.previousBenifitYear + 2;
    this.updateRowGroupMetaData();
    this.floatCheck = false;
    this.goToTop();
  }

  saveUserInputs(event) {
    if (this.checkValidScenario) { return; }
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
      // IsHealthDeductible: this.isHealthDeductibleChecked,
      // isDrugDeductible: this.isDrugDedictibleChecked,
      HDMin: this.selectedHDMinValue,
      HDMax: this.selectedHDMaxValue,
      DDMin: this.selectedDDMinValue,
      DDMax: this.selectedDDMaxValue,
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
      isSortBy: this.selectedBenifit,
      PlanBenefitGroups: this.selectedFilterBenefitGroups,
      isCostShareOnly: this.isCostShareOnly,
    }

    this._userInputService.addUserInputs(userInputData).subscribe((res: IApiResponse) => {
      if (res.success) {
        this.scenarioAlreadyExists="";
        this.checkValidScenario=false;
        selectedModal == 1 ? this.closeModal.nativeElement.click() : this.closeSaveAsModal.nativeElement.click();
        selectedModal == 1 ? this.SaveScenarioName = "" : this.scenarioName = "";
        this.messageService.add({ severity: 'success', summary: 'Saved successfully' });
        this.bindScenarioNames();
      }
      else {
        this.scenarioAlreadyExists="";
        this.checkValidScenario=false;
        selectedModal == 1 ? this.closeModal.nativeElement.click() : this.closeSaveAsModal.nativeElement.click();
        selectedModal == 1 ? this.SaveScenarioName = "" : this.scenarioName = "";
        this.messageService.add({ severity: 'error', summary: res.error });
        this.scenarioAlreadyExists="";
      }
    })
    this.floatCheck = false;
    this.goToTop();
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
            if (brand == 'Plan Information') {
            }
            else if (brand === previousRowGroup) {
              this.rowGroupMetadata[brand].size++;
            }
            else {
              this.rowGroupMetadata[brand] = { index: i, size: 1 };
            }
          }
          else {
            // if (this.isYOYSelected) {

            let previousRowData = this.plansBenefits[i - 1];
            let previousRowGroup = previousRowData.sortGroup;
            if (brand == 'Plan Information') {
            }
            else if (brand === previousRowGroup) {
              this.rowGroupMetadata[brand].size++;
            }
            else {
              this.rowGroupMetadata[brand] = { index: i, size: 1 };
            }
            //}
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

  capitalizedCase(obj: any) {
    let first = obj.substr(0, 1).toUpperCase();
    return first + obj.substr(1);
  }

  exportExcel() {
    this.floatCheck = false;
    this.goToTop();
    if (this.plansBenefits != null) {
      let plansBenefitCopy = this.isYOYSelected == true ? this.plansBenefits : this.plansBenefits.filter(x => x.year == this.currentBenifitYear);

      let valuesFromPythonList = [];
      let pythonCols: string[];

      let val = plansBenefitCopy[0];
      let col = Object.keys(val);

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet();

      let header = [];
      let headerCount: number = 1;

      col.forEach(h => {
        if (headerCount < 3) {
          worksheet.getColumn(headerCount).width = 45;
          worksheet.getColumn(headerCount).alignment = { wrapText: true, vertical: 'middle' };
        }
        if (headerCount == 3) {
          worksheet.getColumn(headerCount).width = 7;
          worksheet.getColumn(headerCount).alignment = { wrapText: true, vertical: 'middle', horizontal: 'right' };
        }
        if (headerCount > 3) {
          worksheet.getColumn(headerCount).width = 25;
          worksheet.getColumn(headerCount).alignment = { wrapText: true, vertical: 'middle' };
        }

        if (h == "sortGroup") {
          header.push(this.capitalizedCase("benefits group"));
        }
        else {
          header.push(this.capitalizedCase(h));
        }
        headerCount++;
      });

      worksheet.addRow(header);

      if (this.isColorCodeSelected) {
        valuesFromPythonList = this.valuesFromPython;
        pythonCols = Object.keys(valuesFromPythonList[0]);
      }

      if (plansBenefitCopy) {
        let rowIndexCount = 2;
        for (let i = 0; i < plansBenefitCopy.length; i++) {

          let rowData = plansBenefitCopy[i];

          if (i != 0 && this.isYOYSelected && rowData['benefits'] == "Parent Organization") {

          }
          else {
            let newRow = [];
            let isFoundInPythonOutPut = false;
            let tempPythonRow = [];
            let newRowColor = [];
            let count: number = 0;
            let isRowColorable: Boolean = false;

            for (let j = 0; j < col.length; j++) {
              newRowColor.push(null);
            }

            col.forEach(x => {
              newRow.push(rowData[x]);

              if (this.isColorCodeSelected) {
                if (!isFoundInPythonOutPut) {
                  if ((x.toString() == "benefits")) {
                    let checkBenefit = valuesFromPythonList.find((val) => (val.Benefit.toString().trim().replace(' ', '_')) === (rowData[x].toString().trim().replace(' ', '_')));

                    if (checkBenefit != null) {
                      isFoundInPythonOutPut = true;
                      tempPythonRow = checkBenefit;
                    }
                  }
                }
                else {
                  if ((x.toString() != "sortGroup" && x.toString() != "benefits" && x.toString() != "year")) {
                    var bidID = x.substring(x.lastIndexOf("(") + 1, x.length - 1);
                    const cellIndex = pythonCols.findIndex(z => z === bidID.toString());
                    newRowColor[count] = tempPythonRow[pythonCols[cellIndex]];
                  }
                }
              }
              count++;
            });

            const row = worksheet.addRow(newRow);

            if (this.isYOYSelected)
            {
              if (newRow[2] != this.currentBenifitYear) {                               
                
                if(newRow[2] == (this.currentBenifitYear-1))
                {
                  worksheet.getRow(rowIndexCount).fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'F8C4C1' }
                  };
                }

                if(newRow[2] == (this.currentBenifitYear-2))
                {                  
                  worksheet.getRow(rowIndexCount).fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: '81A5E7' }
                  };
                }
              }
            }
            if (this.isColorCodeSelected) {
              if (this.isYOYSelected) {
                if ((newRow[2] == this.currentBenifitYear)) {
                  isRowColorable = true;
                }
                else {
                  isRowColorable = false;
                }
              }
              else {
                isRowColorable = true;
              }

              if (isRowColorable) {
                newRowColor.forEach((element, index) => {

                  if (index > 2) {
                    let tempcell = row.getCell(index + 1);

                    switch (element) {
                      case 0:
                        //do nothing
                        break;

                      case 1:
                        //red                    
                        tempcell.fill = {
                          type: 'pattern',
                          pattern: 'solid',
                          fgColor: { argb: 'FF0000' }
                        }
                        break;

                      case 2:
                        //green
                        tempcell.fill = {
                          type: 'pattern',
                          pattern: 'solid',
                          fgColor: { argb: '92D050' }
                        }
                        break;

                      case 3:
                        //do nothing
                        break;

                      case 4:
                        //gray
                        tempcell.fill = {
                          type: 'pattern',
                          pattern: 'solid',
                          fgColor: { argb: '808080' }
                        }
                        break;
                    }
                  }
                });
              }
            }
            rowIndexCount++;
          }
        }
      }
     
      worksheet.autoFilter = {
        from: 'A1',
        to: {
          row: 1,
          column: col.length
        }
      };

      worksheet.views = [{
        state: 'frozen',
        xSplit: 3,
        ySplit: 1,
        topLeftCell: 'D2',
        activeCell: 'A1'
      }];

      worksheet.getRow(1).font = {
        size: 11,
        bold: true,
        color: { argb: '78338b' }
      };

      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'f4f4f4' }
      };

      workbook.xlsx.writeBuffer().then((plansBenefitCopy: any) => {
        import("file-saver").then(FileSaver => {
          const blob = new Blob([plansBenefitCopy], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
          });
          let EXCEL_EXTENSION = '.xlsx';
          let fileName = "BenefitsFile";
          FileSaver.saveAs(blob, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
        });
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
    this._scenarioService.getScenarioResultsById(id).subscribe((result) => {
      if (result != null) {
        this.spinner.show();
        this.closeOpenModal.nativeElement.click();
        this.userSelectedScenarioResults = result;
        let planTypes = result[0].planTypeId.split(",");
        let snpTypes = result[0].snpTypeId.split(",");
        let crossWalks = result[0].crossWalkId.split(",");
        let benefitName = result[0].isSortBy.split(",");
        let enrollmentSelect = result[0].enrollmentMonth.split(",");
        let enrollmentFromSelect = result[0].enrollmentFromMonth.split(",");
        let enrollmentToSelect = result[0].enrollmentToMonth.split(",");
        // console.log(benefitName);
        // this.OnBenefitSelect(benefitName);
        // this.sortBySelected.push(this.benefits[2]);
        this.selectedBenefitModel = [];
        this.selectedEnrollmentModel = [];
        this.selectedEnrollmentToModel = [];
        this.selectedBenefitModel = this.benefits[(this.benefits.find(x=>x.benefit == benefitName).id)-1];
        this.selectedEnrollmentModel = this.enrollmentPeriod[(this.enrollmentPeriod.find(x=>x.period == enrollmentSelect).id)-1];
        this.selectedEnrollmentToModel = this.enrollmentPeriod[(this.enrollmentPeriod.find(x=>x.period == enrollmentFromSelect).id)-1];
        this.selectedEnrollmentFromModel = this.enrollmentPeriod[(this.enrollmentPeriod.find(x=>x.period == enrollmentToSelect).id)-1];
        this.loadStateValues(result[0].stateId, result[0].salesRegionId, result[0].countyId, planTypes, snpTypes, crossWalks);
      }
    });
    this.floatCheck = false;
    this.goToTop();
  }

  OnConfirmationDeleteScenario(id: number, name: string) {
    this.confirmationService.confirm({
      message: 'Do you want to delete ' + name,
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.spinner.show();
        this._scenarioService.deleteScenarioById(id).subscribe((result) => {
          if (result != null) {
            this.closeOpenModal.nativeElement.click();
            this.spinner.hide();
            if (result == true) {              
              this.bindScenarioNames();
              this.messageService.add({ severity: 'success', summary: name + ' was deleted.' });
            } else {
              this.messageService.add({ severity: 'error', summary: 'Your attempt to delete ' + name + ' could not be completed, Please contact administrator.' });
            }
          }
        });
      }
    });
  }

  loadStateValues(id: number, salesRegionId: string, countyId: string, planTypes: [], snpTypes: string[], crossWalks: string[]) {
    this._stateService.getStates().subscribe((result: IState[]) => {
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

      this.HDMinValue = Math.min.apply(Math, this.plans.map(function (o) { return o.healthDeductible }));
      this.HDMaxValue = Math.max.apply(Math, this.plans.map(function (o) { return o.healthDeductible }));

      this.DDMinValue = Math.min.apply(Math, this.plans.map(function (o) { return o.anualDrugDeductible }));
      this.DDMaxValue = Math.max.apply(Math, this.plans.map(function (o) { return o.anualDrugDeductible }));

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
    //selected user scenario Premium
    this.premiumMinDefaultValue = pMinValue;
    this.premiumMaxDefaultValue = pMaxValue;

    let eMinValue = this.userSelectedScenarioResults[0].enrollmentMin;
    let eMaxValue = this.userSelectedScenarioResults[0].enrollmentMax;
    //selected user scenario enrollment
    this.enrollmentMinDefaultValue = eMinValue;
    this.enrollmentMaxDefaultValue = eMaxValue;

    let eChangeMinValue = this.userSelectedScenarioResults[0].enrollmentChangeMin;
    let eChangeMaxValue = this.userSelectedScenarioResults[0].enrollmentChangeMax;
    //selected user scenario change in enrollment
    this.enrollmentChangeMinDefaultValue = eChangeMinValue;
    this.enrollmentChangeMaxDefaultValue = eChangeMaxValue;

    let mMinValue = this.userSelectedScenarioResults[0].moopMin;
    let mMaxValue = this.userSelectedScenarioResults[0].moopMax;
    //selected user scenario moop slider
    this.moopMinDefaultValue = mMinValue;
    this.moopMaxDefaultValue = mMaxValue;

    let mHDMinValue = this.userSelectedScenarioResults[0].hdMin;
    let mHDMaxValue = this.userSelectedScenarioResults[0].hdMax;
    //selected user scenario hd slider
    this.HDMinDefaultValue = mHDMinValue;
    this.HDMaxDefaultValue = mHDMaxValue;

    let mDDMinValue = this.userSelectedScenarioResults[0].ddMin;
    let mDDMaxValue = this.userSelectedScenarioResults[0].ddMax;
    //selected user scenario dd slider
    this.DDMinDefaultValue = mDDMinValue;
    this.DDMaxDefaultValue = mDDMaxValue;

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

    this.HDRangeValues = [mHDMinValue, mHDMaxValue];
    this.selectedHDMinValue = mHDMinValue;
    this.selectedHDMaxValue = mHDMaxValue;

    this.DDRangeValues = [mDDMinValue, mDDMaxValue];
    this.selectedDDMinValue = mDDMinValue;
    this.selectedDDMaxValue = mDDMaxValue;


  }
  checkRangeDisable()
  {
    if(this.premiumMinDefaultValue==this.premiumMaxDefaultValue)
    {
     this.disableSliderPremium=true;
    }
   if(this.enrollmentMinDefaultValue==this.enrollmentMaxDefaultValue)
    {
     this.disableSliderEnr=true;
    }
   if(this.enrollmentChangeMinDefaultValue==this.enrollmentChangeMaxDefaultValue)
    {
     this.disableSliderChangeEnr=true;
    }
   if(this.moopMinDefaultValue==this.moopMaxDefaultValue)
    {
     this.disableSliderMOOP=true;
    }
   if(this.HDMinDefaultValue==this.HDMaxDefaultValue)
    {
     this.disableSliderHD=true;
    }
   if(this.DDMinDefaultValue==this.DDMaxDefaultValue)
    {
     this.disableSliderDD=true;
    }
    // this.disableSlider=true;
  }

  loadLeftFilterValues() {
    if (this.userSelectedScenarioResults != null) {
      this.isPremiumChecked = this.userSelectedScenarioResults[0].isPartDPremium;
      this.isPartBChecked = this.userSelectedScenarioResults[0].isPartBGiveBack;
      this.isPlanCoverageChecked = this.userSelectedScenarioResults[0].isPlanCoverage;
      // this.isHealthDeductibleChecked = this.userSelectedScenarioResults[0].isHealthDeductible;
      // this.isDrugDedictibleChecked = this.userSelectedScenarioResults[0].isDrugDeductible;
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
      this.isCostShareOnly = this.userSelectedScenarioResults[0].isCostShareOnly;
      let planBenefitGroups = this.userSelectedScenarioResults[0].planBenefitGroups.split(",");
      this.loadAllPlanBenefitGroupsValues(planBenefitGroups);
    }
  }

  loadFilterPlanValues() {
    let partD = this.isPremiumChecked == true ? 0 : -1;
    let partB = this.isPartBChecked == true ? 0 : -1;
    let planCoverage = this.isPlanCoverageChecked == true ? 'MA' : 'Test';
    // let healthDeductible = this.isHealthDeductibleChecked == true ? 0 : -1;
    // let drugDeductible = this.isDrugDedictibleChecked == true ? 0 : -1;
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
        // x.healthDeductible != healthDeductible && x.anualDrugDeductible != drugDeductible 
        x.healthDeductible >= this.selectedHDMinValue && x.healthDeductible <= this.selectedHDMaxValue &&
        x.anualDrugDeductible >= this.selectedDDMinValue && x.anualDrugDeductible <= this.selectedDDMaxValue
        && x.premiumCD >= this.selectedPremiumMinValue &&
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
      this.plans = plans1.filter(x => x.partBGiveBack != partB && x.planCoverage != planCoverage &&
        // x.healthDeductible != healthDeductible && x.anualDrugDeductible != drugDeductible 
        x.healthDeductible >= this.selectedHDMinValue && x.healthDeductible <= this.selectedHDMaxValue &&
        x.anualDrugDeductible >= this.selectedDDMinValue && x.anualDrugDeductible <= this.selectedDDMaxValue
        && x.premiumCD >= this.selectedPremiumMinValue && x.premiumCD <= this.selectedPremiumMaxValue &&
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

    if (this.selectedBenifit == "Enrollments") {
      this.plans = this.plans.sort((a, b) => { return b.enrollment > a.enrollment ? 1 : -1 });
    }

    if (this.selectedBenifit == "Enrollment Growth") {
      this.plans = this.plans.sort((a, b) => { return b.enrollmentGrowth > a.enrollmentGrowth ? 1 : -1 });
    }
    this.spinner.hide();
  }

  loadBidIds() {
    if (this.userSelectedScenarioResults != null) {
      if (this.userSelectedScenarioResults[0].bidId != "") {
        this.selectedBidIds = this.userSelectedScenarioResults[0].bidId.split(",");
      }
      else {
        this.selectedBidIds = [];
        this.selectedPlanName = [];
      }
      this.selectedBidIds.length > 1 ? this.showCompareButton = true : this.showCompareButton = false;
      if (this.showPlanCompare) {
        this.bindPlanBenfefitDetails();
        this.showCompareButton = false;
      }

    }
  }

  checkScenarioName() {
    if (this.SaveScenarioName.trim().length === 0) {
      this.checkValidScenario = true;
      this.scenarioAlreadyExists = "Scenario name is required";
    }
    else if (this.scenarioNamesOnly.includes(this.SaveScenarioName.toLowerCase())) {
      this.checkValidScenario = true;
      this.scenarioAlreadyExists = "Scenario name already exists!";
    }
    else {
      this.checkValidScenario = false;
      this.scenarioAlreadyExists = "";
    }
  }

  checkSaveASScenarioName() {
    if (this.scenarioName.trim().length === 0) {
      this.checkValidScenario = true;
      this.scenarioAlreadyExists = "Scenario name is required";
    }
    else if (this.scenarioNamesOnly.includes(this.scenarioName.toLowerCase())) {
      this.checkValidScenario = true;
      this.scenarioAlreadyExists = "Scenario name already exists!";
    }
    else {
      this.checkValidScenario = false;
      this.scenarioAlreadyExists = "";
    }
  }

  clearLeftSideItems() {
    this.showPlanCompare = false;
    this.showCompareButton = false;
    this.selectedBidIds = [];
    this.selectedPlanName = [];
    this.plansBenefits = [];
    this.plansBenifitsList = [];
    this.valuesFromPython = [];
    this.isPremiumChecked = false;
    this.isPartBChecked = false;
    this.isPlanCoverageChecked = false;
    // this.isHealthDeductibleChecked = false;
    // this.isDrugDedictibleChecked = false;
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