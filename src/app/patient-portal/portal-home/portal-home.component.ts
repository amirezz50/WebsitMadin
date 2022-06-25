import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { mergeMap, takeUntil } from 'rxjs/operators';
import { PortalAuthService } from '../portal-login/portal-auth.service';
import { PortalHomeService } from './portal-home.service';

@Component({
  selector: 'portal-home',
  templateUrl: './portal-home.component.html',
  styleUrls: ['./portal-home.component.css']
})
export class PortalHomeComponent implements OnInit {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  patientInformationNO: any = {}
  patientData: any[] = []
  constructor(private _router: Router, public _authService: PortalAuthService
    , private PortalHomeService: PortalHomeService) {
    document.getElementById('index_body').style.background = '#fff';
  }
  ngOnInit() {
    this.getAvailableDoctors()
  }

  getAvailableDoctors() {
    let patient: any = {}
    patient.patCode = this._authService.getPatientCode;
    patient.serial = 1
    this.PortalHomeService.getPortalPatientDashboard(patient)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.patientInformationNO = res.data[0]
        this.patientData = res.data1
      })
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
