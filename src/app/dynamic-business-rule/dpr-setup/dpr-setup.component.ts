

import { Component, OnInit, ViewChild, Input, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { Router,ActivatedRoute  } from '@angular/router';
import { AppCodeGroup, ControlsParams, UserSessionService } from '../../shared';
import {ToastService, Message, SelectizeComponent } from '../../blocks';
import { takeUntil } from 'rxjs/operators' ;  import { Subject } from 'rxjs';
//import { FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { DprSetupService , DbrSetup } from './dpr-setup-component.service';
@Component({
  selector: 'app-dpr-setup',
  templateUrl: './dpr-setup.component.html',
  styleUrls: ['./dpr-setup.component.css']
})
export class DprSetupComponent implements OnInit {
  controlsParams: ControlsParams;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  code: number;
  totalRecords: number = 0;
 dbrSetupData: DbrSetup[]; // save & onRowCLICK
 dbrSetupItem: DbrSetup[];

  constructor(
    private _dprSetupService: DprSetupService,
    private _toastService: ToastService,
    private _route: ActivatedRoute,
    private _location: Location)
  { this.controlsParams = new ControlsParams(null, AppCodeGroup.Buttons, true, 'DprSetupComponent', ''); }

  onClicked(e: number): void {
    switch (e) {
      case 1: //save code
      case -1000: //save code
        this.save();
        break;

    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }


  ngOnInit() {
    this.getDprSetup();
    //this.creatForm();
  }

  getDprSetup() {
    this._route
      .queryParams
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(anyObject => {
        this.code = +anyObject['code'] || null;
      });
    //  
    this.dbrSetupItem = [];

    this._dprSetupService.getDbrSetup(this.code)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
      searchResult => {
        this.dbrSetupItem = searchResult.data;
      }, error => console.log(error),
      () => null);
    

  }

  save() {
    let dbrSetupItem = this.dbrSetupItem;
    this.dbrSetupData = [];
    for (var i = 0; i < dbrSetupItem.length; i++) {
      if (dbrSetupItem[i].code == null) {
        dbrSetupItem[i].dataStatus = 1
        dbrSetupItem[i].code = (i + 1) * -1;
      
      }
      
    }
    this._dprSetupService.addDbrSetup(this.dbrSetupItem)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(c => {
        if (c["returnFlag"]) {
          this.getDprSetup();
        }
      });
  }


  addRow() {
    let t2 = <DbrSetup>{};
    t2.dataStatus = 1;
    this.dbrSetupItem.unshift(t2);

  }
  

  delete(dbrSetup: DbrSetup) {
    //
    this._dprSetupService.deleteDbrSetup(dbrSetup.code)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(c => {
        if (c["returnFlag"]) {
          this.getDprSetup();
        }
      });
  }
  onRowIconClick(actionCode: number, dbrSetup: DbrSetup) {
    this.dbrSetupData = [];
    if (actionCode == 403) {
      if (dbrSetup.code) {
        dbrSetup.dataStatus = 3;
        this.dbrSetupData.push(dbrSetup);
        this.delete(dbrSetup);
      }
      else {
        let ind = this.dbrSetupItem.indexOf(dbrSetup);
        this.dbrSetupItem.splice(ind, 1);
      }
    }
  }

  onRowDataChange(row, event) {
    row['dataStatus'] = 2;
  }

  updatePaginator() {
    this.totalRecords = (this.dbrSetupItem ? (this.dbrSetupItem.length > 0 ? this.dbrSetupItem[0].rowsCount : 0) : 0);
  }

  paginate(_parms: any) {

  }

}
