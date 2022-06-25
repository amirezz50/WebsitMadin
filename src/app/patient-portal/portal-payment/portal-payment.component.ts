import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UserSessionService } from '../../app-user-session.service';
import { AlertService } from '../../shared/notify-and-alert.service';
import { PortalAuthService } from '../portal-login/portal-auth.service';
import { PortalNewReservationService } from '../portal-new-reservation/portal-new-reservation.service';

@Component({
  selector: 'app-portal-payment',
  templateUrl: './portal-payment.component.html',
  styleUrls: ['./portal-payment.component.css']
})
export class PortalPaymentComponent implements OnInit {
  doctorsNewReservation: any;
  doctor:any;
  constructor(
    private _userSession: UserSessionService,
    public translate:TranslateService,
    private _router: Router,
    private _AlertService: AlertService,
    private _newReservation: PortalNewReservationService,
    private _auth: PortalAuthService
  ) { }
  ngOnInit() {
    this.getDoctorFromNewReservation();
  }
  getDoctorFromNewReservation() {
    this.doctorsNewReservation = this._userSession.getSessionKey("getDoctor");
    this.doctor=this.doctorsNewReservation.obj
  }








  
  // save(){
  //   this._newReservation.addPatientReservation(this.doctorsNewReservation)
  //   .subscribe((con) => {
  //     if (con.returnFlag == true) {
  //       if (con.data && con.data.length > 0 && con.data[0].visitSerial > 0) {
  //         sessionStorage.setItem('CURRENT_VISIT_' + this.doctorsNewReservation.obj.patientCode, JSON.stringify({
  //           visitSerial: con.data[0].visitSerial,
  //           docId: this.doctorsNewReservation.obj.doctorCode,
  //           specialityId: this.doctorsNewReservation.obj.specialCode,
  //           _date: this.doctorsNewReservation.obj.startTime
  //         }));
  //         this._router.navigateByUrl('/portal/reservations-history');
  //       }
  //       if (con && con.data2 && con.data2.length > 0) {
  //         this._AlertService._invokeAlertsMesseages(con.data2, '', 'addPatientReservation');
  //       }
  //     }
  //   }, error => console.log(error),
  //     () => {
  //       null
  //     }

  //   );
  // }


}
