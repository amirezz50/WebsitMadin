

import { takeUntil } from 'rxjs/operators';
import { CONFIG } from './../../../shared/config';
import {
    Component, OnInit, OnDestroy,
    EventEmitter, Input, Output,
    forwardRef,
    ElementRef, ViewChild, QueryList, ViewChildren, Renderer
} from '@angular/core';
import {
    NG_VALUE_ACCESSOR, ControlValueAccessor,
    FormBuilder, FormGroup, FormControl, Validators
} from '@angular/forms';
import { SelectizeComponent } from '../../selectize/selectize.component';

import { SharedDateService, getNgBsObj, getDateObj } from '../../../shared/date.service'
import { HttpGeneralService } from '../../../shared/http-general.service';
import { AppCodeVariableKeys } from '../../../shared/utility';
import { UserSessionService } from '../../../app-user-session.service';
import { Subject } from 'rxjs';
import { StorageService, fastSearchInterface } from '../../storage.service';
import { ModalContainerComponent } from '../modal-container/modal-container.component';
import { LabSearchComponent } from '../../lab-search/lab-search.component';
import { ToastService } from '../../blocks';

//  used to export ng module in your custom control **************************************
const noop = () => {
};
export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => FastSearchComponent),
    multi: true
};

// used to define object search type 
type searchType = 'PatientParms' | 'CashierParms' | 'PricingParms' | 'OutpatientParms' | 'EmployeeParms' | 'SecurityParms' | 'SheetParms' | 'StockParms';
let searchAppCodeUrl = CONFIG.baseUrls.fastSearch

@Component({
    selector: 'app-fast-search',
    templateUrl: './fast-search.component.html',
    styleUrls: ['./fast-search.component.css']
})
export class FastSearchComponent implements OnInit, ControlValueAccessor, OnDestroy {
    private ngUnsubscribe: Subject<void> = new Subject<void>();
    /// 
    @Input() placeholderText: string;
    @Input() appCodes = [];
    @Input() multiAppCodes = [];
    @Input() staticFlagAppCodes = [];
    @Input() showFilterIcon: boolean = true;
    @Input() reportCriterias: any[] = [];
    reportInfo: string = "";
    @Input() searchType: searchType;
    @Input() guid: string = '';
    @Input() appearFastSearch: boolean;
    @Input() emitSearchAfterInt: boolean;
    @Input() searchKeysByCode: number;
    @Input() appCodesSearchKeys: number = <any>{};
    // appCodesSearchKeys = {'1038': { 'Level':2 , 'test': 5}}
    @Input() preventDefault: boolean;
    @Input() fixedSearchType: any = <any>{}
    @Input() preventEmptySearch: boolean = false;
    @Input() triggerSearchAppCodes = [];
    searchForm: FormGroup;
    appCodesKeys = [];
    test: boolean = true;
    isReport: boolean = false;
    today: any;
    oldAvk: AppCodeVariableKeys[];
    // -------------------------------------------------------------------- //
    toggleFilter: boolean = true;
    initComplete: boolean = false;

    fastSearchAvalability: boolean;

    @Output() private toggle: EventEmitter<null> = new EventEmitter();
    @Output() private searchKeys: EventEmitter<any> = new EventEmitter();
    @ViewChildren(SelectizeComponent) selectizeArray: QueryList<SelectizeComponent>;
    @ViewChild("inputFastSearch", { read: ElementRef, static: true }) inputFastSearch: any;
    @ViewChild("inputCustom", { read: ElementRef, static: true }) inputCustom: any;


    constructor(private renderer: Renderer,
        private fb: FormBuilder,
        private httpGeneralService: HttpGeneralService,
        private _USS: UserSessionService,
        private _SS: StorageService,
        private _sharedDateService: SharedDateService,
        private _toast: ToastService,
    ) {

    }

    /** ------------------------------------------------------------------------------------ */
    private innerValue: any = '';
    private onTouchedCallback: () => void = noop;
    private onChangeCallback: (_: any) => void = noop;

    // From ControlValueAccessor interface
    writeValue(value: any) {
        if (value !== this.innerValue) {
            this.innerValue = value;
        }
    }
    // set accessor including call the onchange callback
    set value(v: any) {
        if (v !== this.innerValue) {
            this.innerValue = v;
            this.onChangeCallback(v);
        }
    }
    registerOnChange(fn: any) {
    }
    registerOnTouched(fn: any) {
        this.onTouchedCallback = fn;
    }
    //--- used to set  variable  SearchKeys  to    selectize
    appCodeVarKeys$() {
        this._USS.getSessionKey$('appCodeVarKeys' + this.guid).pipe(
            takeUntil(this.ngUnsubscribe))
            .subscribe((keys: any) => {
                if (keys.value) {
                    let avk = <AppCodeVariableKeys[]>keys.value;
                    if (JSON.stringify(this.oldAvk) === JSON.stringify(avk)) {
                    }
                    else {
                        this.handelAVK(avk);
                    }

                }
            })
    }
    handelAVK(avk: AppCodeVariableKeys[]) {
        this.oldAvk = [];
        avk.forEach(a => {
            let f = Object.assign({}, a);
            this.oldAvk.push(f);
            this.selectizeSetFastSearch(a.appCode, a.varPropName, a.varPropVal, a.defaultPropVal, a.excludedCodes);
        });

    };

    // set search key  of  selectize
    selectizeSetFastSearch(appCode: number, PropName: string, PropVal: string, defaultPropVal: number, excludedCodes: string = '') {
        if (this.selectizeArray) {

            this.selectizeArray.forEach(selectize => {
                if (selectize.appcode == +appCode) {
                    selectize.setFastSearchObjDynamicKey(PropName, PropVal);
                    selectize.clearItems();
                    selectize.clear();
                    selectize.writeValue(defaultPropVal);
                    selectize.excludedCodes = `'${excludedCodes}'`;
                }

            });
        }
    };

    onSelectizeClick(item: any, codeKey: any) {
        if (item && codeKey && codeKey.dependAppcode && codeKey.dependAppcode != '') {
            if (codeKey.dependAppcode.toString().includes('{')) {

                let parmsJson = <Array<any>>JSON.parse(codeKey.dependAppcode);
                if (this.selectizeArray) {
                    this.selectizeArray.forEach(selectize => {
                        parmsJson.forEach(app => {
                            if (selectize.appcode == +app.dependAppcode) {
                                selectize.setFastSearchObjDynamicKey(app.dependProp, item.code);
                                selectize.clearItems();
                                selectize.clear();
                            }
                            if (selectize.appcode == +app.dependAppcode2) {
                                selectize.setFastSearchObjDynamicKey(app.dependProp, item.code);
                                selectize.clearItems();
                                selectize.clear();
                            }
                            if (selectize.appcode == +app.dependAppcode3) {
                                selectize.setFastSearchObjDynamicKey(app.dependProp, item.code);
                                selectize.clearItems();
                                selectize.clear();
                            }
                        })

                    });
                }
                /////////////////// 
            }
            this.selectizeSetFastSearch(codeKey.dependAppcode, codeKey.dependProp, item.code, null);

        }
        if (item) {
            try {
                this.searchForm.controls[codeKey.controlName + '_Ar'].setValue(item['nameAr']);
                this.searchForm.controls[codeKey.controlName + '_En'].setValue(item['nameAr']);

                if (codeKey.code) {
                    if (this.triggerSearchAppCodes.includes(codeKey.code)) {
                        this.onSearchClick(null);
                    }
                }
            }
            catch (e) {
                console.log('this.searchForm.controls[codeKey.controlName + _En] ' + 'error');
            }
        }
        if (item == null) {
            this.searchForm.controls[codeKey.controlName + '_Ar'].setValue(null);
            this.searchForm.controls[codeKey.controlName + '_En'].setValue(null);
        }


    }

    onSelected(item: any, codeKey: any) {
        if (codeKey.code) {
            if (this.triggerSearchAppCodes.includes(codeKey.code)) {
                this.onSearchClick(null);
            }
        }
    }
    /** ------------------------------------------------------------------------------------ */

    ngOnInit() {
        if (this.appearFastSearch != undefined) {
            this.toggleFilter = this.appearFastSearch;
        }
        if (this.appCodes.length > 0) {
            this.getCachedAppCodes();
        } else {
            this.createForm();
        }


        this._USS
            .subscribeToKey$('appCodesReport').pipe(
                takeUntil(this.ngUnsubscribe))
            .subscribe(res => {
                if (res.name === 'appCodesReport' && res.value) {
                    this.appCodes = res.value;
                    if (this.appCodes.length > 0) {
                        this.getCodesData();
                    } else {
                        this.createForm();
                    }
                }
            });
        console.log(this.preventEmptySearch)

    }

    getCachedAppCodes() {
        const _cached = this._SS.getCachedAppCodes('fast_search', this.appCodes);
        if (_cached.length > 0) {
            this.usingAppCodeData(_cached);
        } else {
            this.getCodesData();
        }
    }
    getCodesData() {
        this.httpGeneralService.getWith(`${searchAppCodeUrl}/${this.appCodes.toString()}`)
            .subscribe(res => {
                this.usingAppCodeData(res['data']);
                this._SS.cachAppCodes('fast_search', this.appCodes, res['data']);
            });
    }
    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
    /** *********** used to create form controls ************************** */
    dynamicFunction() {
        this.test = false;
        this.appCodesKeys = [];
        this.getCachedAppCodes();
    }
    checkHidden: number = 0;
    usingAppCodeData(_data) {
        // console.log('_____this.appCodesKeys___')
        // console.log(this.appCodesKeys)
        this.appCodesKeys = _data;

        this.appCodesKeys.forEach(el => {
            if (this.reportCriterias.some(rc => rc.appCode == el.code)) {
                let obj = this.reportCriterias.find(rc => rc.appCode == el.code);
                if (obj.reportInfo) {
                    obj.reportInfo = obj.reportInfo.replace("&lt;p&gt;", "");
                    obj.reportInfo = obj.reportInfo.replace("&lt;/p&gt;", "");
                    obj.reportInfo = obj.reportInfo.replace("&amp;nbsp;", "");
                }

                this.reportInfo = obj && obj.reportInfo ? obj.reportInfo : "";
                el.excludedCodes = obj.excludedCodes;
                el.requiredField = obj.requiredField;
                el.placholderKey = obj.customPlaceholder ? obj.customPlaceholder : el.placholderKey;
                if (el.StaticFalg) {
                    this.checkHidden = 1;
                }
            }

        });
        // if ((this.reportCriterias && this.reportCriterias.length)) {
        //     this.reportInfo = this.reportCriterias[0].reportInfo;
        // } else {
        //     this.reportInfo = "";
        // }
        // if (this.reportInfo) {
        //     this.isReport = true
        // } else {
        //     this.isReport = false
        // }


        this.checkMulti(this.appCodesKeys);
        this.checkStaticFlag(this.appCodesKeys)
        this.createForm();
    }
    reCreate(appCodes: any[]) {
        this.appCodes = appCodes;
        this.dynamicFunction();
    }
    checkMulti(appCodes: any[]) {
        if (this.multiAppCodes && this.multiAppCodes.length > 0) {
            appCodes.forEach(a => {
                let indx = this.multiAppCodes.findIndex((sub, inx, arr) => {
                    return sub == a['code'];
                });
                if (indx != -1) {
                    a['multi'] = true;
                }
            });
        }
    }

    checkStaticFlag(appCodes: any[]) {
        appCodes.forEach(ele => {
            if (ele.staticFalg == 1) {
                ele['staticFlagAppCode'] = true
            }

        });
        // console.log(this.appCodesKeys)
    }
    createForm() {
        this.test = true;
        if (this.searchForm) {
            this.searchForm.reset();
        } else {
            this.searchForm = this.fb.group({ fastSearchData: '' });
        }
        this.appCodesKeys.forEach(key => {
            if (key.type == 'selectize' && key.multi) {
                this.searchForm.addControl(key.controlName + 'Arr', new FormControl());
            } else {
                this.searchForm.addControl(key.controlName, new FormControl());
            }

            if (key.type == 'selectize') {
                this.searchForm.addControl(key.controlName + '_Ar', new FormControl());
                this.searchForm.addControl(key.controlName + '_En', new FormControl());
            }
            if (key.requiredField == 1) {
                this.searchForm.get(key.controlName).setValidators([Validators.required]);
                // this._toast.toastMsg(`${key.controlName} is mandatory`, 'error', 'Error');
                this.searchForm.get(key.controlName).updateValueAndValidity();



            }

        });
        // console.log(this.searchForm)

        this.searchForm.addControl('tryInput', new FormControl());
        this.setDefaultData();
    }

    setDefaultData() {

        let datesNeedDefault = [];

        for (let i = 0; i < this.appCodesKeys.length; i++) {
            if (this.appCodesKeys[i].type == 'date' && this.appCodesKeys[i].defaultValue == 'today' && this.preventDefault != true) {
                datesNeedDefault.push(this.appCodesKeys[i].controlName);
            }
            else if (this.appCodesKeys[i].type == 'selectize' && this.appCodesKeys[i].defaultValue != null && this.preventDefault != true) {
                this.searchForm.get(this.appCodesKeys[i].controlName).setValue(+this.appCodesKeys[i].defaultValue);
            }

            else if (this.appCodesKeys[i].type == 'selectize' && this.appCodesKeys[i].staticFlagValue != null && this.appCodesKeys[i].staticFalg == 1) {
                this.searchForm.get(this.appCodesKeys[i].controlName).setValue(+this.appCodesKeys[i].staticFlagValue);
            }
            else if (this.appCodesKeys[i].type == 'hidden' && this.appCodesKeys[i].staticFlagValue != null && this.appCodesKeys[i].staticFalg == 1) {
                this.searchForm.get(this.appCodesKeys[i].controlName).setValue(+this.appCodesKeys[i].staticFlagValue);
            }
            // && this.appCodesKeys[i].defaultValue == 'false' && this.preventDefault != true
            else if (this.appCodesKeys[i].type == 'checkbox') {

                this.searchForm.get(this.appCodesKeys[i].controlName).setValue(false);
            }


        }
        //--------check  if  length > 0 
        if (datesNeedDefault.length == 0) {
            //----this  should be only one  after all  the   last  subscribtion 
            if (this.emitSearchAfterInt) {
                this.onSearchClick(null);
            }
        } else if (datesNeedDefault.length > 0) {
            this._sharedDateService.day$
                .subscribe(day => {
                    let ngb = getNgBsObj(day);
                    datesNeedDefault.forEach(dd => {
                        this.searchForm.get(dd).setValue(ngb);
                        //----this  should be only one  after all  the   last  subscribtion 
                        if (this.emitSearchAfterInt) {
                            this.onSearchClick(null);
                        }
                    });

                }, error => console.log(error)
                    , () => null)
        }
        if (!this.initComplete) {

            this.appCodeVarKeys$();
            let avk = <AppCodeVariableKeys[]>this._USS.getSessionKey('appCodeVarKeys' + this.guid);
            if (avk) {
                window.setTimeout(() => {
                    this.handelAVK(avk);
                }, 1000);
            }
        }
        this.initComplete = true;
    }

    toggleFilterArea() {
        this.innerValue = '';
        this.searchForm.reset();
        this.toggle.emit(null);
        this.toggleFilter = !this.toggleFilter;
        if (this.toggleFilter == false) {
            this.setDefaultData();
        }
    }
    /**  ----------- call after search btn clicked  ----------------------- */

    onSearchClick(form: any) {

        this.emitSearchAfterInt = false;

        if (this.toggleFilter == true && this.inputFastSearch) {
            this.inputFastSearch.nativeElement.select();
            this.inputFastSearch.nativeElement.focus();
        } else if (this.inputCustom) {

            this.inputCustom.nativeElement.select();
            this.inputCustom.nativeElement.focus();
        };
        let searchObj = this.searchForm.value;
        let arr = []
        Object.keys(searchObj).forEach(
            key => {
                if (searchObj[key] == undefined || searchObj[key] == null || searchObj[key] == "") {

                }
                else {
                    arr.push(key);
                }
            }
        )

        // if (arr.length == 0 && (this.preventEmptySearch == false ) &&  !this.emitSearchAfterInt ) {
        //     this._toast.toastMsg('من فضلك قم بتحديد معاير البحث', 'error', 'Error');
        //     arr = [];
        //     return -1;
        // }


        if (Object.keys(this.fixedSearchType).length > 0) {
            searchObj['JobId'] = this.fixedSearchType.JobId
        }

        let xx = Object.assign({}, searchObj);
        for (let i = 0; i < this.appCodesKeys.length; i++) {
            if (this.appCodesKeys[i].type == 'date') {
                let temp = xx[this.appCodesKeys[i]['controlName']];
                // if (temp != undefined && temp != null
                //     && temp.year != undefined && temp.year != null
                //     && temp.month != undefined && temp.month != null
                //     && temp.day != undefined && temp.day != null
                // )
                if (temp && temp.day > 0
                ) {
                    xx[this.appCodesKeys[i]['controlName']] = getDateObj(temp);
                    xx[this.appCodesKeys[i]['controlName'] + 'Str'] = temp.year + '/' + temp.month + '/' + temp.day;
                }
                else {
                    xx[this.appCodesKeys[i]['controlName']] = null
                }
            }
            if (this.appCodesKeys[i].type == 'fixed') {
                xx[this.appCodesKeys[i]['controlName']] = this.appCodesKeys[i]['defaultValue'];
            }
            if (this.searchForm.invalid) {
                // console.log(this.appCodesKeys)
                this._toast.activateMsg('UI301')
                return -1;
            }
            // console.log(this.appCodesKeys)
        }

        this.searchKeys.emit(xx);
    }
    onFastSearchDataFocus() {
        if (this.inputFastSearch)
            this.inputFastSearch.nativeElement.select();
    }

    //////////////////////////#popup#//////////////////////////
    compType: number;
    @ViewChild('content', { static: false }) popup: ModalContainerComponent;
    labSearchPopup(type: number = 1) {
        this.compType = type;
        this.popup.openModal('LabSearchComponent' + type, 'parms', {}, 'lg');
    }

    onModalClose(ev: any) {
        if (ev && ev.name == "LabSearchComponent1" && ev.output) {
            this.handleDataToFastSearch(ev.output);
        }
    }

    handleDataToFastSearch(labsearch: { serviceCode: number, serviceSheets: any[] }) {
        if (labsearch.serviceSheets && labsearch.serviceSheets.length > 0) {
            this.searchForm.addControl('serviceCode', new FormControl());
            this.searchForm.get('serviceCode').setValue(labsearch.serviceCode);
            labsearch.serviceSheets.forEach((el, i) => {
                this.searchForm.addControl('sheetItem' + '_' + el.sheetCode, new FormControl());
                this.searchForm.get('sheetItem' + '_' + el.sheetCode).setValue(el.sheetValue);
            });
        }
        // else {
        //     let formObj = this.searchForm.value;
        //     this.searchForm.removeControl('serviceCode');
        //     Object.keys(formObj).forEach(key => {
        //         if (key.startsWith('sheetItem')) {
        //             this.searchForm.removeControl(key);
        //         }
        //     });
        // }

    }
    //#region input events
    onKeydown(event) {
        this.onSearchClick(null);
        event.preventDefault()
    }
    isEmpty(obj) {

        Object.keys(obj).forEach(
            key => {
                if (obj[key] == undefined || obj[key] == null) {
                    // this._toast.toastMsg('من فضلك قم بتحديد معاير البحث', 'error', 'Error');
                    return true
                }
            }
        )
    }


}

