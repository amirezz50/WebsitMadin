import { Component, OnInit, ViewChild } from '@angular/core';
import { PortalAuthService } from '../portal-login/portal-auth.service';

import { TranslateService } from '@ngx-translate/core';
import { PortalPatientProfileEditComponent } from '../portal-patient-profile-edit/portal-patient-profile-edit.component';
import { Subject } from 'rxjs';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Patient } from '../portal-login/portal-login-interface';

@Component({
  selector: 'app-portal-patient-profile',
  templateUrl: './portal-patient-profile.component.html',
  styleUrls: ['./portal-patient-profile.component.css']
})
export class PortalPatientProfileComponent implements OnInit {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  patientData: any = <any>{};
  editPatient: Patient = <Patient>{};


  constructor(private _auth: PortalAuthService, public translate: TranslateService) { }
  egyptDate: string = '';
  ksaDate: string = '';
  ngOnInit() {
    this.patientData = this._auth.getSessionPatient;
    const date = new Date(this.patientData.birthDate);
    const options:any = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    this.egyptDate = date.toLocaleDateString("ar-EG", options); // الأربعاء، ٥ فبراير ٢٠٢٠
    this.ksaDate = date.toLocaleDateString("ar-SA", options); //الأربعاء، ١١ جمادى الآخرة ١٤٤١ هـ

  }

  
  save() {
    this.editPatient.code = this._auth.getPatientCode;
    if (this.editPatient.code) {
      this._auth.updateUserData(this.editPatient)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(msg => {
          if (msg && msg.returnFlag) {
            let pat = this._auth.getSessionPatient;
            pat.fullAddressAr = this.editPatient.fullAddressAr;
            pat.fullAddressEn = this.editPatient.fullAddressEn;
            pat.mobile = this.editPatient.mobile;
            sessionStorage.setItem('CURRENT_PATIENT', JSON.stringify(pat));
            this.patientData = this._auth.getSessionPatient;
            this.editPatient = <Patient>{};
          }
        });
    }
  }
  onClicked(e: number): void {
    switch (e) {
      case 1: //save code
        this.save();
        break;
    }
  }
  openForEdit() {
    this.editPatient.mobile=this.patientData.mobile;
    this.editPatient.fullAddressAr=this.patientData.fullAddressAr;
    this.editPatient.changeType = 2;
    //this.save()


  }



}
