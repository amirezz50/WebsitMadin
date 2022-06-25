
import { Component, OnInit, ViewChild, Input, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { AppCodeGroup, ControlsParams, UserSessionService } from '../../shared';
import { ToastService, Message, SelectizeComponent } from '../../blocks';
import { takeUntil } from 'rxjs/operators' ;  import { Subject } from 'rxjs';
//import { FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { DbrParmsUserService , DbrParmsUser } from './dbr-parms-user.component.service';
@Component({
  selector: 'app-dbr-parms-user',
  templateUrl: './dbr-parms-user.component.html',
  styleUrls: ['./dbr-parms-user.component.css']
})
export class DbrParmsUserComponent implements OnInit {

  controlsParams: ControlsParams;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  code: number;
  totalRecords: number = 0;
  dbrParmsUserData: DbrParmsUser[]; // save & onRowCLICK
  dbrParmsUserItem: DbrParmsUser[];
  constructor(
    private _dbrParmsUserService: DbrParmsUserService,
    private _toastService: ToastService,
    private _route: ActivatedRoute,
    private _location: Location)
  { this.controlsParams = new ControlsParams(null, AppCodeGroup.Buttons, true, 'DbrParmsUserComponent', ''); }


  onClicked(e: number): void {
    switch (e) {
      case 1: //save code
        this.save();
        break;
      default:
        this._goBack();

    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }


  ngOnInit() {
    this.getDbrParmsUser();
    //this.creatForm();
  }


  getDbrParmsUser() {
    this._route
      .queryParams
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(anyObject => {
        this.code = +anyObject['code'] || null;
      });
    //  
    this.dbrParmsUserItem = [];

    this._dbrParmsUserService.getDbrParmsUser(this.code)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
      searchResult => {
        this.dbrParmsUserItem = searchResult.data;
      }, error => console.log(error),
      () => null);

  }

  save() {
    let dbrParmsUserItem = this.dbrParmsUserItem;
    this.dbrParmsUserData = [];
    //  this.emrSheetsDictionarySerial = this.serial;
    for (var i = 0; i < dbrParmsUserItem.length; i++) {
      if (dbrParmsUserItem[i].code == null) {
        dbrParmsUserItem[i].dataStatus = 1
        dbrParmsUserItem[i].code = (i + 1) * -1;
      //  this.dbrParmsUserData.push(dbrParmsUserItem[i]);
      }
      //else {
      //  if (dbrParmsUserItem[i].dataStatus == 2) {
      //    this.dbrParmsUserData.push(dbrParmsUserItem[i]);
      //  }
      //}
    }
    this._dbrParmsUserService.addDbrParmsUser(this.dbrParmsUserData)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(c => {
        if (c["returnFlag"]) {
          this.getDbrParmsUser();
        }
      });
  }


  addRow() {
    let t2 = <DbrParmsUser>{};
    t2.dataStatus = 1;
    this.dbrParmsUserItem.unshift(t2);

  }

  handelDbMessage(c: Message[]): void {
    if (this._toastService.HandelDbMessages(c) == true)
      this._goBack();
  }




  isAddMode() {
    let id = +this._route.snapshot.params['id'];
    return isNaN(id) || id == null;
  }

  _goBack(): void {
    this._location.back();
  }


  delete(dbrParmsUser: DbrParmsUser) {
 
    this._dbrParmsUserService.deleteDbrParmsUser(dbrParmsUser.code)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(c => {
        if (c["returnFlag"]) {
          this.getDbrParmsUser();
        }
      });
  }


  onRowIconClick(actionCode: number, dbrParmsUser: DbrParmsUser) {
    this.dbrParmsUserData = [];
    if (actionCode == 403) {
      if (dbrParmsUser.code) {
        dbrParmsUser.dataStatus = 3;
        this.dbrParmsUserData.push(dbrParmsUser);
        this.delete(dbrParmsUser);
      }
      else {
        let ind = this.dbrParmsUserItem.indexOf(dbrParmsUser);
        this.dbrParmsUserItem.splice(ind, 1);
      }
    }
  }

  onRowDataChange(row, event) {

    row['dataStatus'] = 2;

  }

  updatePaginator() {
    this.totalRecords = (this.dbrParmsUserItem ? (this.dbrParmsUserItem.length > 0 ? this.dbrParmsUserItem[0].rowsCount : 0) : 0);
  }

  paginate(_parms: any) {

  }

}
