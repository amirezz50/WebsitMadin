import { Component, ViewChild, EventEmitter, Output, Input, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ActionIconService, AppCodes } from './action-icon.service';
import { UserSessionService } from '../../../app-user-session.service';
import { takeUntil } from 'rxjs/operators'; 
import { Subject } from 'rxjs';

import { MatMenuTrigger } from '@angular/material';
import { DomHandler } from '../../../primeng/dom/domhandler';


@Component({
  selector: 'icon-action',
  templateUrl: './action-icon.component.html',
})

export class IconActionComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  @ViewChild(MatMenuTrigger, { static: false }) trigger: MatMenuTrigger;

  someMethod() {
  }
  hiddenFlag: boolean = true;
  @Output() clicked: EventEmitter<number>;
  @Output() actionclicked: EventEmitter<any>;
  @Input() parentUIKey: string;
  @Input() rowActiveAction: Function;
  @Input() rowData: any;
  @Input() fireFirstAfterInit: boolean;
  //*********************************************
  @Input() tabindex: number;
  @Input() selectizeOptionsView: any = [];

  @Input() appCodes: AppCodes[] = [];
  @Input() defaultAppCode: number;
  @Input() iconColor: string;
  defaultAction: AppCodes;
  appCodesResult: AppCodes[] = [];

  static x = 10;

  //*******************************************


  constructor(
    private elementRef: ElementRef,
    private domHandler: DomHandler,
    public translate: TranslateService,
    private _USS: UserSessionService,
    private _AIS: ActionIconService
  ) {
    this.clicked = new EventEmitter<number>();
    this.actionclicked = new EventEmitter<any>();
  }

  ngOnInit() {

    this._getControls();
    if(!this.iconColor){
      this.iconColor= '#0999d0'
    }

  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  _getControls() {
    const _data = this._AIS.getCachedAppCodes('actions', this.appCodes);
    if (_data.length > 0) {
      this.handeldbData(_data);
      return;
    }
    this._AIS
      .getControls(this.appCodes.toString())
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(apps => {
        this.appCodesResult = []
        if (apps && apps.data) {
          this._AIS.cachAppCodes('actions', this.appCodes, apps['data']);
          this.handeldbData(apps.data);
        }
      }, null,
        () => {
        });
  }
  highlight() {
    let parentElement = this.elementRef.nativeElement.parentElement;
    var TDel;
    for (var i = 0; i < 10; i++) {
      if (parentElement['parentElement']) {
        parentElement = parentElement['parentElement']
      }
      if (parentElement['tagName'] == 'TABLE') {
        this.domHandler.find(parentElement, '.actionT-DT-highlight').forEach(item => {
          this.domHandler.removeClass(item, "actionT-DT-highlight");
        }
        );
        break;
      }
    }
    var el = this.elementRef.nativeElement.parentElement;
    for (var i = 0; i < 10; i++) {
      if (el['parentElement']) {
        el = el['parentElement']
      }
      if (el['tagName'] == 'TR') {
        this.domHandler.addClass(el, 'actionT-DT-highlight');
        break;
      }
    }
  }
  action(_action: any) {

    this.toggleActionRow(_action);
    this.CheckActiveAppCodes();
    this.highlight();
    this._USS.setUIState(_action, this.parentUIKey);
    this.clicked.emit(_action.serial);
    this.actionclicked.emit(_action);
  }
  toggleActionRow(_action: any) {

    this.UpdateFlaggedCodes(_action.serial);

  }
  afterInit() {
    if (this.fireFirstAfterInit && this.appCodesResult && this.appCodesResult.length > 0) {
      this.action(this.appCodesResult[0]);
      this.CheckActiveAppCodes();
    }
  }
  getActiveAction(rowData: any) {
    let activeActions = [];
    if (this.rowActiveAction) {
      let activeAction = this.rowActiveAction.call(this, rowData, this.appCodesResult);
      if (activeAction) {
        activeActions = activeActions.concat(activeAction);
      }
    } else {
      return this.appCodesResult;
    }
    return activeActions;
  }
  toggleActions() {
    this.highlight();
    this.trigger.openMenu();
    // this.trigger.toggleMenu();
  }
  handeldbData(_data: any[]) {
    _data.forEach(item => {
      if (item.visible != 0) {
        if (item.cssClasses == '' || item.cssClasses == undefined)
          item.cssClasses = 'fa-arrows';
        this.appCodesResult.push(item);
      }
    });
    this.appCodesResult = this.getActiveAction(this.rowData);

  this.CheckActiveAppCodes();

    this.afterInit();

    if (this.appCodesResult && this.appCodesResult.length > 0) {
      if (this.defaultAppCode == undefined) {
        this.defaultAction = this.appCodesResult[0];
      } else {

      }
    }

  }
  CheckActiveAppCodes() {
    this.appCodesResult.forEach(appCode => {
      if (this.selectizeOptionsView.indexOf(appCode.serial, 0) >= 0) {
        appCode.iconeFlagTogglerValue = true;
      } else {
        appCode.iconeFlagTogglerValue = false;
      }
    });
  }
  UpdateFlaggedCodes(code: any) {
    if (this.selectizeOptionsView.indexOf(code, 0) >= 0) {
      for (var i = 0; i < this.selectizeOptionsView.length; i++) {
        if (this.selectizeOptionsView[i] === code) {
          this.selectizeOptionsView.splice(i, 1);
        }
      }
    }
    else {
      this.selectizeOptionsView.push(code);
    }
    this.CheckActiveAppCodes();
  }
  onmouseout() {
    //this.hiddenFlag = true;
    this.trigger.closeMenu();

  }
  onmouseover() {
    // this.highlight();
    // this.trigger.openMenu();
  }

  alert() {
    alert('hi');
  }

}

enum actionCode {
  Add = 1,
  Edit = 2,
  Delete = 3,
  CancelVisit = 20,
  EndVisit = 21,
  ReopenVisit = 22,
  QualificationCat = 23,
  DoctorAppointments = 27,
  Booked = 300,
  Arrived = 301,
  CheckedIn = 302,
  CheckedOut = 303,
  Cancel = 304,
  NotShow = 305,
  Paying = 306,
  modifing = 307,
  printReciept = 333

}
