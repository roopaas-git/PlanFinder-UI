import { NgModule } from '@angular/core';
import { StateService } from './state.service';
import { CountyService } from './county.service';
import { PlantypeService } from './plantype.service';
import { SnptypeService } from './snptype.service';
import { PlansService } from './plans.service';
import { CarService } from './car.service';
import { SalesRegionService } from './salesRegion.service';
import { CrosswalkService } from './crosswalk.service';
import { UserService } from './user.service';
import { DataSharingService } from './datasharing.service';
import { BenefitService } from './benefit.service';
import { EnrollmentService } from './enrollment.service';
import { ComparePlansservice } from './comparePlans.service';
import { MessageService } from 'primeng/api';
import { UserInputsService } from './userInputs.service';
import { ScenarioService } from './scenario.service';

@NgModule({
    providers: [StateService,
        CountyService,
        PlantypeService,
        SnptypeService,
        PlansService,
        CarService,
        SalesRegionService,
        CrosswalkService,
        UserService,
        DataSharingService,
        BenefitService,
        EnrollmentService,
        ComparePlansservice,
        UserInputsService,
        ScenarioService,
        MessageService
    ]
})

export class ServicesModule { }