
import { Component, OnInit, ViewChild, Input, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { AppCodeGroup, ControlsParams, UserSessionService } from '../../shared';
import { ToastService, Message, SelectizeComponent } from '../../blocks';
import { takeUntil } from 'rxjs/operators' ;  import { Subject } from 'rxjs';
//import { FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { DbrSetupUserService ,DbrSetupUser } from './dbr-setup-user.component.service';
@Component({
  selector: 'app-dbr-setup-user',
  templateUrl: './dbr-setup-user.component.html',
  styleUrls: ['./dbr-setup-user.component.css']
})
export class DbrSetupUserComponent implements OnInit {
  controlsParams: ControlsParams;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  code: number;
  totalRecords: number = 0;
  dbrSetupUserData: DbrSetupUser[]; // save & onRowCLICK
  dbrSetupUserItem: DbrSetupUser[];

  constructor(private _dbrSetupUserService: DbrSetupUserService,
    private _toastService: ToastService,
    private _route: ActivatedRoute,
    private _location: Location)
  { this.controlsParams = new ControlsParams(null, AppCodeGroup.Buttons, true, 'DbrSetupUserComponent', '');}


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
    this.getDprSetupUser();
    //this.creatForm();
  }

  getDprSetupUser() {
    this._route
      .queryParams
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(anyObject => {
        this.code = +anyObject['code'] || null;
      });
    //  
    this.dbrSetupUserItem = [];

    this._dbrSetupUserService.getDbrSetupUser(this.code)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
      searchResult =>{
        this.dbrSetupUserItem = searchResult.data;
      }, error => console.log(error),
      () => null);


  }

  save() {
    
    let dbrSetupUserItem = this.dbrSetupUserItem;
    this.dbrSetupUserData = [];
    for (var i = 0; i < dbrSetupUserItem.length; i++) {
      if (dbrSetupUserItem[i].code == null) {
        dbrSetupUserItem[i].dataStatus = 1
        dbrSetupUserItem[i].code = (i + 1) * -1;
        // this.dbrSetupData.push(dbrSetupItem[i]);
      }
      //else {
      //  if (dbrSetupItem[i].dataStatus == 2) {
      //    this.dbrSetupData.push(dbrSetupItem[i]);
      //  }
      //}
    }
    this._dbrSetupUserService.addDbrSetupUser(this.dbrSetupUserItem)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(c => {
        if (c["returnFlag"]) {
          this.getDprSetupUser();
        }
      });
  }


  addRow() {
    let t2 = <DbrSetupUser>{};
    t2.dataStatus = 1;
    this.dbrSetupUserItem.unshift(t2);

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


  delete(dbrSetupUser: DbrSetupUser) {
    //
    this._dbrSetupUserService.deleteDbrSetupUser(dbrSetupUser.code)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(c => {
        if (c["returnFlag"]) {
          this.getDprSetupUser();
        }
      });
  }


  onRowIconClick(actionCode: number, dbrSetupUser: DbrSetupUser) {
    this.dbrSetupUserData = [];
    if (actionCode == 403) {
      if (dbrSetupUser.code) {
        dbrSetupUser.dataStatus = 3;
        this.dbrSetupUserData.push(dbrSetupUser);
        this.delete(dbrSetupUser);
      }
      else {
        let ind = this.dbrSetupUserItem.indexOf(dbrSetupUser);
        this.dbrSetupUserItem.splice(ind, 1);
      }
    }
  }

  onRowDataChange(row, event) {

    row['dataStatus'] = 2;

  }

  updatePaginator() {
    this.totalRecords = (this.dbrSetupUserItem ? (this.dbrSetupUserItem.length > 0 ? this.dbrSetupUserItem[0].rowsCount : 0) : 0);
  }

  paginate(_parms: any) {

  }

}
