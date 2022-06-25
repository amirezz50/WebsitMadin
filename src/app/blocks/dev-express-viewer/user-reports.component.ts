import { Component, Input, EventEmitter, Output, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UserSessionService, unflatten} from '../../shared';
import { takeUntil } from 'rxjs/operators' ;import { Observable ,  Subject } from 'rxjs';
import { ReportService } from './report.service';
@Component({
  selector: 'app-user-reports',
  templateUrl: 'user-reports.component.html',
  styleUrls: []

})
export class UserReports implements OnInit, AfterViewInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  groups: any[];
  currentGroupCode: number; 
  currentReport: any;
  constructor(public translate: TranslateService,
    private _userSessionService: UserSessionService,
    private reportService: ReportService) { }

  ngOnInit() {

  }
  ngAfterViewInit() {
     // this.route.params.subscribe(parm => {
    this.getReportsBySecLogin();
    //  })
  }

  getReportsBySecLogin() {
    this.reportService
      .getReportsBySecLogin()// 
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        if (res["data"]) {
        
          this.groups = unflatten(res.data, { id: 'code', parentId: 'parentCode' });
        }

      })
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();

  }
  onGroupClick(group: any) {
   
    this.currentGroupCode = group['code'];
  }
  onReportClick(reportLink: any) {
    
    this.currentReport = reportLink;
    this._userSessionService.setSessionKey('reportLink', reportLink);
  }
}


