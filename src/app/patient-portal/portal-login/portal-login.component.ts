import { Component, OnInit, HostListener, OnDestroy, Inject } from '@angular/core';
import { LoginViewModel, UserSessionService } from '../../shared';
import { ToastService } from '../../blocks';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { PortalAuthService } from './portal-auth.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DOCUMENT } from '@angular/common';
import { Patient } from './portal-login-interface';

@Component({
  selector: 'app-portal-login',
  templateUrl: './portal-login.component.html',
  styleUrls: ['./portal-login.component.css']
})
export class PortalLoginComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  loginModel: LoginViewModel = <LoginViewModel>{};
  authResult: boolean = true;
  editPatient: any = <any>{};
  currentLangFlag: string;
  activeStep: number = 1;


  showForgetPass: boolean;
  constructor(
    public translate: TranslateService,
    private _router: Router,
    private _fb: FormBuilder,
    private _toastService: ToastService,
    private _authService: PortalAuthService,
    @Inject(DOCUMENT) private document,
    private _userService: UserSessionService) {
  }

  ngOnInit() {



    if (this._authService.isLogged()) {
      this._router.navigateByUrl('/portal/home');
    }

  }


  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  @HostListener('document:keydown', ['$event'])
  hotkeys(event) {
    let text = event.key;
    if (text == 'Enter') {
      this.login();
      event.preventDefault();
    }
  }

  login() {
    if ((this.loginModel.userName == undefined || this.loginModel.userName == null || !this.loginModel.userName.replace(/\s/g, '').length) ||
      (this.loginModel.password == undefined || this.loginModel.password == null || !this.loginModel.password.replace(/\s/g, '').length)) {
      this._toastService.activateMsg('WARNINGUSERNAMEPASSWORD');
      return;
    }
    this._authService.login(this.loginModel)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        u => {
          this.authResult = u;
        },
        error => console.error(error),
        () => {
          this.errorMsg = '';
          let tempUser = JSON.parse(sessionStorage.getItem('currentPatient'));
          let loginErrors = JSON.parse(sessionStorage.getItem('loginErrors'));
          this._userService.regPatCode = tempUser && tempUser.code ? tempUser.code : null
          this._userService.setSessionKey('regPatMainData', tempUser);

          if (this.authResult) {
            this.getPatientData(tempUser['code']);
          } else {
            this.errorMsg = "اسم المستخدم او كلمة المرور غير صحيح";
            if (loginErrors.messageCode == -100) {
              this.errorMsg = "اسم المستخدم غير صحيح";
            } else if (loginErrors.messageCode == -101) {
              this.errorMsg = "كلمة المرور غير صحيحة";
            } else if (loginErrors.messageCode == -102) {
              this.errorMsg = "هذا المستخدم غير فعال";
            }
            this._toastService.toastMsg(this.errorMsg, 'حدث خطأ', 'Error');
          }
        });
  }
  errorMsg: string = '';
  getPatientData(patCode: any) {
    let patObj: Patient = <Patient>{};
    patObj.offset = 0;
    patObj.pageSize = 20;
    patObj.code = patCode;
    this._authService.searchPatients(patObj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        patient => {
          this.editPatient = patient ? patient.data ? patient.data[0] : <any>{} : <any>{};
          let contractObj = patient ? patient.data3 ? patient.data3[0] : <any>{} : <any>{};
          if (contractObj)
            sessionStorage.setItem('PATIENT_CONTRACT', JSON.stringify(contractObj));

          if (this.editPatient) {
            sessionStorage.setItem('CURRENT_PATIENT', JSON.stringify(this.editPatient));
            let x = encodeStr('_logPassw0rd');
            let y = encodeStr(this.loginModel.password);
            sessionStorage.setItem(x, y);
            this._router.navigateByUrl('/portal/home');
          }
        });
  }

  /////////////////////////////////////// new section for recovery account
  //properties
  recoveryPhone: string;
  loading: boolean = false;
  activationCode: FormControl = new FormControl('', Validators.compose([
    Validators.required,
    Validators.minLength(5)
  ]));

  passwordForm: FormGroup;

  // methods
  async sendActivationCode() {
    if (!this.recoveryPhone) {
      return false;
    }

    this.loading = true;
    // let activationCode = String(Math.floor(Math.random() * 965418));

    await this._authService.checkRecoveryAccount({ mobile: this.recoveryPhone, registerStep: 1 })
      .then(res => {
        if (res && res.data && res.data.length) {
          console.log('check mobile => ', res);
          this.activeStep = 2;
          localStorage.setItem('TEMP_MOBILE', JSON.stringify({ mobile: this.recoveryPhone, code: res.data[0].code }));
          this.loading = false;
        } else {
          this.loading = false;
          this._toastService.toastMsg('عذرا رقم الهاتف او اسم المستخدم غير موجود', 'خطأ', 'Warn');
        }
      });
  }

  async activateAccount() {
    if (this.activationCode.invalid) {
      this._toastService.toastMsg('من فضلك حاول مرة اخري', 'خطأ', 'Error');
      return;
    }

    this.loading = true;
    let activationCode = this.activationCode.value;
    let mobile = JSON.parse(localStorage.getItem('TEMP_MOBILE')).mobile;

    await this._authService.checkRecoveryAccount({ activationCode, mobile, registerStep: 2 })
      .then(res => {
        if (res && res.data.length > 0) {
          this.updateLocalStorageObj(activationCode);
          this.initPasswordForm();
          this.activeStep = 3;
          this.loading = false;
        } else {
          this.loading = false;
          this._toastService.toastMsg('عذرا كود التفعيل غير صحيح', 'خطأ', 'Warn');
        }
      });
  }

  updateLocalStorageObj(activeCode: string) {
    let localObj = JSON.parse(localStorage.getItem('TEMP_MOBILE'));
    localObj = { ...localObj, activeCode };
    localStorage.setItem('TEMP_MOBILE', JSON.stringify(localObj));
  }

  async setNewPassword() {
    if (this.passwordForm.invalid) {
      this._toastService.toastMsg('من فضلك حاول مرة اخري', 'خطأ', 'Error');
      return;
    }
    this.loading = true;
    let formObj = this.passwordForm.value;
    let patObj = JSON.parse(localStorage.getItem('TEMP_MOBILE'));
    await this._authService.checkRecoveryAccount({
      code: patObj.code,
      password: formObj.password,
      activationCode: patObj.activationCode,
      registerStep: 3
    }).then(res => {
      if (res && res.data) {
        this.loading = false;
        localStorage.removeItem('TEMP_MOBILE');
        this.activeStep = 1;
      }
    })
  }


  initPasswordForm() {
    this.passwordForm = this._fb.group({
      password: ['', Validators.compose([
        Validators.required,
        Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/),
        Validators.minLength(8)
      ])],
      confirm_password: ['', Validators.required]
    });
  }

  get f() { return this.passwordForm.controls; }

}

export function encodeStr(str: string): string {
  return window.btoa(str);
}
