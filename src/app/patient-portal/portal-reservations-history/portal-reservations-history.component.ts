import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { PortalAuthService } from '../portal-login/portal-auth.service';
import { PortalVisitsHistoryService } from '../portal-visits-history/portal-visits-history.service';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { PortalReservationsHistoryService } from './portal-reservations-history.service';
import { OutpatientParms } from '../../shared';
import { ToastService } from '../../blocks';
import { FormControl } from '@angular/forms';
// import * as _ from 'underscore';
@Component({
  selector: 'portal-reservations-history',
  templateUrl: './portal-reservations-history.component.html',
  styleUrls: ['./portal-reservations-history.component.css']
})
export class PortalReservationsHistoryComponent implements OnInit {

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  reservationsList: any[] = [];
  searchOnAllVisits: any = [];
  p =0;
  searchInputControl = new FormControl();
  constructor(
    public translate: TranslateService,
    private _toastr: ToastService,
    private _authServ: PortalAuthService,
    private _reservationHistory: PortalReservationsHistoryService) { }

  ngOnInit() {
    this.creatpsearch();
    let patCode = this._authServ.getPatientCode;
    if (patCode && patCode > 0) {
      this.getAllReservationsData(patCode);
    }
  }

  getAllReservationsData(patCode: number) {
    if (patCode > 0) {
      this._reservationHistory.getAllPatientReservationsHistory(<OutpatientParms>{ patCode: patCode, serviceStatus: 1 })
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(
          res => {
            if (res && res.data) {
              this.reservationsList = res.data;
              this.searchOnAllVisits = Object.assign([], this.reservationsList);
            }
          },
          err => console.error(err)
        )
    } else {
      this._toastr.toastMsg('Please Select Patient First!', 'Warning', 'Warn');
    }
  }


  //search area
  creatpsearch() {
    this.searchInputControl.valueChanges.subscribe(x => {
      debounceTime(100);
      this.searchOnfavList(x);

    })
  }
  ////////////////////////////////////////////
  searchOnfavList(value: string) {
    let exp = /^[A-Za-z][A-Za-z0-9_ ]*$/;
    if (value && value.length > 0) {
      this.reservationsList = [];
      if (exp.test(value) || value == '') {
        this.reservationsList = this.searchOnAllVisits.filter(s => s['visitSerial'].includes(value));
      }
      else {
        if (isNaN(+value)) {
          this.reservationsList = this.searchOnAllVisits.filter(s => s['visitSerial'].includes(value));
        } else {
          this.reservationsList = this.searchOnAllVisits.filter(s => s['visitSerial'] == +value);
        }
      }
    }
    if (value.length == 0) {
      this.reservationsList = this.searchOnAllVisits;
    }
  }
}
