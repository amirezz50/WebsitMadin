
import {takeUntil} from 'rxjs/operators';
/**
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * each one edit in general component please you can give us Brief description about
 *  why you do what you did with my best Wishes
 * please give us little from you time and  add commment for each line you added to component
 */
import { Component, EventEmitter, Input, Output, OnInit, HostListener, OnDestroy } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ActionIconService } from '../ui-component/action-icon/action-icon.service';
//services
import { StepperService, AppCodes } from './stepper.service';
import { ControlsParams } from '../../shared/controls-params';
import { UserSessionService } from '../../app-user-session.service';

@Component({
    selector: 'stepper-ctrl',
    templateUrl: 'stepper.component.html',
    styleUrls: ['stepper.component.css'],
    providers: [StepperService]
})
export class StepperComponent implements OnInit, OnDestroy {
    private ngUnsubscribe: Subject<void> = new Subject<void>();

    @Output() clicked: EventEmitter<AppCodes>;
    @Output() getStepsAppCode = new EventEmitter<AppCodes[]>();
    @Input() paramsObject: ControlsParams;
    @Input() tabindex: number;
    @Input() parentUIKey: string;
    @Input() stepActiveCheck: Function;
    @Input() excludeFromworkflow = [];
    @Input() hideFromworkflow = [];
    @Input() appCodes: AppCodes[] = [];
    AppCodes: AppCodes[] = [];
    VisibleAppCodes: AppCodes[] = [];
lastStep;
    activeIndex: number = 0;
    activeStepNum: number;
    //loadComplete = new BehaviorSubject<boolean>(false);
    iWillLeave: Subject<any> = new Subject<any>();
    doLeave: Subject<any> = new Subject<any>();
    viewTemplate = 1;
    loaded: boolean = false;
    hibernate: boolean = false;
    afterLoadActions: any = {};
    constructor(
        private _stepperService: StepperService,
        private _AIS: ActionIconService,
        public translate: TranslateService,
        private _USS: UserSessionService
    ) {
        this.clicked = new EventEmitter<AppCodes>();

    }
    /**call i create stepper steps from link id not from appcodes */
    _getControls(par: ControlsParams) {
        this.AppCodes = [];
        this._stepperService
            .getControls(par.linkId, par.appCodeGroup, par.required, par.appComponentName, par.category)
            .subscribe(apps => {
                this.AppCodes = [];
                if (apps && apps.data && apps.data.length > 0) {
                    this.handeldbData(apps.data);
                }
            }, null,
                () => {
                    this.afterLoadComplete();
                });


    }
    /**call i create stepper steps from appcodes not from link id   */
    _getControls2() { 
        const  _data = this._AIS.getCachedAppCodes('stepper',this.appCodes);
        if(_data.length > 0) {
            this.handeldbData(_data);
            this.afterLoadComplete();
            return  ;
        }
        this._AIS
            .getControls(this.appCodes.toString())
            .subscribe(apps => {
                this.AppCodes = [];
                if (apps && apps.data && apps.data.length > 0) {
                    this._AIS.cachAppCodes('stepper', this.appCodes, apps['data']);
                    this.handeldbData(apps.data);
                    this.afterLoadComplete();
                }
            }, null,
                () => {
                    this.afterLoadComplete();
                });
    }

    _getComponentControls(par: ControlsParams) {
        if (par && par.appComponentName) {
            this._stepperService.getComponentControls(par.appComponentName, par.appCodeGroup, par.category)
                .pipe(takeUntil(this.ngUnsubscribe))
                .subscribe(apps => {
                    this.AppCodes = []
                    if (apps && apps.data && apps.data.length > 0) {
                        apps.data = this._stepperService.filterByCategory(apps.data, par.category, par.linkId)
                        this.handeldbData(apps.data);
                        this.afterLoadComplete();
                    }
                });
        }
    }
    //-----------after service return  data
    handeldbData(steps: any[]) {
        steps.forEach(item => {
            item.isDone = false;
            item.isValid = true;
            item.isFirstTime = true;
            if (item.visible)
                this.VisibleAppCodes.push(item);
            this.AppCodes.push(item);
            if (this.excludeFromworkflow) {
                if (this.excludeFromworkflow.find(elem => elem.appCode == item.appCode)) {
                    this.AppCodes.pop();
                }
            }
            if (this.hideFromworkflow) {
                const it = this.hideFromworkflow.find(elem => elem.appCode == item.appCode)
                if (it) {
                    item.visible = false;
                    this.VisibleAppCodes.pop();
                }
            }
        });

        // }
        if(this.AppCodes)
        this.AppCodes[0].isFirstTime = false;

        this.currentStep = this.AppCodes[0];
        this.setUIState(this.currentStep);
        this.getStepsAppCode.emit(this.VisibleAppCodes);
    }
    ngOnInit() {
        if (this.paramsObject) {
            if (this.paramsObject.appComponentName) {
                this._getComponentControls(this.paramsObject);

            } else {
                      this._getControls(this.paramsObject);
          
            }
        } else if (this.appCodes.length > 0) {
            this._getControls2();
        }

        this.doLeave.pipe(
            takeUntil(this.ngUnsubscribe))
            .subscribe(e => {
                this.execNavigate(e);
            });

    }
    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();

    }
    hideStep(_serial: number) {
        if (this.loaded) {
            for (let i = 0; i < this.AppCodes.length; i++) {
                if (this.AppCodes[i].serial == _serial) {
                    this.AppCodes[i].visible = 0;
                }
            }
        } else {
            this.afterLoadActions['hideStep'] = _serial;
        }
    }
    /**call after steps loaded from db */
    afterLoadComplete() {
        this.loaded = true;
        if (this.afterLoadActions['hideStep'])
            for (let i = 0; i < this.AppCodes.length; i++) {
                if (this.AppCodes[i].serial == this.afterLoadActions['hideStep']) {
                    this.AppCodes[i].visible = 0;
                }
            }

        if (this.afterLoadActions['gotoStepOfAppcode'])
            this.gotoStepOfAppcode(this.afterLoadActions['gotoStepOfAppcode']);

    }

    showStep(_serial: number) {
        for (let i = 0; i < this.AppCodes.length; i++) {
            if (this.AppCodes[i].serial == _serial) {
                this.AppCodes[i].visible = 1;
            }
        }
    }
    steppClicked(e: number, ctrl: AppCodes, _last: boolean = false) {
        if (e != undefined && ctrl) {
            const parm = { 'e': e, 'ctrl': ctrl, '_last': _last, 'current': this.currentStep };
            if (!ctrl.visible) {
                return 0;
            }

            if (this.stepActiveCheck) {
                const checkResult = this.stepActiveCheck.call(this, ctrl, this.currentStep);
                if (checkResult == -1) {
                    return false;
                }
                else if (checkResult == 0) {
                    this.iWillLeave.next(parm);
                } else {
                    this.execNavigate(parm);
                }
            } else {
                this.execNavigate(parm);
            }

        }


    }
    execNavigate(parms: any) {

        this.activeIndex = this.VisibleAppCodes.findIndex(e => parms.ctrl['appCode'] == e['appCode']);
        this._USS.setBtnCtrl(null);
        if (parms.ctrl) {
            this.activeStepNum = parms.ctrl.serial;
            if (this.lastStep && this.lastStep.ctrl.appCode != parms.ctrl.appCode) { // contain prev step
                this.lastStep.ctrl.isDone = true;
            }
            this.lastStep = parms;
            parms.ctrl.isFirstTime = false;
            if (parms.ctrl.isValid) {
                this.clicked.emit(parms.ctrl);
            }
        } else if (parms._last) {
            const lastCtrl = <AppCodes>{};
            lastCtrl.isLastStep = true;
            this.clicked.emit(lastCtrl);
        }

        this.setCurrentStep(parms.ctrl);
    };
    setUIState(e: any) {
        this._USS.setUIState(e, this.parentUIKey);
    }

    private getNextStep() {
        let next = this.VisibleAppCodes[this.activeIndex + 1];
        if (this.activeIndex + 1 >= this.VisibleAppCodes.length) { }
        else {
            return next;
        }
    }
    private getPreviousStep() {
        let prev = this.VisibleAppCodes[this.activeIndex - 1];
        if (prev) { return prev;}
        else {
            
        }
    }
    /**got to next active step */
    gotoNextStep() {
        this.gotoStep(this.getNextStep());
    }
    /**go to prev active step */
    gotoPreviousStep() {
        this.gotoStep(this.getPreviousStep());
    }
    /** goto setp by appcode */
    gotoStep(e: AppCodes) {
        this.steppClicked(0, e);
    }
    /**goto setp by appcode */
    gotoStepOfAppcode(e: number) {
        if (this.loaded) {
            let indx = this.VisibleAppCodes.findIndex(c => c['appCode'] == e);
            //if (indx > 0 && this.AppCodes[indx])
            if (indx >= 0 && this.VisibleAppCodes[indx])
                this.steppClicked(0, this.VisibleAppCodes[indx]);
        } else {
            this.afterLoadActions['gotoStepOfAppcode'] = e;
        }
    }

    hideall() {
        this.AppCodes.forEach(app => app.visible = 0);
    }
    updateStep(e) {
        // not completed
        let temp = this.VisibleAppCodes.find(app => app.appCode == e.appCode);
        if (temp) {
            temp.visible = 1;
        }
    }

    updateStepper(newworkflow: AppCodes[]) {
        this.hideall();
        newworkflow.map(step => {
            this.updateStep(step)
        });
    }

    /*-----------------------------------------------------------------------------------------------*/
    currentStepSubject$ = new Subject();
    currentStep = <AppCodes>{};

    setCurrentStep(e: AppCodes) {
        this.setUIState(e);
        this.currentStep = e;
        this.currentStepSubject$.next(e);

    }

    getCurrentStep() {
        return this.currentStepSubject$
    }

    checkLastStep() {
        if (this.activeIndex == this.AppCodes.length) {
            this.steppClicked(0, null, true);
        }

    }


    /*-----------------------------------------------------------------------------------------------*/
    @HostListener('window:keyup', ['$event'])
    hotkeys(event) {
        if (event.keyCode == 37 && event.ctrlKey) {
            this.gotoNextStep();
        }
        else if (event.keyCode == 39 && event.ctrlKey) {
            this.gotoPreviousStep();
        }
        event.preventDefault();
    }
    /*-----------------------------------------------------------------------------------------------*/

}
