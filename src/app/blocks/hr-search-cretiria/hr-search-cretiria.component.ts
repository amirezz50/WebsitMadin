
import { Component, OnDestroy, OnInit, NgModule, Output, EventEmitter, Input } from '@angular/core';
import { UserSessionService, getDateObj, HrParms, getNgBsObj, SharedDateService } from '../../shared';

import { takeUntil } from 'rxjs/operators'; import { Subject } from 'rxjs';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { HrSearchCretiriaService } from './hr-search-cretiria.service';
import { NgbDatepickerModule } from '../../ng-bootstrap';
import { SelectizeModule } from '..';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ObjListFilterPipeModule } from '../pipes/obj-list-filter.pipe';
import { moduleSettingHashMap } from '../../shared/utility';


@Component({
  selector: 'sanabel-hr-search-cretiria',
  templateUrl: './hr-search-cretiria.component.html'
})
export class HrSearchCretiriaComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  ContractType: number;
  hrSearchCretiria = <HrParms>{}
  @Output() EmployeeData: EventEmitter<HrParms> = new EventEmitter<HrParms>();
  @Input() hideIconSearch: boolean = false;
  @Input() hideDate: boolean = false;
  @Input() verticalMode: boolean = false;
  @Output() private searchKeys: EventEmitter<any> = new EventEmitter();
  @Input() DateValueType: number;
  @Input() hidePayRoll: boolean = false;
  @Input() hideRevised: boolean = false;
  @Input() showYear: boolean = false;
  @Input() showMonth: boolean = false;
  @Input() firngerPrintReview: boolean = false;
  @Input() appCodes :[] = []
  
  @Input() EmployeeDataValWithoutSearchClick: boolean = false;
  _ngbFromDate: Date;
  _ngbToDate: Date;
  settingHM :any = {} ;

  constructor(
    public _HrSearchCretiriaService: HrSearchCretiriaService,
    public translate: TranslateService,
    private _SharedDateService: SharedDateService) { }





  ngOnInit() {

    if( this.appCodes.length > 0){
      this.appCodes.forEach(x=>{
        this.settingHM[x] =  true ;
      });
      console.log(this.settingHM)
    }

    if (this.DateValueType) {
     
      this.getDateValue()
    }

  }

  getDateValue() {
    this._HrSearchCretiriaService.getDate(this.DateValueType)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(data => {
        this.hrSearchCretiria.fromDate = data.data[0].monthStart
        this.hrSearchCretiria.toDate = data.data[0].monthEnd

        this._ngbFromDate = this._SharedDateService.convertFromDateToNgBsObject(data.data[0].monthStart)
        this._ngbToDate = this._SharedDateService.convertFromDateToNgBsObject(data.data[0].monthEnd)
        if (this.EmployeeDataValWithoutSearchClick == true) { this.EmployeeData.emit(this.hrSearchCretiria) }
        console.log(this.hrSearchCretiria)
      },
        error => console.log(error),
        () => { null });
  }

  onSearchClick() {
    if (this._ngbFromDate) {
      
     this.hrSearchCretiria.fromDate = getDateObj(this._ngbFromDate);
    }
    else {
      this.hrSearchCretiria.ngbFromDate = null;
    }
     if (this._ngbToDate) {
     this.hrSearchCretiria.toDate = getDateObj(this._ngbToDate);
    }
    else {
      this.hrSearchCretiria.ngbToDate = null;
    }
    
    this.searchKeys.emit(this.hrSearchCretiria)
  }

  getYear(ev) {
    this.hrSearchCretiria.year = ev
    if (this.EmployeeDataValWithoutSearchClick == true) { this.EmployeeData.emit(this.hrSearchCretiria) }
  }

  getMonth(ev) {
    this.hrSearchCretiria.month = ev
    if (this.EmployeeDataValWithoutSearchClick == true) { this.EmployeeData.emit(this.hrSearchCretiria) }
  }

  getDateFrom(ev) {
    if (ev && ev.day && ev.month && ev.year)     // check for data Value 
    {
      let fromDate = getDateObj(ev)
      console.log(fromDate)
      this._ngbFromDate = ev
      this.hrSearchCretiria.fromDate = fromDate
      if (this.EmployeeDataValWithoutSearchClick == true) { this.EmployeeData.emit(this.hrSearchCretiria) }
    }
    else {
      this.hrSearchCretiria.fromDate = null
    }
  }

  getDateTo(ev) {
    if (ev && ev.day && ev.month && ev.year) {     // check for data Value 
      let toDate = getDateObj(ev)
      console.log(toDate)
      this._ngbToDate = ev
      this.hrSearchCretiria.toDate = toDate
      if (this.EmployeeDataValWithoutSearchClick == true) { this.EmployeeData.emit(this.hrSearchCretiria) }
    }
    else {
      this.hrSearchCretiria.toDate = null
    }
  }

  getEmpCode(ev) {
    if (ev) {
      this.hrSearchCretiria.empCode = ev.code
      if (this.EmployeeDataValWithoutSearchClick == true) { this.EmployeeData.emit(this.hrSearchCretiria) }
    }
  }


  getEmpJob(ev) {
    if (ev) {
      this.hrSearchCretiria.JobId = ev.code
      if (this.EmployeeDataValWithoutSearchClick == true) { this.EmployeeData.emit(this.hrSearchCretiria) }
    }
  }

  getEmpSection(ev) {
    if (ev) {
      this.hrSearchCretiria.section = ev.code
      if (this.EmployeeDataValWithoutSearchClick == true) { this.EmployeeData.emit(this.hrSearchCretiria) }
    }
  }

  getEmpDep(ev) {
    if (ev) {
      this.hrSearchCretiria.department = ev.code
      if (this.EmployeeDataValWithoutSearchClick == true) { this.EmployeeData.emit(this.hrSearchCretiria) }
    }
  }

  getEmpContract(ev) {
    if (ev) {
      this.hrSearchCretiria.contractType = ev.code
      if (this.EmployeeDataValWithoutSearchClick == true) { this.EmployeeData.emit(this.hrSearchCretiria) }
    }
  }

  getConfirmedFingerPrint(ev) {
    if (ev) {
      this.hrSearchCretiria.confirmedFingerPrint = ev.code
      if (this.EmployeeDataValWithoutSearchClick == true) { this.EmployeeData.emit(this.hrSearchCretiria) }
    }
  }


  getPayrollType(ev) {
    if (ev) {
      this.hrSearchCretiria.payrollType = ev.code
      if (this.EmployeeDataValWithoutSearchClick == true) { this.EmployeeData.emit(this.hrSearchCretiria) }
    }
  }

  getViolation(ev) {
    if (ev) {
      this.hrSearchCretiria.violation = ev.code
      if (this.EmployeeDataValWithoutSearchClick == true) { this.EmployeeData.emit(this.hrSearchCretiria) }
    }
  }

  getRevised(ev) {
    if (ev) {
      this.hrSearchCretiria.revised = ev.code
      if (this.EmployeeDataValWithoutSearchClick == true) { this.EmployeeData.emit(this.hrSearchCretiria) }
    }
  }

  getInCompleteFingerPrint(ev) {
    if (ev) {
      this.hrSearchCretiria.inCompleteFingerPrint = ev.code
      if (this.EmployeeDataValWithoutSearchClick == true) { this.EmployeeData.emit(this.hrSearchCretiria) }
    }
  }

  getEmpAttendType(ev) {
    if (ev) {
      this.hrSearchCretiria.attendMethod = ev.code
      if (this.EmployeeDataValWithoutSearchClick == true) { this.EmployeeData.emit(this.hrSearchCretiria) }
    }
  }
 
  getHrServiceAwardReasons(ev) {
    if (ev) {
      this.hrSearchCretiria.hrServiceAwardReasons = ev.code
      if (this.EmployeeDataValWithoutSearchClick == true) { this.EmployeeData.emit(this.hrSearchCretiria) }
    }
  }

  

  getempSalIncrease(ev){
    if (ev) {
      this.hrSearchCretiria.empSalIncrease = ev.code
      if (this.EmployeeDataValWithoutSearchClick == true) { this.EmployeeData.emit(this.hrSearchCretiria) }
    }
  }


  getEmpAttendMethod(e){
    
  }
  

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////////


}


@NgModule({
  imports: [
    SelectizeModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ObjListFilterPipeModule,
    NgbDatepickerModule,
    TranslateModule.forChild()

  ],
  declarations: [HrSearchCretiriaComponent],
  providers: [HrSearchCretiriaService],
  exports: [HrSearchCretiriaComponent]
})
export class HrSearchCretiriaMod { }

