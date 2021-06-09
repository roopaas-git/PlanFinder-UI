import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

//Components Module
import { ComponentsModule } from '../components/component.module';
import { PlanfinderComponent } from './planFinder/planfinder.component';
import { TableModule } from 'primeng/table';
import { SliderModule } from 'primeng/slider';
import { ToastModule } from 'primeng/toast';
import { NgxSpinnerModule } from 'ngx-spinner';

import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { SampleGridComponent } from './TestGrid/sample-grid.component';
import { TestComponent } from './Test/test.component';
import { TableComponent } from './tableRowSpan/table.component';
import {​​​​​​​​ UiSwitchModule }​​​​​​​​ from'ngx-toggle-switch';
import {DropdownModule} from 'primeng/dropdown';
@NgModule({
    declarations: [
        PlanfinderComponent,
        SampleGridComponent,
        TestComponent,
        TableComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        TableModule,
        SliderModule,
        NgMultiSelectDropDownModule,
        ComponentsModule,
        ToastModule,
        NgxSpinnerModule,
        UiSwitchModule,
        DropdownModule
    ],
    exports: [],
    providers: []
})

export class ViewModule { }