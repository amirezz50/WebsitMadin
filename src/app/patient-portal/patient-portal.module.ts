import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { BlocksModule } from '../blocks/blocks.module';
import { PatientPortalRoutingModule } from './patient-portal.routing';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';

import { PatientPortalComponent } from './patient-portal.component';
import { PortalLoginComponent } from './portal-login/portal-login.component';
import { PortalAuthService } from './portal-login/portal-auth.service';
import { PortalHomeComponent } from './portal-home/portal-home.component';
import { PortalVisitsHistoryService } from './portal-visits-history/portal-visits-history.service';
import { PortalVisitsHistoryComponent } from './portal-visits-history/portal-visits-history.component';
import { PortalNewReservationComponent } from './portal-new-reservation/portal-new-reservation.component';
import { PortalPatServicesHistoryComponent } from './portal-pat-services-history/portal-pat-services-history.component';
import { PortalNewReservationService } from './portal-new-reservation/portal-new-reservation.service';
//import { TimeSlotPickerModule } from '../blocks/timeSlotPicker/timeSlotPicker.component';
import { PortalResetPasswordComponent } from './portal-reset-password/portal-reset-password.component';
import { PortalReservationsHistoryComponent } from './portal-reservations-history/portal-reservations-history.component';
import { PortalPatientProfileComponent } from './portal-patient-profile/portal-patient-profile.component';
import { PortalPatientProfileEditComponent } from './portal-patient-profile-edit/portal-patient-profile-edit.component';
import { PortalUserNotificationComponent } from './portal-user-notification/portal-user-notification.component';
import { PortalRegisterComponent } from './portal-register/portal-register.component';
import { PortalRxHistoryComponent } from './portal-rx-history/portal-rx-history.component';
import { PortalNewOrderComponent } from './portal-new-order/portal-new-order.component';
import { IdentityTypesComponent, IdentityTypeService } from '../blocks';
import { PortalUniqueDoctorsComponent } from './portal-unique-doctors/portal-unique-doctors.component';
import { TimeSlotPickerModule } from '../blocks/timeSlotPicker/TimeSlotPicker.module';
import { PortalContractListComponent } from './portal-contracts/portal-contract-list.component';
import { PortalContractComponent } from './portal-contracts/portal-contract.component';
import { PortalTherapeuticCardsService } from './portal-contracts';
import { PortalTimeSlotPickerComponent } from './portal-time-slot-picker/portal-time-slot-picker.component';
import { docuMangeNewgModule } from '../docu-manage-new/docu-manage-new.module';
import { ServiceHistoryService } from '../portalServicesUsed/service-history.service';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';
import { LabTestPrintModule } from './lab-test-print/lab-test-print.module';
import { PrintRxComponent } from './print-rx/print-rx.component';
import { PortalPatExaminationHistoryComponent } from './portal-pat-examination-history/portal-pat-examination-history.component';
import { PortalPaymentComponent } from './portal-payment/portal-payment.component';
// AoT requires an exported function for factories
export function createTranslateLoader(http: HttpClient) { 
  return new TranslateHttpLoader(http); 
} 

@NgModule({
  declarations: [
    PatientPortalComponent,
    PortalLoginComponent,
    PortalHomeComponent,
    PortalVisitsHistoryComponent,
    PortalNewReservationComponent,
    PortalPatServicesHistoryComponent,
    PortalPatExaminationHistoryComponent,
    PortalResetPasswordComponent,
    PortalReservationsHistoryComponent,
    PortalPatientProfileComponent,
    PortalPatientProfileEditComponent,
    PortalUserNotificationComponent,
    PortalRegisterComponent,
    PortalRxHistoryComponent,
    PortalNewOrderComponent,
    PortalUniqueDoctorsComponent,
    PortalContractListComponent,
    PortalContractComponent,
    PortalTimeSlotPickerComponent,
    PrintRxComponent,
    PortalPaymentComponent
  ],
  
  imports: [
    CommonModule,
    PatientPortalRoutingModule,
    SharedModule,
    BlocksModule,
    TimeSlotPickerModule,
    NgxQRCodeModule,
    docuMangeNewgModule,
    IdentityTypesComponent,
    NgxPaginationModule,
    LabTestPrintModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient],
        
      }
    })
  ],
  providers: [
    PortalAuthService,
    PortalVisitsHistoryService,
    PortalVisitsHistoryService,
    PortalNewReservationService,
    PortalTherapeuticCardsService,
    ServiceHistoryService,
    IdentityTypeService
  ],
  entryComponents: [
    PortalPatientProfileEditComponent
  ],
})
export class PatientPortalModule { }
