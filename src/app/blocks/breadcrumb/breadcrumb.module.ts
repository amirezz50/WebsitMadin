import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
//services

import { BreadcrumbComponent } from './breadcrumb.component';
import { AppCodeGroup, ControlsParams } from '../../shared';


@NgModule({
    declarations: [
        BreadcrumbComponent
    ],
    imports: [
        CommonModule
    ],
    exports: [
        RouterModule,
        BreadcrumbComponent
    ],
    providers: [
    ]
})
export class BreadcrumbModule {
}
