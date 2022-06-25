import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { UserSessionService, getDateObj, OutpatientParms, getNgBsObj, isToday, SharedDateService } from '../../shared';
import { ToastService } from '../../blocks';
import { PortalNewReservationService, IReservationFastSerachObj, IDoctorsCards, IAvailableTimes } from './portal-new-reservation.service';
import { takeUntil, mergeMap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { PortalAuthService } from '../portal-login/portal-auth.service';
import { AlertService } from '../../shared/notify-and-alert.service';

import { Router } from '@angular/router';
import { TimeSlotPickerService } from '../../blocks/timeSlotPicker/timeSlotPicker.service';
import { Patient } from '../portal-login/portal-login-interface';
import { DocManagementTrans } from '../../docu-manage-new/image-upload-new';
import { RegPatVisit, RegPatEpisode, RegPatService, PatientReservation } from './portal-new-reservation-interface';


@Component({
  selector: 'app-portal-new-reservation',
  templateUrl: './portal-new-reservation.component.html',
  styleUrls: ['./portal-new-reservation.component.css']
})
export class PortalNewReservationComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  selectedDay: FormControl = new FormControl();
  spicialityCodeForm: FormControl = new FormControl();
  doctorCodeForm: FormControl = new FormControl();
  specialCode: number;
  doctorCode: number;
  selectedSpeciality: any = <any>{};
  allAvailableDoctors: IDoctorsCards[] = [];
  selectedServices: any[] = [];
  patientCode: number;
  currentPatient: Patient = <Patient>{};

  constructor(
    public translate: TranslateService,
    private _auth: PortalAuthService,
    private _AlertService: AlertService,
    private _router: Router,
    private _dateService: SharedDateService,
    private _timeSlot: TimeSlotPickerService,
    private _newReservation: PortalNewReservationService,
    private _userSession: UserSessionService,
    private _toastService: ToastService) { }
  _today: string;
  ngOnInit() {
    this._today = formatDate(new Date());
    this.patientCode = this._auth.getPatientCode;
    this.selectedDay.setValue(getNgBsObj(new Date()));
    this.currentPatient = this._auth.getSessionPatient;
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  specialityClicked(item: any) {
    //this.selectedSpeciality = item ? item : <any>{};
    //this.specialCode = item ? item.code : null;
    if (this.spicialityCodeForm && this.spicialityCodeForm.value) {
      let objData: IReservationFastSerachObj = {
        // specialityId: item.code,
        specialityId: this.spicialityCodeForm.value,
        docCode: this.doctorCodeForm.value,
        reservationDate: this._dateService.convertFromNgBsToDate(this.selectedDay.value),
        entityType: 3,
        resourceType: 100
      }
      this.getAvailableDoctors(objData);
    }
  }

  resoucesTimes: any[] = [];
  msgError: string = '';
  getAvailableDoctors(data: IReservationFastSerachObj) {
    this.allAvailableDoctors = [];
    if (data) {
      this._newReservation.getSpecialityDoctors(data)
        .pipe(mergeMap(c => this.getTimesForDoctors(c.data)))
        .subscribe(
          res => {

            if (res && res.data) {
              this.allAvailableDoctors = [];
              this.resoucesTimes = res.data;

              this.doctorsData.forEach(el => {
                el._date = formatDate(new Date(el.reservationDate))
                if (this.resoucesTimes.length > 0) {
                  el.timesAvailable = this.resoucesTimes.filter(t => t.resourceId == el.code);
                  el.shortTimes = this.resoucesTimes.filter((t, i) => t.resourceId == el.code && i <= 4);
                  el.timeFound = el.timesAvailable.length > 0 ? true : false;
                  el.timeNotAvailableMsg = el.timesAvailable.length > 0 ? '' : 'غير متاح اليوم';
                } else {
                  el.timeFound = false;
                  el.timeNotAvailableMsg = 'غير متاح اليوم';
                }
                // if (el.code != this.doctorsData[0].code) {
                //   el.timeFound = false;
                //   el.timeNotAvailableMsg = 'غير متاح اليوم';
                // }
              });

              if (this.doctorsData.length > 0) {
                this.allAvailableDoctors = this.doctorsData;
              }
            }
          })
    }
  }
  showMore: boolean = false;
  doctorsData: IDoctorsCards[] = [];
  getTimesForDoctors(availableDoctors: any[]) {
    if (availableDoctors) {
      this.doctorsData = availableDoctors;
      let outpatient: OutpatientParms = <OutpatientParms>{
        ResourceType: 100,
        entityType: 3,
        DocCode: availableDoctors[0].code,
        ReservationDate: this._dateService.convertFromNgBsToDate(this.selectedDay.value),
        specialityId: this.spicialityCodeForm.value,
        resources: availableDoctors.map(d => { return d.code }).toString()
      };
      return this._timeSlot.GetTimeSlots(outpatient);
    }
  }

  doctorGetTimeSlot(newDate: Date, docId: number) {
    let outpatient: OutpatientParms = <OutpatientParms>{
      ResourceType: 100,
      entityType: 3,
      DocCode: docId,
      ReservationDate: newDate,
      specialityId:this.spicialityCodeForm.value
    };
    this._timeSlot.GetTimeSlots(outpatient)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        let indx = this.allAvailableDoctors.findIndex(el => el.code == docId);
        if (res) {
          this.allAvailableDoctors[indx]._date = formatDate(new Date(newDate));
          this.allAvailableDoctors[indx].reservationDate = formatDate(new Date(newDate));
          this.allAvailableDoctors[indx].timesAvailable = res.data.length > 0 ? res.data : [];
          this.allAvailableDoctors[indx].shortTimes = res.data.length > 0 ? res.data.filter((dt, i) => i <= 4) : [];
          this.allAvailableDoctors[indx].timeFound = res.data.length > 0 ? true : false;
          this.allAvailableDoctors[indx].timeNotAvailableMsg = res.data.length > 0 ? undefined : 'غير متاح اليوم';
        }
      })
  }

  activeTime: number;
  selectedSlot: any = <any>{};
  selectedCurrentSlot(_selectedSlot: IAvailableTimes) {
    this.activeTime = _selectedSlot.id;
    this.selectedSlot = _selectedSlot;
    this.doctorCode = _selectedSlot.resourceId;
    // this._userSession.setSessionKey('slot', _selectedSlot);
    this.getServices(this.spicialityCodeForm.value);
  }

  specialityServices: any[] = [];
  outpatientParms: OutpatientParms = <OutpatientParms>{};
  getServices(specialityCode: number) {
    if (this.patientCode > 0 && specialityCode > 0) {
      this.outpatientParms.patCode = this.patientCode;
      this.outpatientParms.SpecialityId = this.spicialityCodeForm.value;
      this.outpatientParms.contractId = this.currentPatient.contractId;
      this.outpatientParms.ResourceType = 100;
      this.outpatientParms.ReservationDate = this.currentPatient.startDate;
      this.outpatientParms.DocCode = this.currentPatient.docId;

      this._newReservation.getSpecialityServices(this.outpatientParms).pipe(
        takeUntil(this.ngUnsubscribe))
        .subscribe(
          res => {
            this.specialityServices = res ? res.data : [];

            // this.patSharingPercentFromCardFlag = this.specialityServices[0]['patSharingPercentFromCardFlag'] == 1 ? true : false;
            this.selectedServices = [];
            // this.approvals = [];
            // this.userSessionService.setSessionKey('approvals', this.approvals);
          },
          error => console.log('unable to load Services', error),
          () => {
            if (this.specialityServices.length > 0)
              this.checkDefaultService();
          });
    } else if (specialityCode == null || specialityCode == undefined) {
      this._toastService.activateMsg('UI10');

    } else if (this.patientCode == null || this.patientCode == undefined) {
      this._toastService.activateMsg('UI8');
    }
  }

  checkDefaultService() {
    // this.userSessionService.setSessionKey('Services', this.selectedServices);
    let _defaultSrv = this.specialityServices.find(service => service.isdefault == true);
    if (_defaultSrv) {
    } else if (this.specialityServices && this.specialityServices.length > 0) {
      _defaultSrv = this.specialityServices[0];
    }
    _defaultSrv.examService = 1;
    _defaultSrv.count = 1;
    _defaultSrv.isdefault = true;
    this.addSelectedService(_defaultSrv);
  }

  addSelectedService(selectedServ: any) {
    if (selectedServ) {
      if (selectedServ.isdefault) {
        this.selectedServices.push(selectedServ);
      } else {
        this.selectedServices.splice(this.selectedServices.indexOf(selectedServ), 1);
      }
      // this.userSessionService.setSessionKey('Services', this.selectedServices);
    }
  }

  gotoNextPrevDay(before: any, type: 'NEXT' | 'PREV', docId?: number) {
    let _newDate: any = new Date();
    if (before) {
      let _date = new Date(before);
      let d: number;
      if (type == 'NEXT')
        d = _date.setDate(_date.getDate() + 1);
      else
        d = _date.setDate(_date.getDate() - 1);
      _newDate = getDateObj(new Date(d));
    }

    this.doctorGetTimeSlot(_newDate, docId);
  }

  doctorClicked(item: any) {
    if (item && item.apologizeFlag == 1) {
      this._toastService.activateMsg('UI122');
      this.doctorCode = null;
      return false;
    }
    this.doctorCode = item ? item.code : null

    let outpatientParms = <OutpatientParms>{};
    outpatientParms.DocCode = this.doctorCode ? this.doctorCode : null;
    outpatientParms.ReservationDate = this._dateService.convertFromNgBsToDate(this.selectedDay.value);
    let speciality = this.spicialityCodeForm.value;
    outpatientParms.SpecialityId = speciality ? speciality.code : null;
    outpatientParms.ResourceType = 100;
    this._userSession.setSessionKey('_outpatientParms', outpatientParms);
    this.showTimeSlot = true;
  }

  showTimeSlot: boolean = false;
  onRowClick(event: any, rowData: any) {
    if (event == 404) {
      this.doctorClicked(rowData);
    }
  }


  onBtnClicked(e: number): void {
    switch (e) {
      case 1: //save code
      case -1000: //save code
        this.save();
        break;
    }
  }

  editTherapeuticCards: any = <any>{};
  save() {
    let currentVisit = sessionStorage.getItem('CURRENT_VISIT_' + this.patientCode) ? JSON.parse(sessionStorage.getItem('CURRENT_VISIT_' + this.patientCode)) : undefined;
    if (currentVisit && isToday(currentVisit._date)) {
      this._toastService.activateMsg('You have Reservation Today. try another time!');
      return false;
    }
    let _slot = this.selectedSlot;
    if (_slot == null || _slot == undefined) {
      this._toastService.activateMsg('UI6');
      return false;
    }
    let startTime = this.selectedSlot.startTimeSlot;
    if (startTime == null || startTime == undefined) {
      this._toastService.activateMsg('UI6');
      return false;
    }
    let endTime = this.selectedSlot.endTimeSlot;
    let servStatus = this.selectedSlot.servStatus ? this.selectedSlot.servStatus : 1;
    let scheduleTimeSerial = this.selectedSlot.scheduleTimeSerial;
    if (startTime == undefined) {
      this._toastService.activateMsg('UI6');
      return false;
    }

    let visitData = <RegPatVisit>this.currentPatient;
    let visitDocuments = <DocManagementTrans[]>[];//this._userSession.getSessionKey<any>('visitDocumentsData');
    visitData.startDate = startTime;
    visitData.serial = visitData.serial ? visitData.serial : -1;
    visitData.episodeCode = visitData.episodeCode ? visitData.episodeCode : -1;
    visitData.docId = this.doctorCode;
    visitData.speciality = this.specialCode;
    const regPatVisit: RegPatVisit = {
      serial: visitData.serial,
      contractId: visitData.contractId,
      patCaseType: visitData.patCaseType,
      docId: this.doctorCode,
      patCode: this.patientCode,
      type: 2,
      visitNo: 0,
      episodeCode: visitData.episodeCode,
      placeCode: visitData.placeCode,
      startDate: startTime,
      bedInfo: '',
      allRoom: false,
      speciality: this.specialCode
    };
    let regPatEpisode = <RegPatEpisode>{ Serial: -1, PatCode: this.patientCode, StartDate: startTime }//this._userSession.getSessionKey<any>('episodeData');
    ////////////////////////////////////////////////
    this.editTherapeuticCards = this._auth.getPatientContract //_userSession.getSessionKey<any>('contractObjectForm');
    /////////////////////////
    let regPatServices: RegPatService[] = [];
    let k = 0;
    let selectedServices: any = [];  //get all selected services in this array

    selectedServices = this.selectedServices;

    let examservfalg = false;
    for (let i = 0; i < selectedServices.length; i++) {
      if (selectedServices[i].examService == 1) { examservfalg = true }
      else {
        selectedServices[i].examService = 0;
      }
      regPatServices.push({
        portalState: 1,
        serviceId: selectedServices[i].serviceCode,
        examService: selectedServices[i].examService,
        count: selectedServices[i].count > 0 ? selectedServices[i].count : 1,
        serial: k--,
        visitSerial: visitData.serial,
        startDate: null,
        expectedStartTime: startTime,
        expectedEndTime: endTime,
        resourceId: visitData.docId,
        scheduledResourceCode: visitData.docId,
        scheduledResourceType: 100,// mean doctor 
        servStatus: servStatus,
        scheduleTimeSerial: scheduleTimeSerial,
        vPlaceId: visitData.placeCode,
        specialityId: this.specialCode,
        regPatRequestsSerial: null,//this.transferRequestSer,
        patSharingPercentFromCard: selectedServices[i].patSharingPercentFromCard,
        delayOrFollowUp: 0          //_____ 0 means insert or edite new reservation 

      } as RegPatService);
    }
    //----check if their is  services  selected 
    if (regPatServices.length == 0) {
      this._toastService.activateMsg('UI1');
      return false;
    }
    //----check if exam service selected 
    if (!examservfalg) {
      this._toastService.activateMsg('UI2');
      return false;
    }
    if (regPatServices.filter(s => s.examService == true).length == 0) {
      this._toastService.activateMsg('UI2');
      return false;
    }

    let approvals = this._userSession.getSessionKey('approvals');
    approvals = approvals == undefined ? [] : approvals;
    let PatientReservation: PatientReservation = <PatientReservation>{
      therapeuticCards: this.editTherapeuticCards,
      regPatVisit,
      visitDocuments,
      regPatEpisode,
      regPatServices,
      approvals,
      callData: null
    };

    this._newReservation.addPatientReservation(PatientReservation)
      .subscribe((con) => {
        if (con.returnFlag == true) {
          if (con.data && con.data.length > 0 && con.data[0].visitSerial > 0) {
            sessionStorage.setItem('CURRENT_VISIT_' + this.patientCode, JSON.stringify({
              visitSerial: con.data[0].visitSerial,
              docId: this.doctorCode,
              specialityId: this.specialCode,
              _date: startTime
            }));
            this._router.navigateByUrl('/portal/reservations-history');
          }
          if (con && con.data2 && con.data2.length > 0) {
            this._AlertService._invokeAlertsMesseages(con.data2, '', 'addPatientReservation');
          }
        }
      }, error => console.log(error),
        () => {
          null
        }

      );
  }
  sendDoctor(obj:any){
    
    let currentVisit = sessionStorage.getItem('CURRENT_VISIT_' + this.patientCode) ? JSON.parse(sessionStorage.getItem('CURRENT_VISIT_' + this.patientCode)) : undefined;
    if (currentVisit && isToday(currentVisit._date)) {
      this._toastService.activateMsg('You have Reservation Today. try another time!');
      return false;
    }
    let _slot = this.selectedSlot;
    if (_slot == null || _slot == undefined) {
      this._toastService.activateMsg('UI6');
      return false;
    }
    let startTime = this.selectedSlot.startTimeSlot;
    if (startTime == null || startTime == undefined) {
      this._toastService.activateMsg('UI6');
      return false;
    }
    let endTime = this.selectedSlot.endTimeSlot;
    let servStatus = this.selectedSlot.servStatus ? this.selectedSlot.servStatus : 1;
    let scheduleTimeSerial = this.selectedSlot.scheduleTimeSerial;
    if (startTime == undefined) {
      this._toastService.activateMsg('UI6');
      return false;
    }

    let visitData = <RegPatVisit>this.currentPatient;
    let visitDocuments = <DocManagementTrans[]>[];//this._userSession.getSessionKey<any>('visitDocumentsData');
    visitData.startDate = startTime;
    visitData.serial = visitData.serial ? visitData.serial : -1;
    visitData.episodeCode = visitData.episodeCode ? visitData.episodeCode : -1;
    visitData.docId = this.doctorCode;
    visitData.speciality = this.specialCode;
    const regPatVisit: RegPatVisit = {
      serial: visitData.serial,
      contractId: visitData.contractId,
      patCaseType: visitData.patCaseType,
      docId: this.doctorCode,
      patCode: this.patientCode,
      type: 2,
      visitNo: 0,
      episodeCode: visitData.episodeCode,
      placeCode: visitData.placeCode,
      startDate: startTime,
      bedInfo: '',
      allRoom: false,
      speciality: this.specialCode
    };
    let regPatEpisode = <RegPatEpisode>{ Serial: -1, PatCode: this.patientCode, StartDate: startTime }//this._userSession.getSessionKey<any>('episodeData');
    ////////////////////////////////////////////////
    this.editTherapeuticCards = this._auth.getPatientContract //_userSession.getSessionKey<any>('contractObjectForm');
    /////////////////////////
    let regPatServices: RegPatService[] = [];
    let k = 0;
    let selectedServices: any = [];  //get all selected services in this array

    selectedServices = this.selectedServices;

    let examservfalg = false;
    for (let i = 0; i < selectedServices.length; i++) {
      if (selectedServices[i].examService == 1) { examservfalg = true }
      else {
        selectedServices[i].examService = 0;
      }
      regPatServices.push({
        portalState: 1,
        serviceId: selectedServices[i].serviceCode,
        examService: selectedServices[i].examService,
        count: selectedServices[i].count > 0 ? selectedServices[i].count : 1,
        serial: k--,
        visitSerial: visitData.serial,
        startDate: null,
        expectedStartTime: startTime,
        expectedEndTime: endTime,
        resourceId: visitData.docId,
        scheduledResourceCode: visitData.docId,
        scheduledResourceType: 100,// mean doctor 
        servStatus: servStatus,
        scheduleTimeSerial: scheduleTimeSerial,
        vPlaceId: visitData.placeCode,
        specialityId: this.specialCode,
        regPatRequestsSerial: null,//this.transferRequestSer,
        patSharingPercentFromCard: selectedServices[i].patSharingPercentFromCard,
        delayOrFollowUp: 0          //_____ 0 means insert or edite new reservation 

      } as RegPatService);
    }
    //----check if their is  services  selected 
    if (regPatServices.length == 0) {
      this._toastService.activateMsg('UI1');
      return false;
    }
    //----check if exam service selected 
    if (!examservfalg) {
      this._toastService.activateMsg('UI2');
      return false;
    }
    if (regPatServices.filter(s => s.examService == true).length == 0) {
      this._toastService.activateMsg('UI2');
      return false;
    }

    let approvals = this._userSession.getSessionKey('approvals');
    approvals = approvals == undefined ? [] : approvals;
    let PatientReservation: PatientReservation = <PatientReservation>{
      therapeuticCards: this.editTherapeuticCards,
      regPatVisit,
      visitDocuments,
      regPatEpisode,
      regPatServices,
      approvals,
      callData: null,
      obj
    };


    this._userSession.setSessionKey("getDoctor",PatientReservation);
    }

}


export function formatDate(date) {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2)
    month = '0' + month;
  if (day.length < 2)
    day = '0' + day;

  return [year, month, day].join('-');
}