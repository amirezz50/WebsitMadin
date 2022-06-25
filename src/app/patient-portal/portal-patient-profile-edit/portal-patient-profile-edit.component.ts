import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PortalAuthService } from '../portal-login/portal-auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { Patient } from '../portal-login/portal-login-interface';

@Component({
  selector: 'app-portal-patient-profile-edit',
  templateUrl: './portal-patient-profile-edit.component.html',
  styleUrls: ['./portal-patient-profile-edit.component.css']
})
export class PortalPatientProfileEditComponent implements OnInit {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  patientForm: FormGroup;
  editPatient: Patient = <Patient>{};

  constructor(
    private _auth: PortalAuthService,
    private _toast: ToastrService,
    private _router: Router,
    private _fb: FormBuilder,
    translate: TranslateService
  ) { }

  ngOnInit() {
    this.initForm();

  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.patientForm.reset();
  }
  initForm() {
    this.patientForm = this._fb.group({
      addressAr: ['', Validators.required],
      addressEn: ['', Validators.required],
      mobile: ['', Validators.required]
    });
  }
  save() {
    let formObj = this.patientForm.value;
    this.editPatient.changeType = 2;
    this.editPatient.code = this._auth.getPatientCode;
    this.editPatient.fullAddressAr = formObj.addressAr;
    this.editPatient.fullAddressEn = formObj.addressEn;
    this.editPatient.mobile = formObj.mobile;

    if (this.editPatient.code) {
      this._auth.updateUserData(this.editPatient)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(msg => {
         
          if (msg && msg.returnFlag) {
           
            let pat = this._auth.getSessionPatient;
            pat.fullAddressAr='';
            pat.mobile= null;
            pat.fullAddressAr = this.editPatient.fullAddressAr;
            pat.fullAddressEn = this.editPatient.fullAddressEn;
            pat.mobile = this.editPatient.mobile;
            this.editPatient = <Patient>{};
            this.patientForm.reset();
            const _curentPopup = <HTMLElement>document.getElementById('PortalPatientProfileEditComponent');
                if (_curentPopup) {
                  _curentPopup.click();
                }

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



}

