import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
//services

import { CountsDashboardComponent } from './counts-dashboard.component';
import { AppCodeGroup, ControlsParams } from '../../shared';


@NgModule({
    declarations: [
      CountsDashboardComponent
    ],
    imports: [
        CommonModule
    ],
    exports: [
        RouterModule,
      CountsDashboardComponent
    ],
    providers: [
    ]
})
export class CountsDashBoardModule {
}
