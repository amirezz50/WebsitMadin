import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SharedDateService, UserSessionService } from '../../shared';

@Component({
  selector: 'app-doctor-reservation',
  templateUrl: './doctor-reservation.component.html',
  styleUrls: ['./doctor-reservation.component.css']
})
export class DoctorReservationComponent implements OnInit {
  monthlyOrDaily: number = 1;
  monthNo: number;
  year: number;

  selectedDay: FormControl = new FormControl();

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private _sharedDateService: SharedDateService, private _USS: UserSessionService,
  ) { }

  ngOnInit() {

    this.firstInit();
    this.observeModal$()
  }
  DoctorCode: number
  monthlyDoctoroutPatient(month: any) {
    //  let requestDate = this._sharedDateService.convertFromNgBsToDate(this.selectedDay.value);
    let requestDate = new Date(this.year, month, 1)
    let outpatientParms: any = {}
    outpatientParms.ReservationDate = requestDate;
    outpatientParms.entityType = 3;
    outpatientParms.ResourceType = 100;
    outpatientParms.resourceId = this.DoctorCode;
    this._USS.setSessionKey('_outpatientParms' + 6, outpatientParms);

  }
  monthlyReservationTimes(e: any) {
    if (e && !e['AutoEmited'] && e['code']) {
      if (this.monthlyOrDaily == 3)
        this.monthlyDoctoroutPatient(e.code - 1);
      if (this.monthlyOrDaily == 1)
        this.onInquery()
    }
  }

  firstInit() {
    let date = new Date();
    this.monthNo = (date.getMonth() + 1);
    this.year = (date.getFullYear())
    let day = this._sharedDateService.day$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(day => {
        this.selectedDay.setValue(this._sharedDateService.convertFromDateToNgBsObject(day));

      }, null, () => { day.unsubscribe() })

    this.selectedDay.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe(day => {
      let Date = this._sharedDateService.convertFromNgBsToDate(this.selectedDay.value);
      this._USS.setSessionKey('day', day);


      this._USS.updateSessionKey('_outpatientParms', { 'ReservationDate': Date }, false);
    });
  }

  observeModal$() {
    this._USS.getModalKey$()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((keys: any) => {

        if (keys.name == 'DoctorReservationComponent' && keys.inputs) {
          this.DoctorCode = keys.inputs.resourceId
        }
      });
  }
  onInquery() {
    this._USS.setSessionKey('INQUERY_DATA', { docId: this.DoctorCode });

  }
}