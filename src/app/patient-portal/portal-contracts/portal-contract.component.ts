//////-------------------------------------------------------------------------------------------------------------------------
//////----------------------------ContractComponent General POPUlate in Patient & AppointMent---------------------------------------------------------------------------------------------
//////-------------------------------------------------------------------------------------------------------------------------
import { Component, OnInit, ViewChild, EventEmitter, Output, Input, NgModule } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SelectizeComponent, ToastService } from '../../blocks';
import { UserSessionService, FormSettingsService, SharedModule, StockModuleSettingsParms } from '../../shared';

//services
import { SharedDateService } from '../../shared';
import { TranslateService } from '@ngx-translate/core';
// import { TherapeuticCards, TherapeuticCardsService } from './contract.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { TherapeuticCards, PortalTherapeuticCardsService } from './potral-contract.service';

@Component({
    selector: 'Portal-Contract-Id',
    templateUrl: 'portal-Contract.Component.html'
})
export class PortalContractComponent implements OnInit {
    discountOwnerNameAr: string;
    discountOwnerNameEn: string;
    priPricingItemsNameAr: string;
    priPricingItemsNameEn: string;
    discountValue: number;
    patShareValue: number;
    useOldContract: number;
    contractClickedBool: boolean = false;
    therapeuticCardsForm: FormGroup;
    therapeuticCard: TherapeuticCards = <TherapeuticCards>{};
    stockSettingsParms: StockModuleSettingsParms = {};
    mediclaModuleSettings: {};
    companyTypeFlag: number;
    @Input() tabindex: number;
    @Input() editable: any;
    @Input() visitType: number;
    @Input() ShowTpaDropDown: boolean;
    @Input() defaultOldContract: number;
    @ViewChild('contractSearch', { static: false }) contractSearch: SelectizeComponent;
    @Input() portalReg: boolean;
    contractTypeId: number
    @Input() set contractType(value: number) {
        if (this.contractSearch) {
            this.contractSearch.clear();
            this.contractSearch.clearItems();
        }
        this.contractTypeId = value
        this.companyTypeFlag = null
    }
    modifyCardPrivilege: number = 0
    @Output() private contractValueInfoEmitted: EventEmitter<any> = new EventEmitter();
    private ngUnsubscribe: Subject<void> = new Subject<void>();
    private unsubscribe = new Subject();
    curruntDate: any;
    //--------------------------------------------------------------#ibrahim-gouhar---------------------------------------------------------------------------
    constructor(
        public translate: TranslateService,
        private fb: FormBuilder,
        private _userSessionService: UserSessionService,
        private _toastService: ToastService,
        private _sharedDateService: SharedDateService,
        private _formSettingsService: FormSettingsService,
        private _contractService: PortalTherapeuticCardsService) { }
    ///---------------------- ..........#gouhar......
    ngOnInit() {

        this.getModuleSettings();
        this.therapeuticCardsForm = this.fb.group(this.initContarctModel());
        if (this.editable == undefined) {
            this.editable = true;
        }
        this.curruntDate = new Date();
        this._userSessionService.subscribeToKey$('SecLoginPrivileges').pipe(
            takeUntil(this.ngUnsubscribe))
            .subscribe((keys: any) => {
                if (keys.value) {
                    if (keys.value[0]['ModifyCardPrivilege'] == 1) {
                        this.modifyCardPrivilege = 1;
                    } else {
                        // this.therapeuticCardsForm.controls['cardNo'].disable();
                        this.therapeuticCardsForm.controls['policyNumber'].disable();
                        this.therapeuticCardsForm.controls['startDate'].disable();
                        this.therapeuticCardsForm.controls['endDate'].disable();
                        this.therapeuticCardsForm.controls['eligibilityNo'].disable();

                    }
                }
            })
    }
    initContarctModel() {
        // initialize  model
        const model = {
            code: -1,
            cardNo: [null, Validators.required],
            patientCode: 0,
            contractId: null,
            tpaCode: null,
            contractNotRest: null,
            policyNumber: null,
            eligibilityNo: null,
            startDate: null,
            patSharingPercentFromCardFlag: null,
            endDate: [null, Validators.required],
            inTransferBodiesSerial: null
        };

        return model;
    }
    //////--------------------------------------------------------------------------
    displayAllInp: Boolean;
    displayAll() {
        this.displayAllInp = !this.displayAllInp;
    }

    //////-------------------------------------------------------------------------------------------------------------------------
    contractClicked(item: any) {
        ;
        //.----------------------
        if (item != undefined) {
            this.companyTypeFlag = item.companyTypeFlag;
            if (!item.AutoEmited) {
                this.therapeuticCard.endDate = null;
                this.therapeuticCard.startDate = null;
                this.therapeuticCard.policyNumber = null;
                this.therapeuticCard.cardNo = null;
                this.therapeuticCard['compNameAr'] = item.nameAr;
                this.therapeuticCard['compNameEn'] = item.nameEn;
                this.therapeuticCard['tpaNphiesID'] = item.tpaNphiesID
                this.therapeuticCard['companyNameAr'] = item.companyNameAr
                this.therapeuticCard['companyNameEn'] = item.companyNameEn
                this.therapeuticCardsForm.get('startDate').setValue(null);
                this.therapeuticCardsForm.get('endDate').setValue(null);
                this.therapeuticCardsForm.get('cardNo').setValue(item.cardNo);
                this.therapeuticCard.cardNo = item.cardNo;
            }

            if (this.companyTypeFlag == 1) {
                this.therapeuticCard.endDate = null;
                this.therapeuticCard.startDate = null;
                this.therapeuticCard.policyNumber = null;
                this.therapeuticCard.cardNo = null;
                this._formSettingsService.setRequired(this.therapeuticCardsForm, null, false, 'cardNo,endDate');//#ibrahim end date required
            }
            else {
                //--------- check for CardNumEnterNecessity Flag  for mandatory Coloums --__Asmaa__------
                if (item.cardNumEnterNecessity == 1) {
                    this._formSettingsService.setRequired(this.therapeuticCardsForm, this.initContarctModel(), true, 'cardNo,endDate');
                }
                this.setFormGroupPlicy(item);
            }
            this.contractClickedBool = true;
            this.priPricingItemsNameAr = item.priPricingItemsNameAr;
            this.priPricingItemsNameEn = item.priPricingItemsNameEn;
            this.discountOwnerNameAr = item.discountOwnerNameAr;
            this.discountOwnerNameEn = item.discountOwnerNameEn;
            this.discountValue = item.discountValue;
            this.patShareValue = item.patShareValue;

            this.therapeuticCard.patSharingPercentFromCardFlag = item.patSharingPercentFromCardFlag;
        }
        else {
            this.contractClickedBool = false;
        }

        //-------------------validation on card expiary and validty
        if (item != undefined && (item.statusFlag == 0 || item.expireFlag == 1)) {
            this.contractSearch.clear();
            this._userSessionService.setSessionKey('contract', {});

            this.therapeuticCard.contractId = null;
            this.updateSessionContarct();
            if (!this.therapeuticCardsForm.value.contractId && this.therapeuticCardsForm.value.contractNotRest)
                this.editable = true
            return false;
        }

        if (item != null) {
            this.contractValueInfoEmitted.emit(item.code);
            this._userSessionService.setSessionKey('contract', item);
            this.therapeuticCard.contractId = item.code;
            this.updateSessionContarct();
        } else {
            this.contractValueInfoEmitted.emit(null);
            this._userSessionService.setSessionKey('contract', null);
        }

    }
    //////-------------------------------------------------------------------------------------------------------------------------
    resetContract() {
        this.therapeuticCardsForm.reset();
    }
    //////-------------------------------------------------------------------------------------------------------------------------
    //////main #gouhar...........////
    getTherapeuticCardsForm(): TherapeuticCards {
        let temp = <TherapeuticCards>(this.therapeuticCardsForm.value);
        temp.startDate = this._sharedDateService.convertFromNgBsToDate(this.therapeuticCardsForm.get('startDate').value);
        temp.endDate = this._sharedDateService.convertFromNgBsToDate(this.therapeuticCardsForm.get('endDate').value);
        temp['compNameAr'] = this.therapeuticCard['compNameAr']
        temp['compNameEn'] = this.therapeuticCard['compNameEn']
        temp['tpaNphiesID'] = this.therapeuticCard['tpaNphiesID']
        temp['companyNameEn'] = this.therapeuticCard['companyNameEn']
        temp['companyNameAr'] = this.therapeuticCard['companyNameAr']
        return temp;
    }
    ///PopUlate Cotract #Gouhar
    //////-------------------------------------------------------------------------------------------------------------------------
    //////-------------------------------------------------------------------------------------------------------------------------
    setFormGroupContract(temp: any) {
        if (temp.contractId) {
            this.therapeuticCardsForm.patchValue({
                contractId: temp.contractId
            }, { emitEvent: false })
        }
    }
    //////-------------------------------------------------------------------------------------------------------------------------
    setFormGroupPlicy(temp: any) {
        if (temp.policyNumber) {

            this.therapeuticCardsForm.patchValue({
                policyNumber: temp.policyNumber

            }

                , { emitEvent: false })

            this.therapeuticCard.policyNumber = temp.policyNumber;

        }
        else {
            this.therapeuticCardsForm.patchValue({
                policyNumber: null

            })
            this.therapeuticCard.policyNumber = null;

        }

        if (temp.startDate) {
            this.therapeuticCardsForm.get('startDate').setValue(this._sharedDateService.convertFromDateToNgBsObject(temp.startDate));
            this.therapeuticCard.startDate = temp.startDate;
        }
        else {
            this.therapeuticCardsForm.patchValue({
                startDate: null
            })
            this.therapeuticCard.startDate = null;


        }

        if (temp.endDate) {
            this.therapeuticCardsForm.get('endDate').setValue(this._sharedDateService.convertFromDateToNgBsObject(temp.endDate));
            this.therapeuticCard.endDate = temp.endDate;

        }
        else {
            this.therapeuticCardsForm.patchValue({
                endDate: null

            })
            this.therapeuticCard.endDate = null;

        }

    }
    //////-------------------------------------------------------------------------------------------------------------------------

    ///PopUlate Cotract #Gouhar
    setFormGroup(temp: any) {
        this.therapeuticCardsForm.patchValue({
            code: temp.code,
            patientCode: temp.patientCode,
            cardNo: temp.cardNo,
            contractId: temp.contractId,
            contractNotRest: temp.contractNotRest,
            startDate: this._sharedDateService.convertFromDateToNgBsObject(temp.startDate),
            endDate: this._sharedDateService.convertFromDateToNgBsObject(temp.endDate),
            policyNumber: temp.policyNumber,
            patSharingPercentFromCardFlag: temp.patSharingPercentFromCardFlag
        }, { emitEvent: false })

        this.therapeuticCard = temp;
        if (temp.CompanyType) {
            this.companyTypeFlag = temp.CompanyType;
        }
        this.updateSessionContarct();
    }
    //////-------------------------------------------------------------------------------------------------------------------------

    updateFormControl(therapeuticCard: FormControl, value: string) {
        this.therapeuticCardsForm.patchValue({ name: value }, { emitEvent: false })
    }
    //////-------------------------------------------------------------------------------------------------------------------------

    getTherapeuticCardsFormGroup() {
        return this.therapeuticCardsForm;
    }
    //////-------------------------------------------------------------------------------------------------------------------------
    //used by passing an model object to get therapeuticCard properties from it  and return  new object of  TherapeuticCards
    gettherapeuticCardObjFromModel(MVObj: any) {
        let therapeuticCard = <TherapeuticCards>{};
        if (MVObj) {
            therapeuticCard.code = MVObj.code;
            therapeuticCard.cardNo = MVObj.cardNo;
            therapeuticCard.contractId = MVObj.contractId;
            therapeuticCard.endDate = this._sharedDateService.convertFromDateToNgBsObject(MVObj.endDate);
            therapeuticCard.policyNumber = MVObj.policyNumber;
            therapeuticCard.patSharingPercentFromCardFlag = MVObj.patSharingPercentFromCardFlag;
            therapeuticCard.startDate = this._sharedDateService.convertFromDateToNgBsObject(MVObj.startDate);
        }
        return therapeuticCard;

    }

    //////-------------------------------------------------------------------------------------------------------------------------
    setContract() {
        this.therapeuticCard = this.getTherapeuticCardsForm();
        if (this.therapeuticCard.endDate == null && this.companyTypeFlag == 2) {
            this._toastService.activateMsg('UI34');
            return false;
        }
        this.updateSessionContarct();
    }
    updateSessionContarct() {
        this._userSessionService.setSessionKey('contractObjectForm', this.therapeuticCard);
    }


    getNewInstance(patCode: number, contractId: number): TherapeuticCards {
        let ss = <TherapeuticCards>{
            code: -1,
            cardNo: null,
            patientCode: patCode,
            contractId: contractId,
            policyNumber: null,
            startDate: null,
            endDate: null,
        }
        // this.therapeuticCard = ss;
        //this.updateSessionContarct();
        this.setFormGroup(ss);
        if (!ss.contractId)
            this.editable = true;

        return ss;
    }

    onValuesChange() {
        this.therapeuticCard = this.getTherapeuticCardsForm();
        //if( this.therapeuticCard.endDate > this.curruntDate)
        this.updateSessionContarct();
    }
    //////-------------------------------------------------------------------------------------------------------------------------
    validate(): boolean {

        if (!this.therapeuticCardsForm.valid) {
            this._toastService.activateMsg('UI35');
            return false;
        }
        return true;
    }


    moduleId: number;
    getModuleSettings() {
        this._userSessionService.subscribeToKey$('link')
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(link => {
                if (link.name = 'link') {
                    this.stockSettingsParms.moduleId = 39
                    this._userSessionService.subscribeToKey$('modulesSettings')
                        .pipe(takeUntil(this.ngUnsubscribe))
                        .subscribe((keys: any) => {
                            if (keys.value) {
                                this.mediclaModuleSettings = keys.value[`m_${this.stockSettingsParms.moduleId}`];
                                this.useOldContract = this.mediclaModuleSettings['UseOldContract'];


                                console.log('v', this.useOldContract)
                            }
                        });
                    if (!this.mediclaModuleSettings || !this.useOldContract) {
                        this._contractService.getStockModuleSettings(this.stockSettingsParms)
                            .pipe(takeUntil(this.ngUnsubscribe))
                            .subscribe(c => {
                                if (c.data && c.data.length > 0) {
                                    this.mediclaModuleSettings = c.data[0];
                                    if (this.mediclaModuleSettings) {
                                        this.useOldContract = this.mediclaModuleSettings['useOldContract'];

                                        console.log('x', this.useOldContract)
                                    }
                                }
                            });
                    }
                }
            });
    }
}

