import { DateHijri } from './date-hijri/date-hijri.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbDatepickerModule } from '../ng-bootstrap/datepicker/datepicker.module';
import { PaginatorModule } from './ngPrime/paginator/paginator';
import { HighLightPipe } from './pipes/searchWardsHighlighted.pipe';
import { FilterTextComponent } from './filter-text/filter-text.component';
import { StepperModule } from './stepper/stepper.module';
import { ModalContainerModule } from './ui-component/modal-container/modal-container.module'
// pipes 
import { ActiveListPipe } from './pipes/active.list.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { SortByPropertyPipe } from './pipes/sort-by-property-pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ObjListFilterPipeModule } from '../blocks/pipes/obj-list-filter.pipe';
import { BreadcrumbModule } from './breadcrumb/breadcrumb.module';
import { VerticalList } from './vertical-list/vertical-list.component';
import { HttpGeneralService } from '../shared/http-general.service';
import { PateintBannerService } from './patientbanner/patient-banner.service';
import { PatientBannerModule } from './patientbanner/patient-banner.component';
import { MailComponent } from './mail/mail/mail.component';
//import { EmployeesPannerComponent } from './employee-panner-component/emloyee_panner.component';
import { FileUploadModule } from './file-upload/file-upload.component';
import { CKEditorModule } from 'ng2-ckeditor';
import { MailService } from './mail/mail/mail.service';
import { PatientBloodTypeRhPopUpComponent } from './patient-bloodType-rh-popup/patient-bloodType-rh-popup.component';
import { SharedModule } from '../shared';
import { MatchValueDirective } from './match-value/match-value.directive';
import { EmrSelectizeComponent } from './emr-selectize/emr-selectize.component';
import { SelectizeService } from './selectize/selectize.service';
import { SanabelTooltipComponent } from './sanabel-tooltip/sanabel-tooltip.component';
import { SanabelTooltipDirective } from './sanabel-tooltip/sanabel-tooltip.directive';
import { SanabelTooltipModule } from './sanabel-tooltip/sanabel-tooltip.module';

//import { PatientBloodTypeRhPopUpModule, PatientBloodTypeRhPopUpComponent } from './patient-bloodType-rh-popup/patient-bloodType-rh-popup.component';
// import { ChartsMod } from './charts/charts.component';

@NgModule({
  imports: [
    CommonModule,
    StepperModule,
    BreadcrumbModule,
    PatientBannerModule,
    ModalContainerModule,
    FormsModule,
    NgbDatepickerModule,
    ReactiveFormsModule,
    ObjListFilterPipeModule,
    FileUploadModule,
    TranslateModule.forChild(),
    CKEditorModule,
    SharedModule,
    SanabelTooltipModule
    //PatientBloodTypeRhPopUpModule
  ],
  declarations: [
    FilterTextComponent,
    // pipes 
    ActiveListPipe,
    HighLightPipe,
    SortByPropertyPipe,
    DateHijri,
    VerticalList,
    MatchValueDirective,
    EmrSelectizeComponent

  ],
  exports: [
    PaginatorModule,
    StepperModule,
    BreadcrumbModule,
    ModalContainerModule,
    DateHijri,
    FilterTextComponent,
    PatientBannerModule,
    ActiveListPipe,
    HighLightPipe,
    VerticalList,
    ObjListFilterPipeModule,
    MatchValueDirective,
    EmrSelectizeComponent,
    SanabelTooltipModule
  ],
  providers: [
    PateintBannerService,
    SelectizeService
  ],
  entryComponents: [
    PatientBloodTypeRhPopUpComponent
  ]
})

export class BlocksModule { }
