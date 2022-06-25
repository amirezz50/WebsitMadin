import { Component, OnInit } from '@angular/core';
import { PortalVisitsHistoryService } from './portal-visits-history.service';
import { PortalAuthService } from '../portal-login/portal-auth.service';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-portal-visits-history',
  templateUrl: './portal-visits-history.component.html',
  styleUrls: ['./portal-visits-history.component.css']
})
export class PortalVisitsHistoryComponent implements OnInit {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  allVisits: any[] = [];
  searchInputControl = new FormControl();
  p: number = 1;

  constructor(
    public translate: TranslateService,
    private _authServ: PortalAuthService,
    private _visitHistory: PortalVisitsHistoryService) { }
  ngOnInit() {
    this.creatpsearch();
    let patCode = this._authServ.getPatientCode;
    if (patCode && patCode > 0) {
      this.getAllVisitsData(patCode);
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
  searchOnAllVisits: any = [];
  searchOnfavList(value: string) {
    let exp = /^[A-Za-z][A-Za-z0-9_ ]*$/;
    if (value && value.length > 0) {
      this.allVisits = [];
      if (exp.test(value) || value == '') {
        this.allVisits = this.searchOnAllVisits.filter(s => s['docNameAr'].includes(value));
      }
      else {
        if (isNaN(+value)) {
          this.allVisits = this.searchOnAllVisits.filter(s => s['docNameAr'].includes(value));
        } else {
          this.allVisits = this.searchOnAllVisits.filter(s => s['visitSerial'] == +value);
        }
      }
    }
    if (value.length == 0) {
      this.allVisits = this.searchOnAllVisits;
    }
  }
  getAllVisitsData(patCode: number) {
    if (patCode > 0) {
      this._visitHistory.getAllPatientVisits(<any>{ patCode: patCode })
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(
          res => {
            if (res && res.data) {
              this.allVisits = res.data;
              this.searchOnAllVisits = Object.assign([], this.allVisits);

            }
          },
          err => console.error(err)
        )
    } else {
      console.error('Please Select Patient First!');
    }
  }
}
