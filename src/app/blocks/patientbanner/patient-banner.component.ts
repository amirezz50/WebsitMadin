
import { takeUntil } from 'rxjs/operators';

import { Component, Input, Output, OnInit, OnDestroy, NgModule, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { UserSessionService, SharedDateService, SheetParms } from '../../shared/shared';
import { Observable, Subject } from 'rxjs';
import { PateintBannerService, PatientBloodTypeData } from './patient-banner.service';
import { Guid } from '../../shared/utility';
import { TranslateModule } from '@ngx-translate/core';
import { PatientBloodTypeRhPopUpComponent, PatientBloodTypeRhPopUpModule } from '../patient-bloodType-rh-popup/patient-bloodType-rh-popup.component';
import { ModalContainerModule } from '../ui-component/modal-container/modal-container.module';
import { SelectizeModule } from '../selectize/selectize.component';
import { NgbPopoverModule } from '../../ng-bootstrap/popover/popover.module';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '../../shared';
import { Patient } from '../../patient-portal/portal-login/portal-login-interface';
import { PatientService } from '../../portalServicesUsed/patient.service';


@Component({
  selector: 'sanabel-patientBanner',
  templateUrl: './patient-banner.component.html',
  styleUrls: ['./patient-banner.component.css']
})

export class PatientBannerComponent implements OnInit, OnDestroy {

  // by abood

  bannerCollapse: boolean = true;
  // dynamicComponent: any;
  @ViewChild('popup', { static: false }) content: any;

  collapsing() {
    this.bannerCollapse = !this.bannerCollapse;
  }
  today = {
    year: new Date().getFullYear,
    month: new Date().getMonth,
    day: new Date().getDay()
  };
  // end of abood
  // commented by abood
  // toggle = false;
  myInstanceGuid: string;
  sheetParms: SheetParms;
  @Input() patient: Patient;
  @Input() medical: number;
  lastStatus: any;
  allergies: any[];
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  birthDay: Date
  pannerDisplay = false;
  constructor(
    public translate: TranslateService,
    private _userSessionService: UserSessionService,
    private _pateintBannerService: PateintBannerService,
    private _sharedDateService: SharedDateService,
    private _patientService: PatientService,

  ) { }

  ngOnInit() {
    this.myInstanceGuid = Guid.newGuid();
    this.sheetParms = <SheetParms>{};
    this.lastStatus = {};
    this.patientBanner$();
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();

  }
  patientBanner$() {
    this._userSessionService.subscribeToKey$('patientBanner').pipe(
      takeUntil(this.ngUnsubscribe))
      .subscribe((keys: any) => {
        if (keys && keys.value) {
          let patient = keys.value;
          if (patient == null || Object.keys(patient).length === 0) {
            this.pannerDisplay = false;
          }
          else {
            this.patient = patient;
            this.pannerDisplay = true;
            this.sheetParms.visitSerial = this.patient['visitSerial'];
            if (this.medical == 1) {
              this._pateintBannerService.bannerDataLoad(this.sheetParms).pipe(
                takeUntil(this.ngUnsubscribe))
                .subscribe(res => {
                  this.reset();
                  if (res['returnFlag']) {
                    if (res.data && res.data.length > 0) {
                      this.lastStatus = res.data[0];
                    }
                    if (res.data1 && res.data1.length > 0) {
                      this.allergies = res.data1;
                    }
                  }
                });
            }
          }
        }
      });
  }

  // commented by abood
  // toggleMenu() {
  //     this.toggle = !this.toggle;
  // }
  reset() {
    this.lastStatus = {};
    this.allergies = [];
  }
  editAge: boolean = false
  selectAge() {
      this.editAge = !this.editAge

  }
  addPatientBloodType(patientObj) {
    // console.log(patientObj)
    if (patientObj) {
      this.patientCode = patientObj.code;
      this.getPatDetail(patientObj);
    }
    // this._userSessionService.setSessionKey("PatientBloodTypeRh", patientObj);
    // {
    //   this.dynamicComponent = PatientBloodTypeRhPopUpComponent;
    //   this.content.openModal("PatientBloodTypeRhPopUpComponent", "itemMaster", patientObj);
    // }
  }


  // new Code 
  patientBloodTypeData: PatientBloodTypeData = <PatientBloodTypeData>{}
  patientCode: number;

  getPatDetail(patObj) {
    this._pateintBannerService.getPatBlodTypeRHData(patObj.code)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        requests => {
          if (requests && requests.data.length > 0) {
            this.patientBloodTypeData = requests.data[0]
            console.log(this.patientBloodTypeData)
          }
        },
        error => console.log(error),
        () => { });

  }

  saveData(popover) {
    this.patientBloodTypeData.code = this.patientCode
    this._pateintBannerService.updatePatBloodType(this.patientBloodTypeData)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(c => {
        if (c && c.returnFlag == true && popover.isOpen()) {
          popover.close();
        }
        //  this._goBack();
      });

  }
  onpopupClose(parms: any) {
    if (parms && parms.output == 'Cross click') {

    }
  }

  onChange(event) {
    if (event != '') {
      let x = (new Date().getFullYear() - event);
      let dob_date = new Date(x, 0, 1);

      this.birthDay = this._sharedDateService.convertFromDateToNgBsObject(dob_date)
    }
  }
  onClicked(e: number): void {
    switch (e) {
      case 1: //save code
      case -1000:
        this.updatePatientAge();
        break;
    }
  }
  updatePatientAge() {
    this.patient.birthDate = this._sharedDateService.convertFromNgBsToDate(
      this.birthDay
    );
    this._pateintBannerService.updateBirthData(this.patient)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((s: any) => {
        if (s && s['returnFlag'] == true) {
          this.editAge = false
          if (s.data) {
            this.patient.ageAr = s.data[0].ageAr
            this.patient.age = s.data[0].age
          }
        }
      });

  }
  showCalenderFlag: boolean = false
  showCalenderData(e:string) {
    if (this.showCalenderFlag && e == 'change')
     this.showCalender() 
  }
  showCalender() {
      this.showCalenderFlag = !this.showCalenderFlag
  }
}

/////////  patient  list module
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ModalContainerModule,
    TranslateModule.forChild(),
    PatientBloodTypeRhPopUpModule,
    NgbPopoverModule,
    SelectizeModule,
    FormsModule
  ],
  declarations: [
    PatientBannerComponent
  ],
  providers: [
    PateintBannerService,PatientService
  ],
  exports: [
    PatientBannerComponent
  ]
})
export class PatientBannerModule { }
