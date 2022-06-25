import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';

import { takeUntil } from 'rxjs/operators' ;  import { Subject } from 'rxjs';
import {AppCodes } from '../../blocks';
import { AppCodeGroup, ControlsParams, SharedDateService, UserSessionService } from '../../shared';
@Component({
  selector: 'app-dbr-taps-user',
  templateUrl: './dbr-taps-user.component.html',
  styleUrls: ['./dbr-taps-user.component.css']
})
export class DbrTapsUserComponent implements OnInit {


  activedbrTapsUser: number = 2327
  tab2327Activated: boolean = false;   ////==========================/قواعاد تشغيل المستخدم 
  tab2328Activated: boolean = false;   ////====================/ مدخلات قواعد تشغيل المستخدم
  dbrTapsUser: ControlsParams;
  modeType: number;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  constructor(public translate: TranslateService,
    private _route: ActivatedRoute,
    private _userSessionService: UserSessionService, )
  { this.dbrTapsUser = new ControlsParams(5327, AppCodeGroup.Tabs, true); }

  ngOnInit() {

    if (this._userSessionService.getSessionKey<any>('link')) {
      let link = this._userSessionService.getSessionKey('link');
      this.dbrTapsUser = new ControlsParams(link['code'], AppCodeGroup.Tabs, true);
    } else
      this.modeType = +this._route.snapshot.params['mode'];

  }


  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  activatedbrTapsUser(e: AppCodes) {

    this.activedbrTapsUser = e.code;

    if (this.activedbrTapsUser == 2327)
      this.tab2327Activated = true;

    if (this.activedbrTapsUser == 2328) {
      this.tab2328Activated = true;
    }
  }



}

