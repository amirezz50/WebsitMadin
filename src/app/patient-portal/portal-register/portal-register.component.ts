import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { PortalAuthService } from '../portal-login/portal-auth.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { ToastService } from '../../blocks/toast/toast.service';
import { takeUntil } from 'rxjs/operators';
// import { ContractComponent, TherapeuticCards } from '../../registeration/contracts';
import { IdentityTypeComponent, IIdentity } from '../../blocks/identity_type/identity_type.component';
import { TherapeuticCards } from '../portal-contracts/potral-contract.service';
import { PortalContractComponent } from '../portal-contracts';
import { Patient, PatientData } from '../portal-login/portal-login-interface';

@Component({
  selector: 'portal-register',
  templateUrl: './portal-register.component.html',
  styleUrls: ['./portal-register.component.css']
})
export class PortalRegisterComponent implements OnInit, OnDestroy {

  mobileCountry = require("setting/country_1.json");


  private ngUnsubscribe: Subject<void> = new Subject<void>();
  registerForm: FormGroup;

  regPatCards: TherapeuticCards = <TherapeuticCards>{};

  @ViewChild('TherapeuticCards', { static: false }) contractComponent: PortalContractComponent;
  @ViewChild('identity', { static: false }) identityComponent: IdentityTypeComponent;
  constructor(
    public translate: TranslateService,
    private _fb: FormBuilder,
    private _router: Router,
    private _toast: ToastService,
    private _authServ: PortalAuthService) { }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit() {
    if (this._authServ.isLogged()) {
      this._router.navigateByUrl('/portal/home');
    }
    this.initRegistForm();
    if (JSON.parse(localStorage.getItem('TEMP_USER'))) {
      this.patientData = JSON.parse(localStorage.getItem('TEMP_USER'));
      this.patientData.activationCode = window.atob(this.patientData[window.btoa('string_code')]);
      this.showActivationForm = true;
    }
  }

  initRegistForm() {
    this.registerForm = this._fb.group({
      userName: ['', Validators.compose([
        Validators.required,
        Validators.minLength(4)
      ])],
      fullnameAr: ['', Validators.compose([
        Validators.required,
        Validators.minLength(9)
      ])],
      fullAddressAr: [''],
      mobile: ['', Validators.compose([
        Validators.required,
        Validators.pattern(new RegExp(this.mobileCountry.countries[0].regex))

      ])],
      password: [''
        ,
        Validators.compose([
          Validators.required,
          Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/),
          Validators.minLength(8)
        ])
      ], 
      confirm_password: ['', Validators.required]
      // identity:['',Validators.required],
      // nationalValue:['',Validators.required]
    });
  }

  get f() { return this.registerForm.controls; }

  patientData: Patient = <Patient>{};
  loading: boolean = false;
  savePatObj: PatientData = <PatientData>{};
  onSubmit() {
    // stop here if form is invalid
    if (this.registerForm.invalid) {
      this._toast.toastMsg('form is invalid', 'form', 'Error');
      return;
    }

    this.loading = true;

    this.patientData = this.registerForm.value;
    this.patientData.code = 0;
    this.patientData.activationCode = String(Math.floor(Math.random() * 965418));

    if (this.contractComponent) {
      this.regPatCards = this.contractComponent.getTherapeuticCardsForm();
      if (this.regPatCards && this.regPatCards.contractId) {
        this.patientData.contractId = this.regPatCards.contractId;
      } else {
        this._toast.toastMsg('Please Complete Data!', 'Empty Data', 'Warn');
        return false;
      }
    }
    if (this.identityComponent) {
      const identity = this.identityComponent.getIdentityForm().value as IIdentity;
      if (identity && identity.identityValue) {
        this.patientData.birthDate = identity.birthDate;
        this.patientData.birthPlace = identity.birthPlace;
        this.patientData.identityType = identity.identityType;
        this.patientData.identityValue = identity.identityValue;
        this.patientData.gender = identity.gender;
      } else {
        this._toast.toastMsg('Please Complete Data!', 'Empty Data', 'Warn');
        return false;
      }
    }

    if (this.patientData && this.patientData.mobile)
      this._authServ.sendActivationCode(this.patientData)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(res => {
          if (res && res.returnFlag) {
            this.loading = false;
            this.patientData[window.btoa('string_code')] = window.btoa(this.patientData.activationCode);
            this.patientData.activationCode = 'N/A';
            localStorage.setItem('TEMP_USER', JSON.stringify(this.patientData));
            this.showActivationForm = true;
            this._authServ.sendActivationCodeSms(this.patientData.mobile, 'Your Activation Code: ' + window.atob(this.patientData[window.btoa('string_code')]));
          } else {
            if (res.msgData[0].msgID > 0) {
              this._toast.activateMsg(`${res.msgData[0].msgBodyAr}`)
            }
            else {

              this._toast.toastMsg('من فضلك اعد المحاولة فى وقت لاحق', 'فشل التسجيل', 'Error');
            }
            this.loading = false;
          }
        });
    else {
      console.error('enter you mobile to send activation code!');
    }
  }


  // part of activation Code
  showActivationForm: boolean = false;
  activationCode: FormControl = new FormControl('', Validators.compose([
    Validators.required,
    Validators.minLength(5)
  ]));

  activateAccount() {
    if (this.activationCode.invalid) {
      this._toast.toastMsg('من فضلك حاول مرة اخري', 'خطأ', 'Error');
      return;
    }
    this.patientData.activationCode = '';

    this.loading = true;
    this.patientData.securityQuestion = 'N/A';
    this.patientData.answer = 'N/A';
    this.patientData.confirmedUser = 1;
    this.patientData.activated = true;
    this.patientData.activationCode = this.activationCode.value;

    this.savePatObj = {
      patient: this.patientData,
      therapeuticCards: this.regPatCards
    }
    if (this.patientData.activationCode.length > 0)
      this._authServ.registerNewPatient(this.savePatObj)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(res => {
          if (res && res.returnFlag && res.msgData.length > 0) {
            this.loading = false;
            localStorage.removeItem('TEMP_USER');
            this._router.navigateByUrl('/portal/login');
          } else {
            this.loading = false;
            this._toast.toastMsg('من فضلك حاول مرة اخري', 'خطأ', 'Error');
          }
        });
  }

  contractValueInfoEmitted(contractId: any) {
    if (contractId) {
      this.patientData.contractId = contractId;
      this.regPatCards.contractId = contractId;
      this.regPatCards.code = -1;
    } else {
      this.patientData.contractId = null;
    }
  }

  identityValueInfoEmitted(ev: any) {
    const SSID = this.identityComponent.getIdentityForm().value;
    console.log(SSID);
  }

  
}
