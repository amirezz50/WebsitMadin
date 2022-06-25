import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
//services
import { StepperService, AppCodes } from './stepper.service';
import { StepperComponent } from './stepper.component';

const routes: Routes = [
    { path: 'stepper', component: StepperComponent }
]


@NgModule({
    declarations: [
        StepperComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule,
        StepperComponent
    ],
    providers: [
        StepperService
    ]
})
export class StepperModule {
}
