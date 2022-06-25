import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';

import { takeUntil } from 'rxjs/operators' ;  import { Subject } from 'rxjs';
import { SelectizeComponent, AppCodes, ToastService } from '../../blocks';
import { AppCodeGroup, ControlsParams, SharedDateService, UserSessionService } from '../../shared';
@Component({
  selector: 'app-dbr-taps',
  templateUrl: './dbr-taps.component.html',
  styleUrls: ['./dbr-taps.component.css']
})
export class DbrTapsComponent implements OnInit, OnDestroy {

  activedbrTaps: number = 2320
  tab2320Activated: boolean = false;////==========================/قواعاد التشغيل 
  tab2321Activated: boolean = false;////====================/ مدخلات قواعد التشغيل
  tab2322Activated: boolean = false;////==================/مخرجات قواعد التشغيل

  dbrTaps: ControlsParams;
  modeType: number;
  private ngUnsubscribe: Subject<void> = new Subject<void>();


  constructor(
    public translate: TranslateService,
    private _route: ActivatedRoute,
    private _userSessionService: UserSessionService, )
  {
    this.dbrTaps = new ControlsParams(5236, AppCodeGroup.Tabs, true);
  }

  ngOnInit() {

    if (this._userSessionService.getSessionKey<any>('link')) {
      let link = this._userSessionService.getSessionKey('link');
      this.dbrTaps = new ControlsParams(link['code'], AppCodeGroup.Tabs, true);
    } else
      this.modeType = +this._route.snapshot.params['mode'];

  }


  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  activatedbrTaps(e: AppCodes) {

    this.activedbrTaps = e.code;

    if (this.activedbrTaps == 2320)
      this.tab2320Activated = true;

    if (this.activedbrTaps == 2321) {
      this.tab2321Activated = true;
    }
    if (this.activedbrTaps == 2322) {
      this.tab2322Activated = true;
    }
  }



}

