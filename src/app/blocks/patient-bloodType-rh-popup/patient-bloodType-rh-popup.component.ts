import { Component, OnInit, OnDestroy, ViewChild, NgModule } from '@angular/core';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

import { takeUntil } from 'rxjs/operators' ;  import { Subject } from 'rxjs';
import { UserSessionService } from '../../app-user-session.service';
import { ModalService } from '../modal/modal.service';
import { CommonModule } from '@angular/common';
import { PatientBloodTypeService, PatientBloodTypeData } from './patient-bloodType-rh-popup.service';
import { FormsModule } from '@angular/forms';
import { SelectizeModule } from '../selectize/selectize.component';
import { ControlsModule } from '../controls/controls.module';
import { Location } from '@angular/common'; 

@Component({
    selector: 'patient-bloodType-rh-popup',
    templateUrl: './patient-bloodType-rh-popup.component.html',
})

export class PatientBloodTypeRhPopUpComponent implements OnInit, OnDestroy {
    private ngUnsubscribe: Subject<void> = new Subject<void>();
    patient :any;
    patientBloodTypeData:PatientBloodTypeData = <PatientBloodTypeData>{}
    patientCode: number; 
    constructor(
        public translate: TranslateService,
        private _userSessionService: UserSessionService,
        private _modalService: ModalService,
        private _PatientBloodTypeService :PatientBloodTypeService,
        private _location: Location
    ) { }

    ngOnInit() {
        this._userSessionService.subscribeToKey$('PatientBloodTypeRh')
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((keys: any) => {
          if (keys.value) {
            let patObj = keys.value;
            this.patientCode = patObj.code;
            this.getPatDetail(patObj);
          }
        });
    }

    getPatDetail(patObj) {
            this._PatientBloodTypeService.getPatBlodTypeRHData(patObj.code)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(
              requests => {
                if(requests && requests.data.length > 0)
               { 
                   this.patientBloodTypeData = requests.data[0]
                   console.log(this.patientBloodTypeData)
                }},
            error => console.log(error),
            () => {});
    
      }

      onClicked(e: number): void {
        switch (e) {
            case 1: //save code
                this.save();
                break;
            default:
                this.cancel();
        }
    }

    cancel(showToast = true) {
      this._goBack();
  }

  _goBack(): void {
    this._location.back();
}

save() {
      this.patientBloodTypeData.code = this.patientCode
      this._PatientBloodTypeService.updatePatBloodType(this.patientBloodTypeData)
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe(c => {
              //if (c && c.returnFlag == true)
                //  this._goBack();
          });
  
}


    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

 
}

@NgModule({
    imports: [
      CommonModule,
       SelectizeModule,
      ControlsModule,
      FormsModule
      //SharedModule,BlocksModule
    ],
    declarations: [
        PatientBloodTypeRhPopUpComponent
    ],
    providers: [
      PatientBloodTypeService
    ],
    exports: [
        PatientBloodTypeRhPopUpComponent
    ]
  })
  export class PatientBloodTypeRhPopUpModule { }



