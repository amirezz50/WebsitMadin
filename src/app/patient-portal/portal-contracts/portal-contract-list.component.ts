
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UserSessionService, PatientParms } from '../../shared';
import { StepperComponent } from '../../blocks';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { TherapeuticCards, PortalTherapeuticCardsService } from './potral-contract.service';


@Component({
    selector: 'sanabel-portal-therapeuticCards',
    templateUrl: './portal-Contract-list.component.html',
    providers: [PortalTherapeuticCardsService]

})
export class PortalContractListComponent implements OnInit, OnDestroy {
    private ngUnsubscribe: Subject<void> = new Subject<void>();

    therapeuticCard: TherapeuticCards[] = [];
    patientParms: PatientParms = <PatientParms>{};
    myStepNumber: number = 209;
    @Input() stepperComponent: StepperComponent;
    constructor(
        private _therapeuticCardsService: PortalTherapeuticCardsService,
        public translate: TranslateService,
        private _userSessionService: UserSessionService
    ) { }

    gettherapeuticCardsList(PatientCode) {

        if (PatientCode > 0) {
            this._therapeuticCardsService.getTherapeuticCards(PatientCode)
                .subscribe(
                    res => { this.therapeuticCard = res.data; },
                    error => console.log("unable to load therapeuticCards"),
                    () => {
                    });
        } else {
            this.therapeuticCard = [];
        }
    }
    ngOnInit() {

        this._userSessionService.getSessionKey$('patientForEdit')
            .subscribe((keys: any) => {
                if (keys && keys.name == 'patientForEdit' && keys.value["code"]) {
                    this.patientParms.patCode = keys.value["code"];
                }
            });
        this.myStepper$();
        let _patientForEdit = this._userSessionService.getSessionKey('patientForEdit');
        if (_patientForEdit && _patientForEdit["code"]) {
            this.gettherapeuticCardsList(_patientForEdit["code"]);
        }

    } ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
    //-----observable on step on wizard
    myStepper$() {
        if (this.stepperComponent) {
            this.stepperComponent.getCurrentStep().pipe(
                takeUntil(this.ngUnsubscribe))
                .subscribe((step: any) => {
                    if (step && step.serial == this.myStepNumber) {
                        this.gettherapeuticCardsList(this.patientParms.patCode);
                    }

                })
        }
    }

    onRowIconClick(actionCode: number, row: any) {

        if (actionCode == 403) {

            this.delete(row);

        }


    }
    delete(row: any) {

        this._therapeuticCardsService.deleteTherapeuticCards(row)
            .subscribe(c => {
                this.gettherapeuticCardsList(this.patientParms.patCode);
            })


    }

    paginate(event) { }
}
