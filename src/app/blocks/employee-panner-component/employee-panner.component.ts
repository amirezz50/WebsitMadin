import { Component,OnDestroy, OnInit, NgModule, Output, EventEmitter } from '@angular/core';
import {UserSessionService, SharedModule } from '../../shared';


import { takeUntil } from 'rxjs/operators' ;  import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { EmployeePannerService, EmpPanner } from './employee-panner.service';
import { BlocksModule } from '../blocks.module';

@Component({
  selector: 'sanabel-employee-panner',
  templateUrl: './employee-panner.component.html'
})
export class EmployeePannerComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  showPanner: boolean = false;
  empId: number;
  _empPannerData: EmpPanner = <EmpPanner>{};
  @Output() EmployeeDefaultPayRoll : EventEmitter<number> = new EventEmitter<number>();


  constructor(
    public translate: TranslateService,
    private _employeeService: EmployeePannerService,
    private _userSessionService: UserSessionService) { }

  ////////////////////////////////////////////////////////#Gouhar///////////////////////////////////////////

  ngOnInit() {
    this._userSessionService.subscribeToKey$('EmployeesPanner')  // employee
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((keys: any) => {
        if (keys.value)
          this.getPannerData(keys.value)
      });

    this._userSessionService.subscribeToKey$('resetEmpPannner')
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((keys: any) => {
        this.showPanner = keys.value
      });

    this._userSessionService.subscribeToKey$('EMPPPANNERCODE')  //loan REquest
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((keys: any) => {
        if (keys.value)
          this.getPannerData(keys.value)
      });

    this._userSessionService.subscribeToKey$('EmpPannerVacation')  //vacation Request
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((keys: any) => {
        if (keys.value)
          this.getPannerData(keys.value)
      });

  }


  

  getPannerData(empCode: number) {
    if (empCode)
      this._employeeService.getEmployeePannerData(empCode).pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(
          empPannerData => {
            if (empPannerData && empPannerData.data && empPannerData.data.length > 0) {
              this.showPanner = true;
              this._empPannerData= <EmpPanner>{};
              this._empPannerData = empPannerData.data[0]
              this.EmployeeDefaultPayRoll.emit(empPannerData.data[0])
            }
          },
          error => console.log(error),
          () => {
            null
          }
        )
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////////


}
@NgModule({
  imports: [SharedModule,BlocksModule],
  declarations: [EmployeePannerComponent],
  providers: [EmployeePannerService],
  exports: [EmployeePannerComponent]
})
export class EmployeesPannerMod { }





