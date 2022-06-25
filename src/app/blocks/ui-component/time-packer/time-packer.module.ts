import { NgModule, } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {TimePackerComponent} from './time-packer.component';
import { SharedModule } from '../../../shared/shared.module';


const routes: Routes = [
    { path: 'timepacker', component: TimePackerComponent }
   
];

@NgModule({
    imports: [RouterModule.forChild(routes),
    SharedModule],
    declarations: [
        TimePackerComponent
    ],
    exports: [RouterModule]
})
export class TimePackerModule {


}


