
import { Component, OnInit, ViewChild, Input, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { AppCodeGroup, ControlsParams, UserSessionService,DBRParms } from '../../shared';
import { ToastService, Message, SelectizeComponent } from '../../blocks';
import { takeUntil } from 'rxjs/operators' ;  import { Subject } from 'rxjs';
//import { FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { DbrParmsService, DbrParms } from './dbr-parms.component.service';
@Component({
  selector: 'app-dbr-parms',
  templateUrl: './dbr-parms.component.html',
  styleUrls: ['./dbr-parms.component.css']
})
export class DbrParmsComponent implements OnInit {

  controlsParams: ControlsParams;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  code: number;
  dbrParmsData: DbrParms[]; // save & onRowCLICK
  dbrParmsItem: DbrParms[];
  totalRecords: number = 0;
  toggleFillter: boolean = true;
  searchObj: DBRParms = <DBRParms>{};
  constructor(

    private _dbrParmsService: DbrParmsService,
    private _toastService: ToastService,
    private _route: ActivatedRoute,
    private _location: Location)
  { this.controlsParams = new ControlsParams(null, AppCodeGroup.Buttons, true, 'DbrParmsComponent', ''); }


  onClicked(e: number): void {
    switch (e) {
      case 1: //save code
      case -1000: //save code
        this.save();
        break;
     

    }
  }

  togglefillter() {
    this.toggleFillter = !this.toggleFillter;
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit() {
  }

  getDbrParms(_parms) {
   // 
    this.dbrParmsItem = [];
    this._dbrParmsService.getDbrParms(_parms.DBRDevRParmsCode)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
      searchResult => {
        this.dbrParmsItem = searchResult.data;
      }, error => console.log(error),
      () => null);
  }


  save() {
    let dbrParmsItem = this.dbrParmsItem;
    this.dbrParmsData = [];
    //  this.emrSheetsDictionarySerial = this.serial;
    for (var i = 0; i < dbrParmsItem.length; i++) {
      if (dbrParmsItem[i].code == null) {
        dbrParmsItem[i].dataStatus = 1
        dbrParmsItem[i].code = (i + 1) * -1;
        this.dbrParmsData.push(dbrParmsItem[i]);
      }
      else {
        if (dbrParmsItem[i].dataStatus == 2) {
          this.dbrParmsData.push(dbrParmsItem[i]);
        }
      }
    }
    this._dbrParmsService.addDbrParms(this.dbrParmsData)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(c => {
        if (c["returnFlag"]) {
          this.getDbrParms(this.searchObj);
        }
      });
  }

  addRow() {
    let t2 = <DbrParms>{};
    t2.dataStatus = 1;
    this.dbrParmsItem.unshift(t2);

  }

  delete(dbrParms: DbrParms) {
    this._dbrParmsService.deleteDbrParms(dbrParms.code)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(c => {
        if (c["returnFlag"]) {
          this.getDbrParms(this.searchObj);
        }
      });
  }

  onRowIconClick(actionCode: number, dbrParms: DbrParms) {
    this.dbrParmsData = [];
    if (actionCode == 403) {
      if (dbrParms.code) {
        dbrParms.dataStatus = 3;
        this.dbrParmsData.push(dbrParms);
        this.delete(dbrParms);
      }
      else {
        let ind = this.dbrParmsItem.indexOf(dbrParms);
        this.dbrParmsItem.splice(ind, 1);
      }
    }
  }

  onRowDataChange(row, event) {

    row['dataStatus'] = 2;

  }

  updatePaginator() {
    this.totalRecords = (this.dbrParmsItem ? (this.dbrParmsItem.length > 0?  this.dbrParmsItem[0].rowsCount : 0) : 0);
   }

  paginate(_parms: any) {

  }

}
