import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { PcHeaderFiltersComponent } from './pc-header-filters/pc-header-filters.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { PcPlanComponent } from './pc-plan/pc-plan.component';
import { PcPlanCompareComponent } from './pc-plan-compare/pc-plan-compare.component';
import { PcSidebarComponent } from './pc-sidebar/pc-sidebar.component';
import { SliderModule } from 'primeng/slider';

@NgModule({
    declarations: [
        HeaderComponent,
        PcHeaderFiltersComponent,
        PcPlanComponent,
        PcPlanCompareComponent,
        PcSidebarComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        NgMultiSelectDropDownModule,
        SliderModule
    ],
    exports: [
        HeaderComponent,
        PcHeaderFiltersComponent,
        PcPlanComponent,
        PcPlanCompareComponent,
        PcSidebarComponent
    ],
    providers: []
})

export class ComponentsModule { }