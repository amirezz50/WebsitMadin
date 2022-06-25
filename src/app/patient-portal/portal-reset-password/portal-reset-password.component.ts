import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { PortalAuthService } from '../portal-login/portal-auth.service';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Patient } from '../portal-login/portal-login-interface';
import { encodeStr } from '../portal-login/portal-login.component';

@Component({
  selector: 'portal-reset-password',
  templateUrl: './portal-reset-password.component.html',
  styleUrls: ['./portal-reset-password.component.css']
})
export class PortalResetPasswordComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  patientForm: FormGroup;
  editPatient: Patient = <Patient>{};
  originalPassword: string = '';

  constructor(
    private _auth: PortalAuthService,
    private _toast: ToastrService,
    private _router: Router,
    private _fb: FormBuilder) { }

  ngOnInit() {
    this.originalPassword = this.decodeStr(sessionStorage.getItem(encodeStr('_logPassw0rd')));
    this.initForm();
  }
  decodeStr(str: string): string {
    return window.atob(str);
  }
  initForm() {
    this.patientForm = this._fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  MatchConfirom(value1: any, value2: any) {
    let control = this.patientForm.controls['currentPassword'];
    if (value1 === value2) {
      return control.setErrors(null);
    } else {
      return control.setErrors({ notEquivalent: true });
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  showCurrent: boolean = false;
  showNew: boolean = false;
  showConfirm: boolean = false;
  changeVisiblity(input: any, type: number) {
    input.type = input.type === 'password' ? 'text' : 'password';
    if (type == 1) {
      this.showCurrent = !this.showCurrent;
    } else if (type == 2) {
      this.showNew = !this.showNew;
    } else {
      this.showConfirm = !this.showConfirm;
    }
  }

  onClicked(e: number): void {
    switch (e) {
      case 1: //save code
        this.save();
        break;
    }
  }
  save() {
    let formObj = this.patientForm.value;
    this.editPatient.code = this._auth.getPatientCode;
    this.editPatient.password = formObj.newPassword;
    this.editPatient.changeType = 1;

    if (this.editPatient.code) {
      this._auth.resetPassword(this.editPatient)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(
          res => {
            if (res && res.returnFlag) {
              if (confirm('هل تريد تسجيل الخروج للتأكد من تعديل البيانات!')) {
                this._auth.clearCache();
              } else {
                sessionStorage.setItem(window.btoa('_logPassw0rd'), window.btoa(this.editPatient.password));
                this._router.navigateByUrl('/portal/home');
              }
            }
          });
    }
  }
}

