import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PortalLoginComponent } from './portal-login/portal-login.component';
import { PortalHomeComponent } from './portal-home/portal-home.component';
import { PatientPortalComponent } from './patient-portal.component';
import { PortalVisitsHistoryComponent } from './portal-visits-history/portal-visits-history.component';
import { PortalNewReservationComponent } from './portal-new-reservation/portal-new-reservation.component';
import { PortalPatServicesHistoryComponent } from './portal-pat-services-history/portal-pat-services-history.component';
import { PortalResetPasswordComponent } from './portal-reset-password/portal-reset-password.component';
import { PortalReservationsHistoryComponent } from './portal-reservations-history/portal-reservations-history.component';
import { PortalPatientProfileComponent } from './portal-patient-profile/portal-patient-profile.component';
import { PortalPatientProfileEditComponent } from './portal-patient-profile-edit/portal-patient-profile-edit.component';
import { PortalUserNotificationComponent } from './portal-user-notification/portal-user-notification.component';
import { PortalRegisterComponent } from './portal-register/portal-register.component';
import { PortalRxHistoryComponent } from './portal-rx-history/portal-rx-history.component';
import { PortalNewOrderComponent } from './portal-new-order/portal-new-order.component';
import { LabTestPrintMasterComponent } from './lab-test-print/lab-test-print-master.component';
import { PrintRxComponent } from './print-rx/print-rx.component';
import { PortalPatExaminationHistoryComponent } from './portal-pat-examination-history/portal-pat-examination-history.component';
import { PortalPaymentComponent } from './portal-payment/portal-payment.component';

const routes: Routes = [
  {
    path: '',
    component: PatientPortalComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'portal' },

      { path: 'login', component: PortalLoginComponent },
      { path: 'register', component: PortalRegisterComponent },
      { path: 'home', component: PortalHomeComponent },
      { path: 'visits-history', component: PortalVisitsHistoryComponent },
      { path: 'new-reservation', component: PortalNewReservationComponent },
      { path: 'pat-services', component: PortalPatServicesHistoryComponent },
      { path: 'pat-examination', component: PortalPatExaminationHistoryComponent },
      { path: 'rx-history', component: PortalRxHistoryComponent },
      { path: 'pat-reset-password', component: PortalResetPasswordComponent },
      { path: 'reservations-history', component: PortalReservationsHistoryComponent },
      { path: 'patient-profile', component: PortalPatientProfileComponent },
      { path: 'patient-profile-edit', component: PortalPatientProfileEditComponent },
      { path: 'portal-user-notification', component: PortalUserNotificationComponent },
      { path: 'printResult', component: LabTestPrintMasterComponent },
      { path: 'printRx', component: PrintRxComponent },
      { path: 'new-order', component: PortalNewOrderComponent },
      { path: 'portal-payment', component: PortalPaymentComponent },

      { path: '**', redirectTo: '404', data: { title: 'Bee - Not Fount' } }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientPortalRoutingModule { }
