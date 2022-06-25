import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ngxCharts } from './ngx-charts.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@NgModule({
    declarations: [
      ngxCharts
    ],
    imports: [
        CommonModule,
        NgxChartsModule
    ],
    exports: [
      ngxCharts
    ]
})
export class ChartsModule {
}
