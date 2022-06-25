import { Component, OnInit, ViewChild, Input, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { AppCodeGroup, ControlsParams, UserSessionService } from '../../shared';
import { ToastService, Message, SelectizeComponent } from '../../blocks';
import { takeUntil } from 'rxjs/operators' ;  import { Subject } from 'rxjs';
import { DbrOutputsService ,DbrOutput } from './dbr-outputs-component.service';
//import { FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';
@Component({
  selector: 'app-dbr-outputs',
  templateUrl: './dbr-outputs.component.html',
  styleUrls: ['./dbr-outputs.component.css']
})
export class DbrOutputsComponent implements OnInit {
  controlsParams: ControlsParams;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  code: number;
  dbrOutputData: DbrOutput[]; // save & onRowCLICK
  dbrOutputItem: DbrOutput[];
  totalRecords: number = 0;


  constructor(
    private _dbrOutputsService: DbrOutputsService,
    private _toastService: ToastService,
    private _route: ActivatedRoute,
    private _location: Location)
  { this.controlsParams = new ControlsParams(null, AppCodeGroup.Buttons, true, 'DbrOutputsComponent', ''); }


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
    this.getDbrOutput();
    //this.creatForm();
  }


  getDbrOutput() {
    this._route
      .queryParams
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(anyObject => {
        this.code = +anyObject['code'] || null;
      });
    //  
    this.dbrOutputItem = [];

    this._dbrOutputsService.getDbrOutput(this.code)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
      searchResult => {
        this.dbrOutputItem = searchResult.data;
      }, error => console.log(error),
      () => null);

  }

  save() {
    let dbrOutputItem = this.dbrOutputItem;
    this.dbrOutputData = [];
    //  this.emrSheetsDictionarySerial = this.serial;
    for (var i = 0; i < dbrOutputItem.length; i++) {
      if (dbrOutputItem[i].code == null) {
        dbrOutputItem[i].dataStatus = 1
        dbrOutputItem[i].code = 0;
        this.dbrOutputData.push(dbrOutputItem[i]);
      }
      else {
        if (dbrOutputItem[i].dataStatus == 2) {
          this.dbrOutputData.push(dbrOutputItem[i]);
        }
      }
    }
    this._dbrOutputsService.addDbrOutput(this.dbrOutputData)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(c => {
        if (c["returnFlag"]) {
          this.getDbrOutput();
        }
      });
  }


  addRow() {
    let t2 = <DbrOutput>{};
    t2.dataStatus = 1;
    this.dbrOutputItem.unshift(t2);

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


  delete(dbrOutput: DbrOutput) {
    
    this._dbrOutputsService.deleteDbrOutput(dbrOutput.code)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(c => {
        if (c["returnFlag"]) {
          this.getDbrOutput();
        }
      });
  }


  onRowIconClick(actionCode: number, dbrOutput: DbrOutput) {
    this.dbrOutputData = [];
    if (actionCode == 403) {
      if (dbrOutput.code) {
        dbrOutput.dataStatus = 3;
        this.dbrOutputData.push(dbrOutput);
        this.delete(dbrOutput);
      }
      else {
        let ind = this.dbrOutputItem.indexOf(dbrOutput);
        this.dbrOutputItem.splice(ind, 1);
      }
    }
  }

  onRowDataChange(row, event) {

    row['dataStatus'] = 2;

  }

  updatePaginator() {
    this.totalRecords = (this.dbrOutputItem ? (this.dbrOutputItem.length > 0 ? this.dbrOutputItem[0].rowsCount : 0) : 0);
  }

  paginate(_parms: any) {

  }

}
