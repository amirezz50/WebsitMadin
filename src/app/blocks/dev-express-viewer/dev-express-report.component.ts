import { NgModule, Component, EventEmitter, Input, Output, OnInit, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes, ActivatedRoute } from '@angular/router';

import { DevExpressViewerComponent } from './report-viewer.component';
import { HtmlViewerComponent } from './html-viewer.component';
import { UserReports } from './user-reports.component';

import { FastSearchModule } from '../ui-component/fast-search/fast-search.module';
import { FastSearchComponent } from '../ui-component/fast-search/fast-search.component';
import { UserSessionService } from '../../shared';
import { takeUntil } from 'rxjs/operators'; import { Observable, Subject } from 'rxjs';
import { ReportService } from './report.service';
import { CONFIG } from '../../shared/config';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'dev-express-report',
  templateUrl: './dev-express-report.component.html',
  styles: []


})


export class DevExpressReportComponent implements OnInit, AfterViewInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  @Input() showCriteria: boolean = true;
  @Input() userAllReports: boolean = false;
  @ViewChild('fastSearch', { static: false }) fastSearch: FastSearchComponent;
  mode: number;
  @Input() repType: number;
  reportUrl: string = 'http://localhost/BaseReport';
  // search object
  arguments: any;
  @Input()
  set _dbResult(value) {
    this.dbResult = value;
  }
  get _dbResult() {
    return this.dbResult;
  }

  // arabic name for current report
  reportNameAr: string;
  // english  name for current report
  reportNameEn: string;
 
  // name for current report
  reportClassName: string;
  reportActionName: string;
  reportControllerName: string;
  reportName: string
  // current fast search app codes
  appCodes: number[] = [];
  multiAppCodes: number[] = [];
  appCodesSearchKeys: any = {}
  staticFlagAppCodes: number[] = [];

  reportCriterias: any[] = [];

  reportClassNames: { code: number, name: string }[] = [];
  // report serial for this link in
  reportsIds: { reportSerial: number, nameAr: string, nameEn: string, selected: boolean }[] = [];

  // flag to load fast search after load app code form database
  isLoaded = false;
  // flag to reset component after route change
  isChanged = false;

  viewerIsHidden = true;

  _reportCriteria = {};

  @Input() get reportCriteria() {
    return this._reportCriteria;
  }

  set reportCriteria(val) {

    if (this._reportCriteria['claimId'] == (null || undefined)) {
      this._reportCriteria = val;
      this.isLoaded = true;
    }
    if (!this.arguments) {
      this.arguments = val;
    }
    else {
      this.reportClassName = this.reportCriteria['reportClassName'];
      this.onSearchClick(this.reportCriteria);
    }

  }
  constructor(private route: ActivatedRoute,
    private _userSessionService: UserSessionService,
    public translate: TranslateService,
    private reportService: ReportService) { }


  ngOnInit() {
    this.reportUrl = CONFIG.Urls.reportUrl;
   localStorage.setItem('currentUser', sessionStorage.getItem('currentUser'));
    this.reportLink$();
  }
  ngAfterViewInit() {
    if (this.userAllReports) {//if  user-reports  active  
      var reportLink = this._userSessionService.getSessionKey('reportLink');
      if (reportLink && reportLink['code']) {
        this.getReportsByLink(reportLink['code'], true);
      }
      return;
    }

    if (this.showCriteria) {
      this.route.params.pipe(takeUntil(this.ngUnsubscribe)).subscribe(parm => {
        this.getReportsByLink(parm['linkId'], true);
      })
    } else {
      this.reportClassName = this.reportCriteria['reportClassName'];
      this.onSearchClick(this.reportCriteria);
    }

    this._userSessionService.getSessionKey$('reportCriteria')
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((keys: any) => {
        if (keys.name == 'reportCriteria' && keys.value) {

          let reportCriteria = keys.value;
          this._reportCriteria = reportCriteria;
          this.showCriteria = this._reportCriteria['showCriteria'];
          this.isLoaded = true;
          this.arguments = reportCriteria;
          this.arguments["Auth"] = this.getAuthParms();
          this.viewerIsHidden = true
          setTimeout(() => {
            this.viewerIsHidden = false
          }, 1000);

        }
      })


  }
  ngOnDestroy() {

    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();

  }
  //-----observable on curent link on  user  reports 
  reportLink$() {

    this._userSessionService.getSessionKey$('reportLink')
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((keys: any) => {
        if (keys.name == 'reportLink' && keys.value) {
          this.getReportsByLink(keys.value['code'], true);
        }
      })

  }
  dbResult: any[] = [];
  getReportsByLink(linkId: any, refreshCriteria: boolean) {
    

    if (linkId) {
      this.dbResult = [];
      this.reportClassNames = [];
      this.viewerIsHidden = true;
      this.reportService
        .getReportAppCodes(linkId)// get link id from url
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(res => {
          if (res.data1 && res.data1.length > 0) {
            this.reportClassNames = res.data1;
            this.reportName = res.data1[0]['name'];

          }
          if (res["data"]) {
            
            this.dbResult = res["data"];
            this.reportCriterias = res["data"];
           // this.reportCriterias.push('Lang')
            this.countReport(this.dbResult);// get all report for link
            this.getReportAppCodes(this.dbResult, this.reportsIds[0]['reportSerial']);// show firt report
            if (refreshCriteria && this.fastSearch) {
              this.fastSearch.reCreate(this.appCodes);
            }
          }


        })
    }


  }
  showReportNamesArea: boolean = false;
  /***************************************************************
   *used to filter report serial  that come from data base *** get all report serial for this link
   * @param result data come from database
   */
  countReport(result) {
    this.reportsIds = [];
    this.showReportNamesArea = false;
    result.forEach(app => {
      if (this.reportsIds.find(x => x.reportSerial == app["reportSerial"])) {
        return false;
      }
      else {
        let repObj = { reportSerial: app['reportSerial'], nameAr: app['nameAr'], nameEn: app['nameEn'], selected: false }
        this.reportsIds.push(repObj);
      }

    })
    if (this.reportsIds && this.reportsIds.length > 0) {
      this.reportsIds[0]['selected'] = true;

    }
    if (this.reportsIds && this.reportsIds.length > 1) {
      this.showReportNamesArea = true;
    }

  }
  /****************************************************
   * used to get appCodes for report from database result by report serial serial
   * @param result data come from database
   * @param reportId report serial wanted to view
   */

  loadReportAppCodes(report) {
    this.reportsIds.forEach(element => {
      element.selected = false
    });
    report['selected'] = true;
    this.getReportAppCodes(this.dbResult, report['reportSerial']);// show firt report
  }
  getReportAppCodes(result: any[], reportId: number) {
    // this.isLoaded = false;// hidden fast seach
    this.isLoaded = false;
    this.appCodes = [];// reset current appCodes
    result.forEach(repdetail => {
      if (repdetail.reportSerial == reportId) {
        this.appCodes.push(repdetail.appCode);



        if (repdetail.multi) {
          this.multiAppCodes.push(repdetail.appCode);
        }

        if (repdetail.fixedSearchKey != null && repdetail.fixedSearchKey != '') {
          this.appCodesSearchKeys[repdetail.appCode] = JSON.parse(repdetail.fixedSearchKey);
        }

        if (repdetail.staticFalg) {
          this.staticFlagAppCodes.push(repdetail.appCode);

        }
      }

    });
    //check  if  branch arr  will  be added 
    this.BranchArrParmCheck();
    this.addEnhanceExcelParm();
    result = this.dbResult.filter(item => item.reportSerial == reportId)
    if (result && result.length > 0) {
      if (this.reportClassName != result[0].reportClassName) {
        this.reportClassName = result[0].reportClassName;
        this.reportControllerName = result[0].reportControllerName;
        this.reportActionName = result[0].reportActionName;
        this.reportNameAr = result[0].nameAr;
        this.reportNameEn = result[0].nameEn;
       
        if (result[0].repType == 2) {
          this.reportCriteria['repType'] = 2;

          this.onSearchClick(this.reportCriteria);
        } else {
          this.repType = 1;
        }
      }
    }
    this._userSessionService.setSessionKey("appCodesReport", this.appCodes)
    this.isLoaded = true;//show fast search
  }
  BranchArrParmCheck() {
    let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (currentUser.branchesArr && currentUser.branchesArr.split('_').length> 2) {
      this.appCodes.push(1298);
      this.multiAppCodes.push(1298);
    }
  }
  addEnhanceExcelParm(){
    this.appCodes.push(541);
   // this.multiAppCodes.push(541);
  }
  getAuthParms() {

    let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    let forDebug = JSON.parse(sessionStorage.getItem('forDebug'));
    let link = JSON.parse(sessionStorage.getItem('LinkObj'));
    let linkId
    if (link) {
      linkId = link.code
    } else {
      linkId = 0
    }

    let Auth = btoa('SecloginId' + '/' + currentUser.secLoginId + ',' + 'BranchId' + '/' + currentUser.branchId + ',' + 'link' + '/' + linkId + ',' + 'ForDebug' + '/' + forDebug + ',' + 'AccountId' + '/' + currentUser.accountId + ',' + 'BranchesArr' + '/' + currentUser.branchesArr)
    return Auth;
  }
  /*********************************************
   * fast seach search event emitter
   * @param event
   */
  onSearchClick(event) {


    this.viewerIsHidden = true;
    // event["SecLoginId"] = 1;
    // event["BranchId"] = 1;
    event["Auth"] = this.getAuthParms();
    event["reportNameAr"] = this.reportNameAr;
    event["reportNameEn"] = this.reportNameEn;
    event["Lang"] = this.translate.currentLang;

    if (event['reportType'] != undefined) {
      if (event['reportType'] == null) {
        event['reportType'] = 1;
      }
      let x = this.reportClassNames.filter(r => r.code == event['reportType']);
      if (x && x.length > 0) {
        this.reportClassName = x[0]['name'];
        this.reportControllerName = x[0]['reportControllerName'];
        this.reportActionName = x[0]['reportActionName'];
        this.reportName = x[0]['name'];
      }
    }
    this.arguments = event;
    this.viewerIsHidden = false;
    this.repType = event["repType"];
    if (this.repType != 2)
      this.repType = 1;
    this.isLoaded = true;//show fast search
  }
}


const Route: Routes = [
  { path: 'user-report', component: UserReports },
  {
    path: '', children: [
      { path: ':linkId', component: DevExpressReportComponent }
    ]
  }
];
@NgModule({
  imports: [
    FastSearchModule,
    CommonModule,
    RouterModule.forChild(Route)
  ],
  declarations: [
    DevExpressViewerComponent,
    DevExpressReportComponent,
    HtmlViewerComponent,
    UserReports
  ],
  providers: [
    ReportService
  ],
  exports: [
    DevExpressViewerComponent,
    DevExpressReportComponent,
    HtmlViewerComponent,
    RouterModule
  ]
})

export class DevExpressReportModule { }


/**
 * {1219: "1,4,6", 1873: "12,23"}
 * {appCode: execludedCode}
 */