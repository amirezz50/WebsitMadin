import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserSessionService } from '../../app-user-session.service';
import { StepperComponent } from '../../blocks';
import { ITimeSlotObj, TimeSlotPickerService } from '../../blocks/timeSlotPicker/timeSlotPicker.service';
import { getDateObj, getNgBsObj, OutpatientParms, SharedDateService, unflatten } from '../../shared';


export function GenerateRangeTimeSlot(timeSlot: ITimeSlotObj, period: number, type: number): ITimeSlotObj {
  if (timeSlot && period && type) {
      let slots: number = 0;
      if (type == 1) { } // year
      else if (type == 2) { } // month
      else if (type == 3) { } // week
      else if (type == 4) { } // day
      else if (type == 5) { } // hour
      else if (type == 6) { // minute
          slots = +(period / timeSlot.minutesPerSlot).toFixed();
          timeSlot.endTimeSlot = new Date(new Date(timeSlot.startTimeSlot).setMinutes(period));
          let hr = timeSlot.endTimeSlot.getHours();
          let min = timeSlot.endTimeSlot.getMinutes();
          timeSlot.endTime = (hr > 9 ? hr : '0' + hr) + ':' + (min > 9 ? min : '0' + min);
          timeSlot.lastSlotId = timeSlot.id + (slots - 1);
      }
  }
  return timeSlot;
}

@Component({
  selector: 'portal-time-slot-picker',
  templateUrl: './portal-time-slot-picker.component.html',
  styleUrls: ['./portal-time-slot-picker.component.css']
})
export class PortalTimeSlotPickerComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  @Output() currentSlot: EventEmitter<any> = new EventEmitter<any>();
  timeSlotList: any[];
  timeSlotTree: any;
  startDateNgb: any;
  dataMap: any;
  currentSatrt: any;
  private slotClicked: boolean = false;
  isNoSlot = false;
  currentOutPatParms: OutpatientParms;
  myStepNumber: number = 10;
  @Input() stepperComponent: StepperComponent;
  @Input() checkFutureDate: boolean = false;
  @Input() timeRange: boolean;
  @Input() listeningGuid: string = '';
  @Input() portal_padding: boolean = false;

  @Input() consumePeriod: number;
  @Input() consumePeriodType: number;

  constructor(
    public translate: TranslateService,
    private _timeSlotPickerService: TimeSlotPickerService,
    private _userSessionService: UserSessionService,
    private _sharedDateService: SharedDateService
  ) {
    this.currentSatrt = {};

  }

  ngOnInit() {
    this.timeRange = false || this.timeRange;
    this.myStepper$();
    this.reservationParms$();
    this.getSpeciality$();
    if (this.checkFutureDate) {
      this._sharedDateService.day$
        .subscribe(day => {
          this.startDateNgb = getNgBsObj(day);
          this.getTimeSlots();
        }, error => console.log(error)
          , () => null)
    } else {
      this.getTimeSlots();
    }
  }

  getTimeSlots() {
    if (this.stepperComponent && this.stepperComponent.hibernate)
      return false;
    if (this.stepperComponent && this.stepperComponent.activeStepNum != this.myStepNumber)
      return false;
    this.reset();
    if (this.checkFutureDate && this.currentOutPatParms) {
      this.currentOutPatParms.CheckFutureDate = 1;
      this.currentOutPatParms.ReservationDate = getDateObj(this.startDateNgb);
    }
    if (this.currentOutPatParms) {

      this._timeSlotPickerService.GetTimeSlots(this.currentOutPatParms).pipe(
        takeUntil(this.ngUnsubscribe))
        .subscribe((res) => {

          if (res && res.returnFlag == true) {
            this.isNoSlot = false;
            this.timeSlotList = res.data;
            this.makeDataMap();
            let wantedDate = <any>this._userSessionService.getSessionKey("resourceFreeDate");
            let selected = wantedDate ? (res.data as any[]).find(el =>
              el.expectedStartTime == wantedDate.expectedStartTime
              && el.startTime == wantedDate.startTimeOnly
              && el.dateOnly == wantedDate.dateOnly) : null;
            if (selected && selected.id) {
              this.timeSlotList.forEach(el => {
                if (el.id == selected.id) selected.firstslot = el.firstslot = 1;
                else el.firstslot = 0;
              });
              this.selectFirstAvailableSlot([selected]);
            }
            else if (!this.timeRange)
              this.selectFirstAvailableSlot(res.data1 && res.data1.length > 0 ? res.data1 : [res.data[0]]);

            //this.timeSlotTree = arrayToTree(this.timeSlotList);
            this.timeSlotTree = unflatten(this.timeSlotList);
            let servs = this.timeSlotList.filter(serv => serv.ccCallSerial == this.currentOutPatParms.ccCallSerial ? this.currentOutPatParms.ccCallSerial : 0 && serv.firstslot == 1)

            if (this.timeRange && servs.length == 0)// multi slot
              this.resetSelectedSlots()
          } else {
            if (res['msgData'][0]['msgID'] == 65) {
              this.isNoSlot = true;
            }
          }
        });
    }
  }

  selectFirstAvailableSlot(_firstSlot: any[]) {
    if (_firstSlot && _firstSlot.length > 0) {
      let selectedSlot = _firstSlot[0];
      if (this.consumePeriod && this.consumePeriodType) {
        selectedSlot = GenerateRangeTimeSlot(selectedSlot, this.consumePeriod, this.consumePeriodType);
      }
      this.selectedSlot(selectedSlot);
    }
  }
  timeRangeSelect(slot: any) {

  }
  makeDataMap() {
    this.dataMap = {};
    this.timeSlotList.forEach(_slot => {
      if (_slot.id > 24) {
        var _ky = 'k_' + _slot.id;
        this.dataMap[_ky] = _slot;
      }
    })
  }
  unSelectForward(_id: number) {
    let _true = true;
    while (_true) {
      var _slot = this.getSlot(_id);
      if (_slot && _slot['slotToggle'] == 1) {
        this.unSelectSlot(_slot);
        _id = _id + 1;
      } else {
        _true = false;
      }

    }

  }
  unSelectBackward(_id: number) {
    let _true = true;
    while (_true) {
      var _slot = this.getSlot(_id);
      if (_slot) {
        this.unSelectSlot(_slot);
        _id = _id - 1;
      } else {
        _true = false;
      }

    }
  }
  getMostBackSelected(_id: number): number {
    var _retId = -1;
    var _slot = this.getSlot(_id);
    while (_slot) {
      _slot = this.getSlot(_id);
      if (_slot && (_slot['slotToggle'] == 1 || _slot.firstslot == 1)) {
        _retId = _id;
      }
      _id = _id - 1;
    }
    return _retId;
  }
  getMostForwardSelected(_id: number): number {
    var _retId = -1;
    var _slot = this.getSlot(_id);
    while (_slot) {
      _slot = this.getSlot(_id);
      if (_slot && (_slot['slotToggle'] == 1 || _slot.firstslot == 1)) {
        _retId = _id;
      }
      _id = _id + 1;
    }
    return _retId;
  }
  selectForward(_id: number) {

  }
  selectBackward(_id: number) {

  }
  selectRange(point1, point2) {
    while (point1 <= point2) {
      let _slot = this.getSlot(point1);
      point1 = (+point1 + 1);
      if (_slot && _slot.slotStatus == 1) {
        this.resetSelectedSlots();
        break;
      } else if (_slot) {
        this.selectSlot(_slot);
      }
    }
  }
  selectSlot(_slot: any) {
    _slot.slotToggle = 1;
    _slot.servStatus = 1;
  }
  unSelectSlot(_slot: any) {
    _slot.slotToggle = 0;
    _slot.servStatus = 0;
    _slot.firstslot = 0;
  }
  getKey(_slot: any) { return 'k_' + _slot.id }
  getPrevKey(_slot: any) { return 'k_' + (+ _slot.id - 1); }
  getNextKey(_slot: any) { return 'k_' + (+ _slot.id + 1); }
  getSlot(id) {
    return this.dataMap['k_' + id];
  }
  selectedSlot(_selectedslot: any) {
    if (_selectedslot.slotStatus != 1) {
      if (!this.timeRange) {
        this.resetSelectedSlots();
        if (_selectedslot.slotToggle == 0) {
          this.selectSlot(_selectedslot);
          this.currentSatrt = _selectedslot;
          this.currentSlot.emit(_selectedslot);
        }
        else if (_selectedslot.slotToggle == 1) {
          this.unSelectSlot(_selectedslot);
          this.currentSlot.emit(null);
          this.currentSatrt = {};
        }
      } else {
        if (_selectedslot.slotToggle == 0) {
          this.selectSlot(_selectedslot);
        }
        else {
          this.unSelectSlot(_selectedslot);
        }
        let point1 = this.getMostBackSelected(_selectedslot.id);
        let point2 = _selectedslot.lastSlotId ? _selectedslot.lastSlotId : this.getMostForwardSelected(_selectedslot.id);
        if ((point2 > point1) && (point1 < _selectedslot.id && point2 > _selectedslot.id)) {
          this.unSelectBackward(_selectedslot.id);
          point1 = _selectedslot.id;
        }
        if (point1 > 0 && point2 > 0) {
          this.selectRange(point1, point2);
          let fslot = this.getSlot(point1);
          let eslot = this.getSlot(point2);
          this.currentSlot.emit(Object.assign({}, fslot, { endTimeSlot: eslot.endTimeSlot, endTime: eslot.endTime }));
        } else {
          this.currentSlot.emit(null)
        }


      }

      this._userSessionService.setSessionKey("ComTimeSlot", _selectedslot)

      //-----------

    }

  }
  resetSelectedSlots() {
    this.currentSatrt = {};
    if (this.timeSlotTree) {
      for (let i = 0; i < this.timeSlotTree.length; i++) {
        if (this.timeSlotTree[i].children) {
          for (let k = 0; k < this.timeSlotTree[i].children.length; k++) {
            this.timeSlotTree[i].children[k].slotToggle = 0;
            this.timeSlotTree[i].children[k].servStatus = 0;
            this.timeSlotTree[i].children[k].firstslot = 0;
          }
        }
      }
    }
  }
  getCSSClasses(_slot: any) {
    let cssClasses;
    if (_slot.slotStatus == 1) {
      cssClasses = {
        'btn-info': false,
        'btn-success': false,
        'btn-danger': true
      }
    } else if (_slot.slotToggle == 1 || (_slot.firstslot == 1)) {
      cssClasses = {
        'btn-info': true,
        'btn-success': false,
        'btn-danger': false
      }
    } else {
      cssClasses = {
        'btn-info': false,
        'btn-success': true,
        'btn-danger': false
      }
    }
    return cssClasses;
  }
  reset() {
    this.currentSatrt = {};
    this.timeSlotList = [];
    this.timeSlotTree = [];
    this.currentSlot.emit(null);
  }
  //-----observable on reservationParms 
  reservationParms$() {
    this._userSessionService.subscribeToKey$('_outpatientParms' + (this.listeningGuid ? this.listeningGuid : '')).pipe(
      takeUntil(this.ngUnsubscribe))
      .subscribe((keys: any) => {
        if (keys.value) {
          this.currentOutPatParms = <OutpatientParms>keys.value;
          if (this._userSessionService.getSessionKey('callerInfo')) {
            this.c = this._userSessionService.getSessionKey('callerInfo');
            this.currentOutPatParms.ccCallSerial = this.c.serial

          } else if (this._userSessionService.getSessionKey('CallConfirmationAndReservation')) {
            this.c = this._userSessionService.getSessionKey('CallConfirmationAndReservation');
            this.currentOutPatParms.ccCallSerial = this.c.serial
          }
          this.getTimeSlots();
        }
      })
  }
  //-----observable on speciality
  getSpeciality$() {
    this._userSessionService.getSessionKey$('speciality').pipe(
      takeUntil(this.ngUnsubscribe))
      .subscribe((keys: any) => {
        if (keys.name == 'speciality' && keys.value) {
          this.reset();
        }
      })
  }
  //-----observable on step on wizard
  c: any
  myStepper$() {
    if (this.stepperComponent) {
      this.stepperComponent.getCurrentStep().pipe(
        takeUntil(this.ngUnsubscribe))
        .subscribe((step: any) => {
          if (step && step.serial == this.myStepNumber) {
            this.currentOutPatParms = <OutpatientParms>this._userSessionService.getSessionKey('_outpatientParms');

            if (this._userSessionService.getSessionKey('callerInfo')) {
              this.c = this._userSessionService.getSessionKey('callerInfo');
              this.currentOutPatParms.ccCallSerial = this.c.serial

            } else if (this._userSessionService.getSessionKey('CallConfirmationAndReservation')) {
              this.c = this._userSessionService.getSessionKey('CallConfirmationAndReservation');
              this.currentOutPatParms.ccCallSerial = this.c.serial
            }
            this.getTimeSlots();
          }

        })
    }
  }
  //---------------event  handeling
  startDateChanged() {
    this.getTimeSlots();
  }


  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();

  }


}
