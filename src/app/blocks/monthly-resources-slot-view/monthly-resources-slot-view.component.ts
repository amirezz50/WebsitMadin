import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TimeSlotPickerService } from '../timeSlotPicker/timeSlotPicker.service';
import { UserSessionService, SharedDateService, OutpatientParms, getNgBsObj, unflatten, getDateObj } from '../../shared';
import { StepperComponent } from '..';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { GenerateRangeTimeSlot } from '../../patient-portal/portal-time-slot-picker/portal-time-slot-picker.component';

@Component({
  selector: 'app-monthly-resources-slot-view',
  templateUrl: './monthly-resources-slot-view.component.html',
  styleUrls: ['./monthly-resources-slot-view.component.css']
})
export class MonthlyResourcesSlotViewComponent implements OnInit {
  timeSlotList: any[];
  newArrayOfTime: any[];
  newArrayTimeId: any[];
  timeSlotTree: any;
  startDateNgb: any;
  arrayOfDays: any[] = [];
  dataMap: any;
  currentSatrt: any;
  private slotClicked: boolean = false;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  @Output() currentSlot: EventEmitter<any> = new EventEmitter<any>();
  @Output() unCurrentSlot: EventEmitter<any> = new EventEmitter<any>();
  @Output() ReservedCurrentSlot: EventEmitter<any> = new EventEmitter<any>();

  isNoSlot = false;
  currentOutPatParms: OutpatientParms;
  myStepNumber: number = 10;
  @Input() stepperComponent: StepperComponent;
  @Input() checkFutureDate: boolean = false;
  @Input() timeRange: boolean;
  @Input() listeningGuid: string = '';
  @Input() portal_padding: boolean = false;
  @Input() scheduleType: number
  @Input() showPatCode: number
  @Input() consumePeriod: number;
  @Input() consumePeriodType: number;


  constructor(
    public translate: TranslateService,
    private _timeSlotPickerService: TimeSlotPickerService,
    private _userSessionService: UserSessionService,
    private _sharedDateService: SharedDateService

  ) { }

  ngOnInit() {
    this.timeRange = false || this.timeRange;

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
  reservationParms$() {
    this._userSessionService.subscribeToKey$('_outpatientParms' + (this.listeningGuid ? this.listeningGuid : '')).pipe(
      takeUntil(this.ngUnsubscribe))
      .subscribe((keys: any) => {
        if (keys.value) {
          this.currentOutPatParms = <OutpatientParms>keys.value;

          this.getTimeSlots();
        }
      })
  }
  getSpeciality$() {
    this._userSessionService.getSessionKey$('speciality').pipe(
      takeUntil(this.ngUnsubscribe))
      .subscribe((keys: any) => {
        if (keys.name == 'speciality' && keys.value) {
          this.reset();
        }
      })
  }
  startDateChanged() {
  }
  selectSlot(_slot: any) {
    _slot.slotToggle = 1;
    _slot.servStatus = 1;
  }
  getCSSClasses(_slot: any) {
    let cssClasses;
    if(_slot == undefined){
      cssClasses = {
        'btn-info': false,
        'btn-success': false,
        'bg-lightgrey': true
      }
     return cssClasses   ;
    }
    
    if (_slot.slotStatus == 1) {
      cssClasses = {
        'btn-info': false,
        'btn-success': false,
        'btn-danger': true
      }
    } else if (_slot.slotToggle == 1 || _slot.firstslot == 1) {
      cssClasses = {
        'btn-info': true,
        'btn-success': false,
        'btn-danger': false
      }
    } else {
      cssClasses = {
        'btn-info': false,
        'btn-success': false,
        'btn-danger': false
      }
    }
    return cssClasses;
  }
  monthNo: number;
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

      this._timeSlotPickerService.GetMonthlyResourcesSlot(this.currentOutPatParms).pipe(
        takeUntil(this.ngUnsubscribe))
        .subscribe((res) => {
          if (res && res.returnFlag == true) {
            this.isNoSlot = false;
            this.timeSlotList = res.data;
            this.arrayOfDays = res.data1;
            this.monthNo = res.data1[0].monthNo;
            this.newArrayTimeId = res.data2;
            this.makeDataMap();

          } else {
            this.reset();
          }
        });
    }
  }
  makeDataMap() {
    this.dataMap = {};
    this.timeSlotList.forEach(_slot => {
      if (_slot.parentId != null) {
        if (this.dataMap[_slot.startTime + '_' + _slot.dayOfTheMonth + '_' + _slot.monthNo]) {

        } else {
          this.dataMap[_slot.startTime + '_' + _slot.dayOfTheMonth + '_' + _slot.monthNo] = _slot;
        }
      }
    })
  }
  slotClickFn(dayOfTheMonth: string, startTime: string, monthNo: number) {
    alert(startTime + '_' + dayOfTheMonth);
    // console.log(this.dataMap[startTime + '_' + dayOfTheMonth ])
    this.currentSlot.emit(this.dataMap[startTime + '_' + dayOfTheMonth + '_' + monthNo]);

  }


  onSpecialityClicked() {

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
  c: any

  reset() {
    this.currentSatrt = {};
    this.timeSlotList = [];
    this.timeSlotTree = [];
    this.currentSlot.emit(null);
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
  selectedSlot(_selectedslot: any) {
    if(!_selectedslot)
    return  
    if (!_selectedslot.endTimeSlot || !_selectedslot.startTimeSlot) {
      let date = new Date(this.currentOutPatParms.ReservationDate);
      let slotDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + 'T';
      _selectedslot.endTimeSlot = slotDate + _selectedslot.endTime
      _selectedslot.startTimeSlot = slotDate + _selectedslot.startTime
    }

    console.log(this.scheduleType)
    if (this.scheduleType == 1) {
      this.timeSlotList.forEach(el => {
        if (!el.regPatServiceSerial && el.slotToggle) { el.slotToggle = 0; }

      });
    }


    if (_selectedslot.slotStatus != 1) {
      if (!this.timeRange) {
        this.resetSelectedSlots();
        if (_selectedslot.slotToggle == 0) {
          this.selectSlot(_selectedslot);
          this.currentSatrt = _selectedslot;
          this.currentSlot.emit(_selectedslot);
          console.log(_selectedslot);
        }
        else if (_selectedslot.slotToggle == 1) {
          this.unSelectSlot(_selectedslot);
          //this.currentSlot.emit(null);
          //this.currentSlot.emit(_selectedslot);
          this.unCurrentSlot.emit(_selectedslot);
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
        }
        else {
          this.currentSlot.emit(null)
        }


      }

      //-----------

    }
    else {
      this.emitReservedSlot(_selectedslot)
    }
    // this.currentSlot.emit(_selectedslot);

  }

  emitReservedSlot(slot: any) {
    if (slot && slot.slotStatus == 1) {
      this.ReservedCurrentSlot.emit(slot)
    }
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
  unSelectSlot(_slot: any) {
    _slot.slotToggle = 0;
    _slot.servStatus = 0;
    _slot.firstslot = 0;
  }
  getSlot(id) {
    return this.dataMap['k_' + id];
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
  //---------------event  handeling
}
