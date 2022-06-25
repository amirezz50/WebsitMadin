
import { NgModule } from '@angular/core';
import { LabTestPrintComponent } from './lab-test-print.component';
import { LabTestPrintMasterComponent } from './lab-test-print-master.component';
import { LabTestPrintView3Component } from './lab-test-print-view3.component';
import { LabTestPrintPatientComponent } from './lab-test-print-patient/lab-test-print-patient.component';
import { LabTestCovidPrintComponent } from './lab-test-covid-print.component';
import { LabTestPrintView4Component } from './lab-test-print-view4.component';
import { LabTestPrintView1Component } from './lab-test-print-view1.component';
import { SharedModule } from '../../shared/shared.module';
import { BlocksModule } from '../../blocks/blocks.module';
import { LabTestService } from './lab-test.service';
import { PrintComponent } from '../../print-component';
import { ExportAsService } from 'ngx-export-as';
@NgModule({
    imports: [
        SharedModule,
        BlocksModule
    ],
    declarations: [
        LabTestPrintComponent,
        LabTestPrintMasterComponent ,
        LabTestPrintView1Component,
        LabTestPrintView3Component,
        LabTestPrintView4Component,
        LabTestPrintPatientComponent,LabTestCovidPrintComponent,PrintComponent
    ],
    exports: [
        LabTestPrintComponent,
        LabTestPrintView1Component,
        LabTestPrintMasterComponent,
        LabTestPrintView3Component,
        LabTestPrintView4Component,
        LabTestPrintPatientComponent,LabTestCovidPrintComponent,PrintComponent
    ],
    providers: [
        LabTestService,ExportAsService
    ], entryComponents: [
        LabTestPrintMasterComponent
      ],
})

export class LabTestPrintModule { }
