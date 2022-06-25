import { ActivatedRoute, Router } from '@angular/router';
import { Component, Input, OnDestroy, OnInit, ViewChild, NgModule } from '@angular/core';
import { EntityService, ModalService, StepperComponent, ToastService } from '../../blocks';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HrParms, SharedDateService, UserSessionService, SharedModule } from '../../shared';


import { Location } from '@angular/common';
import { takeUntil } from 'rxjs/operators' ;  import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ApplicantPannerService, ApplicantPanner } from './applicant-panner.service';

@Component({
  selector: 'sanabel-applicant-panner',
  templateUrl: './applicant-panner.component.html'
})
export class ApplicantPannerComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  showPanner: boolean = false;
  empId: number;
  _empPannerData: ApplicantPanner = <ApplicantPanner>{};

  constructor(
    public translate: TranslateService,
    private _employeeService: ApplicantPannerService,
    private _userSessionService: UserSessionService) { }

  ////////////////////////////////////////////////////////#Gouhar///////////////////////////////////////////

  ngOnInit() {
    this._userSessionService.subscribeToKey$('ApplicantPanner')
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((keys: any) => {
        if (keys.value)
          this.getPannerData(keys.value)
      });
  }


  getPannerData(empCode: number) {
    if (empCode)
      this._employeeService.getApplicantPannerData(empCode).pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(
          empPannerData => {
            if (empPannerData && empPannerData.data && empPannerData.data.length > 0) {
              this.showPanner = true;
              this._empPannerData = empPannerData.data[0]
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
  imports: [SharedModule],
  declarations: [ApplicantPannerComponent],
  providers: [ApplicantPannerService],
  exports: [ApplicantPannerComponent]
})
export class ApplicantPannerMod { }

