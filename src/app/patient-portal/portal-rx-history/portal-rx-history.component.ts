import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { StockParms, UserSessionService } from '../../shared';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { PortalAuthService } from '../portal-login/portal-auth.service';
import { PortalVisitsHistoryService } from '../portal-visits-history/portal-visits-history.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-portal-rx-history',
  templateUrl: './portal-rx-history.component.html',
  styleUrls: ['./portal-rx-history.component.css']
})
export class PortalRxHistoryComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  rxhistory: any[] = [];
  stockParms: StockParms = <StockParms>{};
  searchInputControl = new FormControl();
  constructor(
    public translate: TranslateService,
    private _auth: PortalAuthService,
    private _userSessionService: UserSessionService,
    private _rxHistoryService: PortalVisitsHistoryService
    ) { }

  ngOnInit() {
    this.creatpsearch();
    this.getRxHistoryData();
  }
  //search area
  creatpsearch() {
    this.searchInputControl.valueChanges.subscribe(x => {
      debounceTime(100);
      this.searchOnfavList(x);
    })
  }
  ////////////////////////////////////////////
  searchOnAll: any = [];
  searchOnfavList(value: string) {
    let exp = /^[A-Za-z][A-Za-z0-9_ ]*$/;
    if (value && value.length > 0) {
      this.rxhistory = [];
      if (exp.test(value) || value == '') {
        this.rxhistory = this.searchOnAll.filter(s => s['docNameAr'].includes(value));
      }
      else {
        if (isNaN(+value)) {
          this.rxhistory = this.searchOnAll.filter(s => s['docNameAr'].includes(value));
        } else {
          this.rxhistory = this.searchOnAll.filter(s => s['visitSerial'] == +value);
        }
      }
    }
    if (value.length == 0) {
      this.rxhistory = this.searchOnAll;
    }
  }
  setdata(row:any){
    if(row && row.serial)
    this._userSessionService.setSessionKey('rxMasterPrint', row.serial);
  }
  getRxHistoryData() {
    this.stockParms.patCode = this._auth.getPatientCode;
    this.stockParms.visitsList = '1';
    if (this.stockParms.patCode > 0)
      this._rxHistoryService.getrxHistory(this.stockParms)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(res => {
          this.rxhistory = res ? res.data1 : [];
          this.searchOnAll = Object.assign([], this.rxhistory);
        });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onRowIconClick(actionCode: number, rowData: any) {
    if (rowData && rowData.serial)
      this._userSessionService.setSessionKey("rxMasterSerial", rowData.serial);
    if (actionCode == 2262 || actionCode == 404)
      this.openRxPrint(rowData.serial);
  }
  openRxPrint(serial: any) {
    this
  }

}
