
import { takeUntil } from 'rxjs/operators';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

//services
import { ControlsService, AppCodes, AppCodeGroup, ControlsParams } from './controls.service';
import { ActionIconService } from '../ui-component/action-icon/action-icon.service';
import { Utility } from "../../shared/utility";
import { UserSessionService } from '../../app-user-session.service';
import { ModalService } from '../modal';


@Component({
  selector: 'btns-ctrl',
  templateUrl: 'controls.component.html',
  providers: [ControlsService],
  styles: [`.ctrlBtn{
              margin-left:10px;
            }
            button{
              margin: 0 2px;
              padding: 6px 21px !important;
              transition: 0.4s ease !important;
              text-shadow: 0px 0px 1px #000;
              background-color: #24b4ea;
              border-color: #0000;
              color: #fff;
            }

            button:hover{
              background-color: #058cbf;
            }

            button:nth-of-type(2n){
              background-color: #12bd4f;
            }

            button:nth-of-type(2n):hover{
              background-color: #119a42;
              color: #fff;
              border-color: #0000;
            }
            .btn-submit{
              background: #178374;
              color: #fff;
              font-size: 18px;
              padding: 15px 30px;
              height: 44px;
              width: 200px;
              border-radius: 12px;
            }

  `]
})
export class ControlsComponent implements OnInit {

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  @Output() clicked: EventEmitter<number>;
  @Input() paramsArr: ControlsParams;
  @Input() tabindex: number;
  @Input() disabled: boolean;
  @Input() hidden: boolean;
  @Input() allowCashierClose: number;
  @Input() appCodes: AppCodes[] = [];
  @Input() noMargins: boolean;
  AppCodes: Observable<AppCodes[]>;

  constructor(
    private _controlsService: ControlsService,
    private actionIconService: ActionIconService,
    private _modalService: ModalService,

    public translate: TranslateService, private userSession: UserSessionService
  ) {
    this.clicked = new EventEmitter<number>();
  }

  _getControls(par: ControlsParams) {

    if (par && par.linkId) {
      this._controlsService.getControls(par.linkId, par.appCodeGroup, par.required).pipe(
        takeUntil(this.ngUnsubscribe))
        .subscribe((result) => {
          this.AppCodes = result.data;
        });
    }
  }
  _getComponentControls(par: ControlsParams) {

    if (par && par.appComponentName) {
      this._controlsService.getComponentControls(par.appComponentName, par.appCodeGroup, par.category)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(result => {
          this.AppCodes = result['data'];
        });
    }
  }

  alertSave: number = 0
  ngOnInit() {

    if (this.appCodes.length > 0) {
      this._getControlsFromAppCodes();
      return;
    }

    if (this.paramsArr && this.paramsArr.appComponentName) {
      this._getComponentControls(this.paramsArr);

    } else {
      this._getControls(this.paramsArr);
    }
    this.userSession.subscribeToKey$('link')
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((keys: any) => {
        if (keys.value) {
          this.alertSave = keys.value.showAlertInSave ? 1 : 0
          console.log(keys)
        }
      })
  }
  _getControlsFromAppCodes() {
    this.actionIconService
      .getControls(this.appCodes.toString())
      .subscribe(apps => {
        this.AppCodes = undefined;
        if (apps && apps.data) {
          this.AppCodes = apps.data;
        }
      });
  }
  controlClicked(e: any) {
    Utility.UiActive += '-' + e.serial;
    if (this.alertSave == 0)
      this.clicked.emit(e.serial);
    else {
      this._modalService.activeMes(`هل انت متاكد من هذه العمليه ` + e.nameAr, `Are you Sure To do this process` + e.nameEn).then(responseOK => {
        if (responseOK) {
          this.clicked.emit(e.serial);
        } else {



        }
      })
    }
  }
  emitClicked(keyCode) {
    if (!this.disabled)
      switch (keyCode) {
        case 117:
          this.clicked.emit(-1000); // f7
          break;
        case 118:
          this.clicked.emit(-1001); // f7
          break;
        case 119:
          this.clicked.emit(-1002); // f8
          break;
        default:
          console.log(keyCode);
          break;
      }
  }
  getCSSClasses(e: AppCodes) {
    let cssClasses;
    if (e.serial == 1 || e.serial == 6837 || e.serial == 5 || e.serial == 35 || e.serial == 2220 || e.serial == 333) {
      if (this.disabled) { cssClasses = 'disabledDiv'; }
    }
    if (e.serial == 2220) {
      if (this.hidden) { cssClasses = 'hiddenButton'; }
    }
    if (e.serial == 36) {
      if (this.allowCashierClose != undefined && this.allowCashierClose != 1) { cssClasses = 'disabledDiv'; }
    }
    return cssClasses;
  }
}
