import { IconActionModule } from './../ui-component/action-icon/action-icon.module';

import { of as observableOf, Observable, Subscription } from 'rxjs';

import { switchMap, debounceTime } from 'rxjs/operators';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  NgModule,
  OnInit,
  Output,
  forwardRef,
  ViewChild

} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FastSearch, SelectizeService } from './selectize.service';
import {
  FormControl,
  ReactiveFormsModule,
  Validator
} from '@angular/forms';
import { Options } from './options';
import {
  TranslateModule,
  TranslateService
} from '@ngx-translate/core';

import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../storage.service';
import { SelectizeAddItemHelper } from './selectize-add-item.helper';
import { UserSessionService } from '../../shared/shared';

//	أبسام	أَبْسام
//service and classes

//  used to export ngmoudle in your coustm control ***********************************************************************************
const noop = () => { };

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SelectizeComponent),
  multi: true
};

@Component({
  selector: 'sanabel-selectize',
  templateUrl: './selectize.component.html',
  styleUrls: ['./selectize.component.css'],
  providers: [SelectizeService, CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR, SelectizeAddItemHelper]
})
export class SelectizeComponent
  implements OnInit, AfterViewInit, ControlValueAccessor, Validator {
  //The internal data model

  private innerValue: any = '';
  private innerText: any = {
    valueAr: '',
    valueEn: ''
  };
  public styleClass: string;
  multiCodesString: string;
  onFocusClasses = '';
  isActionIconVisiable = false;
  defaultSelectedAppCodes = [];
  keyDownArr = [];
  @Input() textColor: string;
  @Input() borderColor: string;
  @Input() cancelColor: string;
  @Input() radiusSize: number;
  @Input() noRadius: number;
  @Input() outlineSize: number;
  @Input() ItemsCount: number;
  @Input() selectizeData: boolean;   // input flag to set all selectize data into session 'itemData'    _____Asmaa___
  @Input() formGroupToggle: boolean;

  @Input() InventoryType: number;
  @Input() inputBackgroundColor: string;
  @Input() forceRefreshEverySearch: boolean;

  @ViewChild('scroll', { static: true }) private myScrollContainer: ElementRef;
  @ViewChild('inputElement', { static: true }) private inputElement: ElementRef;

  @Input() typeBarcodeSearch: number;

  x = []
  // @HostListener('document:keydown', ['$event'])

  hotkeys(event) {
    let text = event.key;
    if (this.myScrollContainer && (text == 'ArrowUp' || text == 'ArrowDown')) {
      this.myScrollContainer.nativeElement.scrollTop = this.highLightedOptionInedx * (this.myScrollContainer.nativeElement.scrollHeight / this.myScrollContainer.nativeElement.childElementCount);
      event.preventDefault();
    }
    if (event.keyCode == 17 || event.keyCode == 16 || event.keyCode == 74 || event.keyCode == 123) {
      this.x.push(event.keyCode);
      if (event.keyCode == 74 && this.x.length >= 3) {
        if (this.x[this.x.length - 2] == 16 && this.x[this.x.length - 3] == 17) {

          // console.log(e.key);
          console.log(event.keyCode);
          event.preventDefault();


        }
        console.log(event.keyCode);

      } else {
        //console.log(e.key);
        console.log(event.keyCode);
        event.preventDefault();
      }

    }

  }
  //-----------------------------------------------------------------------------------------
  //***********************************************
  //Placeholders for the callbacks which are later providesd
  //by the Control Value Accessor
  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;

  //get accessor
  get value(): any {
    return this.innerValue;
  }

  //set accessor including call the onchange callback
  set value(v: any) {
    if (v !== this.innerValue) {
      this.innerValue = v && v.code ? v.code : v;
      this.onChangeCallback(v);
    }
  }

  //From ControlValueAccessor interface
  writeValue(value: any) {
    if (value != null && value !== this.innerValue) {
      this.innerValue = value;
      this.value = value;
      let cached = this.findInCach(value);
      if (cached) {
        this.assignSelectedItem(cached, false, true);
      } else this.initalizeData(value);
    }

    if (!value) {
      this.clear(true);
    }
  }

  //From ControlValueAccessor interface
  registerOnChange(fn: any) {
    if (this.selectizeOptions != null) {
      if (!this.selectizeOptions.selected) this.searchInputControl.setValue('');
      else {
        this.searchInputControl.setValue(
          this.translate.currentLang == 'ar'
            ? this.selectizeOptions.selected[this.selectizeOptions.labelFieldAr]
            : this.selectizeOptions.selected[this.selectizeOptions.labelField]
        );
      }
    }
    this.propagateChange = fn;
  }

  //From ControlValueAccessor interface
  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

  // the method set in registerOnChange to emit changes back to the form
  private propagateChange = (_: any) => { };
  // validates the form, returns null when valid else the validation object
  public validate(c: FormControl) {
    return this.value > 0
      ? null
      : {
        required: {
          valid: false
        }
      };
  }

  //*********************************************************************************************************************************
  // object for service make http request to server
  serviceObject: any;
  // function name this called from object service
  functionName: string;
  // object used to send params to function in servicec as key value pairs
  paramsObject: any = {};

  // global fast search object
  globalFastSearchObj: FastSearch = <FastSearch>{};
  //*********************************************************************************************************************************
  @Input()
  smallInput: boolean = false;
  @Input()
  tabindex: number;
  @Input()
  appcode: number;
  @Input()
  parentSerial: number;
  @Input()
  disabled: boolean;
  @Input()
  required: boolean;
  @Input()
  readonly: number;
  @Input() addNewItem: number;
  @Input() selectTopOne: number;
  @Output()
  onAddNewItem: EventEmitter<any> = new EventEmitter<any>()
  @Input()
  set SearchKeys(value) {
    if (value) {
      for (let key in value) {
        this.setFastSearchObjDynamicKey(key, value[key]);
      }
      this.filterCurrentItemsBySearchKeys();
    }
  }
  @Output()
  itemSelected: EventEmitter<any>;
  @Output()
  clicked: EventEmitter<string>;
  @Output()
  keydown = new EventEmitter<any>();
  @Output()
  change = new EventEmitter<any>();
  @Output()
  addSelected: EventEmitter<any>;
  @Input()
  selectizeOptions: Options;
  @Input()
  simpleView: boolean = false;

  @Input()
  workAsBarcode: boolean = false;

  @Input()
  multi: boolean = false;
  @Input()
  excludedCodes: string;
  @Input()
  customPlaceHolder: string;
  @Input()
  canceled: boolean = false;
  isFocused: boolean = false;
  ignorBlur: boolean = false;
  toggleDropdown: boolean = false;
  isSelected: boolean = false;
  searchOnFocus: boolean = false;
  searchOnServerWithNoFilter: boolean = false;


  canBeCached: boolean = false;
  searchInputControl = new FormControl();
  searchInputSubscribe: Subscription;
  highLightedOption: any;
  highLightedOptionInedx: number = -1;
  oldSearchKeys: string[] = [];
  addtionalFilterKeys: any[] = [];
  multiItems: any[];
  heightOfSelectize: any;
  actionsSettingsList = [];
  linkId: number;
  constructor(
    _http?: HttpClient,
    translate?: TranslateService,
    _userSessionService?: UserSessionService,
    _selectizeService?: SelectizeService,
    elementRef?: ElementRef,
    _addItemHelper?: SelectizeAddItemHelper
  );

  constructor(
    private _http: HttpClient,
    public translate: TranslateService,
    private _userSessionService: UserSessionService,
    public _selectizeService: SelectizeService,
    private elementRef: ElementRef,
    public _addItemHelper: SelectizeAddItemHelper
  ) {
    this.itemSelected = new EventEmitter<any>();
    this.clicked = new EventEmitter<string>();
    this.addSelected = new EventEmitter<any[]>();
  }
  enter(value: any) {
    if (!this.selectizeOptions.currentResults.some(entry => entry === value)) {
      this.selectizeOptions.currentResults.push({ code: 9999, nameAr: value, nameEn: value });
    }
  }
  ngOnInit() {
    if (this.excludedCodes) {
      //  console.log(this.excludedCodes);
    }

    this._selectizeService.appCode = this.appcode;
    //console.log(this.ItemsCount);
    this.multiItems = [];
    if (this.appcode > 1000)
      this.paginator = true;
    this.getPreferredPageSize()

    this.globalFastSearchObj.AppCode = this.appcode;
    if (this.rows) {
      this.globalFastSearchObj.FromRow = 1;
      this.globalFastSearchObj.ToRow = this.rows;
    }
    this.selectizeOptions = this.getSelectizeOptions(this.appcode);

    this.serviceObject = this._selectizeService;
    this.functionName = 'fastSearch';
    this.selectizeOptions.currentResults = this.selectizeOptions.items = [];
    if (this.selectizeOptions != null) {
      if (!this.selectizeOptions.selected) this.searchInputControl.setValue('');
      else {
        this.searchInputControl.setValue(
          this.translate.currentLang == 'ar'
            ? this.selectizeOptions.selected[this.selectizeOptions.labelFieldAr]
            : this.selectizeOptions.selected[this.selectizeOptions.labelField]
        );
      }
    }

    this.checkActionIconVisibilityAndOptions(this.appcode);
    this.setFastSearchKey('WorkAsBarcode', this.workAsBarcode ? 1 : 0);
    let linkObj = JSON.parse(sessionStorage.getItem('LinkObj'));
    if (linkObj && (linkObj['mode'] != null || linkObj['mode'] != undefined)) {
      let modeType = +linkObj['mode'];
      this.linkId = +linkObj['code'];
      this.setFastSearchObjDynamicKey('modeType', modeType);
    }

    this.newItemData$();

  }
  checkActionIconVisibilityAndOptions(_appcode: number) {
    let linkObj = JSON.parse(sessionStorage.getItem('LinkObj'));
    if (linkObj && (linkObj['code'])) {
      this.linkId = +linkObj['code'];
    }
    this.isActionIconVisiable = false;
    if (_appcode == 1247) { // store item search
      this.isActionIconVisiable = true;
      // filter items having balance
      this.actionsSettingsList.push(6596);
      if (this.linkId != 5216 && this.linkId != 5204) {//الاضافة المباشرة
        this.setFastSearchKey('filterItemshavingBalance', 1);//default setting
        this.defaultSelectedAppCodes.push(6596);//to put the chaeck icon
      }
      this.actionsSettingsList.push(6638);
      this.actionsSettingsList.push(6597); // filter items Active Material/drug
      this.actionsSettingsList.push(6625); // filter Barcode1
      this.actionsSettingsList.push(6626); // filter Barcode2
      this.actionsSettingsList.push(6627); // filter Barcode3
      this.actionsSettingsList.push(6628); // filter Barcode4
      // this.actionsSettingsList.push(6731); // filter FDA Code
      if (this.typeBarcodeSearch) {
        if (this.typeBarcodeSearch == 1) this.defaultSelectedAppCodes.push(6625);
        if (this.typeBarcodeSearch == 2) this.defaultSelectedAppCodes.push(6626);
        if (this.typeBarcodeSearch == 3) this.defaultSelectedAppCodes.push(6627);
        if (this.typeBarcodeSearch == 4) this.defaultSelectedAppCodes.push(6628);
        if (this.typeBarcodeSearch == 5) this.defaultSelectedAppCodes.push(6638);

      }
    }
    if (_appcode == 1044) { // store item search
      this.isActionIconVisiable = true;
      this.actionsSettingsList.push(6596); // filter items having balance
      this.actionsSettingsList.push(6597); // filter Barcode
    }


  }
  rowIconClickTwo(code: any, item: any) {
    this.workAsBarcode = false;
    if (code == 6596) {

      if (this.globalFastSearchObj.objDynamic && this.globalFastSearchObj.objDynamic['filterItemshavingBalance']) {
        this.removeFastSearchObjDynamicKey('filterItemshavingBalance');
      } else {
        this.setFastSearchKey('filterItemshavingBalance', 1);

      }
    }

    if (code == 6638) {
      if (this.globalFastSearchObj.objDynamic && this.globalFastSearchObj.objDynamic['unitBarcode']) {
        this.removeFastSearchObjDynamicKey('unitBarcode');

      } else {
        this.setFastSearchKey('unitBarcode', 1);
        this.workAsBarcode = true;
      }
    }

    if (code == 6597) {
      if (this.globalFastSearchObj.objDynamic && this.globalFastSearchObj.objDynamic['activateSearchingWithActiveMaterials']) {
        this.removeFastSearchObjDynamicKey('activateSearchingWithActiveMaterials');
      } else {
        this.setFastSearchKey('activateSearchingWithActiveMaterials', 1);
      }

    }
    //Bracode -start
    if (code >= 6625 && code <= 6628 || code == 6638) {
      if (this.globalFastSearchObj.objDynamic && this.globalFastSearchObj.objDynamic['barcodeSearchColumn']) {
        this.removeFastSearchObjDynamicKey('barcodeSearchColumn');
      } else {
        this.workAsBarcode = true;
        let parm: number;
        switch (code) {
          case 6625:
            parm = 1
            break;
          case 6626:
            parm = 2
            break;
          case 6627:
            parm = 3
            break;
          case 6628:
            parm = 4
            break;
          case 6638:
            parm = 5
            break;
          default:
            break;
        }
        this.setFastSearchKey('barcodeSearchColumn', parm);
      }


    }
    //Bracodes - End
    this.clear();
    this.clearItems();
  }

  ngAfterViewInit() {
    // if (this.multi == undefined) this.multi = false;
    setTimeout(() => {
      this.createObservableSearch();
    }, 0);
    //offsetHeight
    //  this.heightOfSelectize = 'bottom:-' +this._paginator.nativeElement.parentNode.offsetHeight + 30 + 'px'

  }
  getSelectizeOptions(appcode: number) {
    // place holders
    ///   error by reda
    this.canBeCached = true;
    this.searchOnFocus = true;
    this.searchOnServerWithNoFilter = false;
    let placholderKey = 'Search';
    switch (+appcode) {
      case 1:
        placholderKey = 'PATIENTGENDER';
        break;
      case 3:
        placholderKey = 'Religion';
        break;
      case 5:
        placholderKey = 'SERVICETYPE';
        break;
      case 6:
        placholderKey = 'CompanyType';
        break;
      case 7:
        placholderKey = 'visitType';
        break;
      case 8:
        placholderKey = 'REJECTREASON';
        break;
      case 10:
        placholderKey = 'ResourceType';
        break;
      case 12:
        placholderKey = 'ServiceStatus';
        break;
      case 13:
        placholderKey = 'BUILDINGTYPES';
        break;
      case 14:
        placholderKey = 'ClaimForm';
        break;
      case 17:
        placholderKey = 'CASHIERTYPE';
        break;
      case 18:
        placholderKey = 'ITEMTYPE';
        break;
      case 19:
        placholderKey = 'TYPE';
        break;
      case 20:
        placholderKey = 'TYPE';
        break;
      case 22:
        placholderKey = 'INVENTORY';
        break;
      case 21:
        placholderKey = 'dispensType';
        break;
      case 23:
        placholderKey = 'MedicalType';
        break;
      case 24:
        placholderKey = 'BloodGroup';
        break; //////
      case 25:
        placholderKey = 'Infraction';
        break;
      case 26:
        placholderKey = 'SanctionType';
        break;
      case 27:
        placholderKey = 'CarType';
        break;
      case 28:
        placholderKey = 'LICENSETYPE';
        break;
      case 29:
        placholderKey = 'taxType';
        break;
      case 30:
        placholderKey = 'insuranceType';
        break;
      case 31:
        placholderKey = 'stopSalary';
        break;
      case 32:
        placholderKey = 'expenseWay';
        break;
      case 33:
        placholderKey = 'workStatus';
        break;
      case 34:
        placholderKey = 'stockNature';
        break;
      case 35:
        placholderKey = 'VisitStatus';
        break;
      case 36:
        placholderKey = 'CANCELREASON';
        break;
      case 37:
        placholderKey = 'PATIENTEXITSTATUS';
        break;
      case 38:
        placholderKey = 'patStopDeal';
        break;
      case 39:
        placholderKey = 'BENEFITKIND';
        break;
      case 40:
        placholderKey = 'PERCENTORVALUE';
        break;
      case 41:
        placholderKey = 'MEDICALNUMBERCODING';
        break;
      case 42:
        placholderKey = 'PRIORITYSEARCHCODE';
        break;
      case 43:
        placholderKey = 'TRANSLATEMETHOD';
        break;
      case 44:
        placholderKey = 'SecurityLevel';
        break;
      case 45:
        placholderKey = 'TYPE';
        break;
      case 46:
        placholderKey = 'DiscountType';
        break;
      case 47:
        placholderKey = 'RepeatAction';
        break;
      case 48:
        placholderKey = 'PeriodType';
        break;
      case 49:
        placholderKey = 'BillItemTypes';
        break;
      case 51:
        placholderKey = 'Module';
        break;
      case 52:
        placholderKey = 'LangId';
        break;
      case 50:
        placholderKey = 'CONTRACTWORKTYPE';
        break;
      case 54:
        placholderKey = 'DEBITTYPE';
        break;
      case 55:
        placholderKey = 'DEDUCTIONTYPE';
        break;
      case 56:
        placholderKey = 'TYPE';
        break;
      case 57:
        placholderKey = 'MONTH';
        break;
      case 59:
        placholderKey = 'APPROVALMETHOD';
        break;
      case 60:
        placholderKey = 'CLAIMTYPE';
        break;
      case 61:
        placholderKey = 'CLAIMSTATE';
        break;
      case 63:
        placholderKey = 'TAXTYPE';
        break;
      case 64:
        placholderKey = 'MEMOSCODE';
        break;
      case 66:
        placholderKey = 'PERIODIDENTIFIER';
        break;
      case 68:
        placholderKey = 'REJECTIONS';
        break;
      case 69:
        placholderKey = 'EXCHANGETYPE';
        break;
      case 70:
        placholderKey = 'SKILLTYPE';
        break;
      case 71:
        placholderKey = 'UNITORTOTAL';
        break;
      case 72:
        placholderKey = 'ACTUALORAPPROX';
        break;
      case 73:
        placholderKey = 'INCREASEORDECREASE';
        break;
      case 74:
        placholderKey = 'RESTYPE';
        break;
      case 75:
        placholderKey = 'STATUS';
        break;
      case 76:
        placholderKey = 'STATUSTYPE';
        break;
      case 77:
        placholderKey = 'ORDERSTATUS';
        break;
      case 78:
        placholderKey = 'SORTUPON';
        break;
      case 79:
        placholderKey = 'SORTTYPE';
        break;
      case 80:
        placholderKey = 'EXAMINATIONSTATUS';
        break;
      case 81:
        placholderKey = 'PATIENTTYPE';
        break;
      case 82:
        placholderKey = 'CompanyType';
        break;
      case 83:
        placholderKey = 'MEDROLE';
        break;
      case 86:
        placholderKey = 'ORDERSTATUS';
        break;
      case 88:
        placholderKey = 'PATLISTTYPE';
        break;
      case 89:
        placholderKey = 'PATLISTVISOPT';
        break;
      case 91:
        placholderKey = 'MANUFACTE';
        break;
      case 92:
        placholderKey = 'BOOKINGFOR';
        break;
      case 93:
        placholderKey = 'HEADERORBODY';
        break;
      case 94:
        placholderKey = 'ARRIVALMETHOD';
        break;
      case 95:
        placholderKey = 'STATUSATARRIVAL';
        break;
      case 96:
        placholderKey = 'INJURYTYPE';
        break;
      case 97:
        placholderKey = 'TRIAGECODE';
        break;
      case 98:
        placholderKey = 'BIRTHTYPE';
        break;
      case 99:
        placholderKey = 'NAMINGFOLLOW';
        break;
      case 100:
        placholderKey = 'NATIONALITYFOLLOW';
        break;
      case 101:
        placholderKey = 'CALLREASON';
        break;
      case 102:
        placholderKey = 'CALLERRESULT';
        break;
      case 104:
        placholderKey = 'ANTHTYPE';
        break;
      case 106:
        placholderKey = 'FLOORTYPE';
        break;
      case 107:
        placholderKey = 'RESERVTYPE';
        break;
      case 108:
        placholderKey = 'PRICINGON';
        break;
      case 108:
        placholderKey = 'LIMIT';
        break;

      case 112:
        placholderKey = 'PARCODETYPE';
        break;
      case 113:
        placholderKey = 'CLAIMEXTRACT';
        break;
      case 114:
        placholderKey = 'BREAKDOWNPRIORITY';
        break;
      case 115:
        placholderKey = 'BREAKDOWNDEGREE';
        break;
      case 116:
        placholderKey = 'ROOMSTATUS';
        break;
      case 117:
        placholderKey = 'BREAKDOWNTYPE';
        break;
      case 118:
        placholderKey = 'MNTTYPE';
        break;
      case 119:
        placholderKey = 'MNTSTATUS';
        break;
      case 120:
        placholderKey = 'MNTDEST';
        break;
      case 121:
        placholderKey = 'MNTRESULT';
        break;
      case 122:
        placholderKey = 'SERVICEORDEAL';
        break;
      case 126:
        placholderKey = 'MORININGEVENINGTYPE';
        break;
      case 137:
        placholderKey = 'ABSENTTYPE';
        break;
      case 138:
        placholderKey = 'ASSETSSTATUS';
        break;
      case 139:
        placholderKey = 'DEPRECIATIONTYPE';
        break;
      case 141:
        placholderKey = 'VALUETYPE';
        break;
      case 142:
        placholderKey = 'REAL_ONPAPER';
        break;
      case 144:
        placholderKey = 'TYPE';
        break;
      case 146:
        placholderKey = 'ATTENDTYPE';
        break;
      case 150:
        placholderKey = 'TYPE';
        break;
      case 151:
        placholderKey = 'POORDERSTATUS';
        break;
      case 152:
        placholderKey = 'POORDERTYPE';
        break;
      case 154:
        placholderKey = 'EXAMINATINSTATUS';
        break;
      case 155:
        placholderKey = 'ORDERSTATUS';
        break;
      case 159:
        placholderKey = 'SCRAPINGREASON';
        break;
      case 160:
        placholderKey = 'DRAINAGEOFSECONDARYSTORES';
        break;
      case 161:
        placholderKey = 'ITEMCODING';
        break;
      case 164:
        placholderKey = 'VIOLATIONREPEAT';
        break;
      case 389:
        placholderKey = 'VALID';
        break;
      case 167:
        placholderKey = 'DEPORMANG';
        break;
      case 170:
        placholderKey = 'TYPE';
        break;
      case 171:
        placholderKey = 'JOPTITEL';
        break;
      case 172:
        placholderKey = 'ATTENDANCETYPE';
        break;
      case 182:
        placholderKey = 'SALITEM';
        this.canBeCached = false;
        break;
      case 183:
        placholderKey = 'PENALITYLISTCODE';
        this.canBeCached = false;
        break;
      case 187:
        placholderKey = 'CHEQUESTATE';
        this.canBeCached = false;
        break;
      case 192:
        placholderKey = 'STATE';
        this.canBeCached = false;
        break;
      case 194:
        placholderKey = 'EVALUATEDTYPE';
        this.canBeCached = false;
        break;
      case 196:
        placholderKey = 'EVALUATEDNATURE';
        this.canBeCached = false;
        break;
      case 197:
        placholderKey = 'DEGREEID';
        this.canBeCached = false;
        break;

      case 204:
        placholderKey = 'HASATTEND';
        this.canBeCached = false;
        break;

      case 215:
        placholderKey = 'SEARCHBY';
        this.canBeCached = false;
        break;

      case 222:
        placholderKey = 'PRMOTIOINTYPE';
        this.canBeCached = false;
        break;

      case 225:
        placholderKey = 'stopSalary';
        this.canBeCached = false;
        break;
      case 227:
        placholderKey = 'INTERVIEWTYPE';
        this.canBeCached = false;
        break;
      case 252:
        placholderKey = 'LOANRTYPE';
        this.canBeCached = false;
        break;
      case 253:
        placholderKey = 'INCREASETYPE';
        this.canBeCached = false;
        break;
      case 254:
        placholderKey = 'PENALITYSTATUSE';
        this.canBeCached = false;
        break;
      case 255:
        placholderKey = 'FINGERPRINTTYPE';
        this.canBeCached = false;
        break;
      case 256:
        placholderKey = 'FINGERPRINTSTATUSE';
        this.canBeCached = false;
        break;
      case 258:
        placholderKey = 'ORDERSTATUS';
        this.canBeCached = false;
        break;
      case 259:
        placholderKey = 'INCLUDE';
        this.canBeCached = false;
        break;
      case 277:
        placholderKey = 'REVENUEANALYSISTYPE';
        this.canBeCached = false;
        break;
      case 271:
        placholderKey = 'UNCOMPLETEDDATA';
        this.canBeCached = false;
        break;
      case 276:
        placholderKey = 'REVISED';
        this.canBeCached = false;
        break;
      case 289:
        placholderKey = 'TRANSTYPE';
        this.canBeCached = false;
        break;

      case 313:
        placholderKey = 'LEADTYPE';
        this.canBeCached = false;
        break;

      case 358:
        placholderKey = 'OPERATIONSTATUS';
        this.canBeCached = false;
        break;
      case 359:
        placholderKey = 'CALLSTYPE';
        this.canBeCached = false;
        break;

      case 365:
        placholderKey = 'STATUS';
        this.canBeCached = false;
        break;
      case 368:
        placholderKey = 'PLANSTATUS';
        this.canBeCached = false;
        break;
      case 381:
        placholderKey = 'FINGERPRINTCONFIRMTYPE';
        this.canBeCached = false;
        break;
      case 393:
        placholderKey = 'REHIREDATEOPTION';
        this.canBeCached = false;
        break;
      case 396:
        placholderKey = 'CALLSTYPE';
        this.canBeCached = false;
        break;
      case 398:
        placholderKey = 'TENDERSTATUS';
        break;
      case 535:
        placholderKey = 'CONSTRAINTMOVED';
        break;
      case 1001:
        placholderKey = 'CURRENCY';
        break;
      case 1002:
        placholderKey = 'PLACE';
        break;
      case 1003:
        placholderKey = 'ACCOUNTNUMBER';
        break;
      case 1004:
        placholderKey = 'USER';
        break;
      case 1005:
        placholderKey = 'COSTCENTER';
        break;
      case 1006:
        placholderKey = 'Search';
        break; //search available  links
      case 1007:
        placholderKey = 'CarDriver';
        break;
      case 1008:
        placholderKey = 'CarParamedic';
        break;
      case 1009:
        placholderKey = 'gov';
        break;
      case 1010:
        placholderKey = 'Country';
        break;
      case 1011:
        placholderKey = 'city';
        break;
      case 1012:
        placholderKey = 'village';
        break;
      case 1013:
        placholderKey = 'NATIONALITY';
        break;
      case 1014:
        placholderKey = 'DOCTOR';
        break;
      case 1015:
        placholderKey = 'ServiceOfFirstLevel';
        break;
      case 1016:
        placholderKey = 'Speciality';
        break;
      case 1017:
        placholderKey = 'group';
        break; ///////
      case 1018:
        placholderKey = 'USER';
        break;
      case 1019:
        placholderKey = 'SupplierType';
        break;
      case 1020:
        placholderKey = 'Employee';
        break;
      case 1021:
        if (this.InventoryType == 1) {
          placholderKey = 'Pharmacy';
        } else {
          placholderKey = 'Store';
        }
        this.canBeCached = false;
        break;
      case 1022:
        placholderKey = 'marital';
        break;
      case 1023:
        placholderKey = 'patient';
        break;
      case 1024:
        placholderKey = 'JOBID';
        break; ////////////
      case 1025:
        placholderKey = 'MANAGMENT';
        break;
      case 1153:
        placholderKey = 'DEPARTMENT';
        break; ////////////
      case 1026:
        placholderKey = 'JobType';
        break;
      case 1027:
        placholderKey = 'category';
        break;
      case 1028:
        placholderKey = 'PenalityList';
        break;
      case 1030:
        placholderKey = 'Sanction';
        break;
      case 1029:
        placholderKey = 'Infractions';
        break;
      case 1031:
        placholderKey = 'QUALIFICATIONSCAT';
        break;
      case 1049:
        placholderKey = 'QualificationCat';
        break;
      case 1032:
        placholderKey = 'group';
        break;
      case 1033:
        placholderKey = 'FREQENCY';
        break; ////////
      case 1034:
        placholderKey = 'routesAdmin';
        break;
      case 1035:
        placholderKey = 'CompanyType';
        break;
      case 1036:
        placholderKey = 'PatientCategory';
        break;
      case 1037:
        placholderKey = 'PriceList';
        break;
      case 1038:
        placholderKey = 'ServiceOfSecondLevel';
        break;
      case 1039:
        placholderKey = 'ServiceOfFirstLevel';
        break;
      case 1040:
        placholderKey = 'Contract';
        this.canBeCached = false;
        break;
      case 1041:
        placholderKey = 'group';
        break; //////
      case 1042:
        placholderKey = 'UNIT';
        this.canBeCached = false;
        break;
      case 1043:
        placholderKey = 'DrugInteraction';
        this.canBeCached = false;
        this.searchOnServerWithNoFilter = true;

        break;
      case 1044:
        placholderKey = 'ITEM';
        this.canBeCached = false;
        break;
      case 1045:
        placholderKey = 'USER';
        break;
      case 1072:
        placholderKey = 'USER';
        break;
      case 1046:
        placholderKey = 'MainCompany';
        break;
      case 1047:
        placholderKey = 'Cashier';
        break;
      case 1048:
        placholderKey = 'BRANCHCOMPANY';
        break;
      case 1050:
        placholderKey = 'Bank';
        break;
      case 1051:
        placholderKey = 'VisaType';
        break;
      case 1052:
        placholderKey = 'Doctors';
        break;
      case 1053:
        placholderKey = 'DiscountDiscription';
        break;
      case 1054:
        placholderKey = 'ServiceLevelThird';
        break;
      case 1055:
        placholderKey = 'BillItem';
        break;
      case 1056:
        placholderKey = 'ACCOUNTNUMBER';
        break;
      case 1057:
        placholderKey = 'Vplace';
        break;
      case 1058:
        placholderKey = 'CancelationReason';
        break;
      case 1059:
        placholderKey = 'BranchCompany';
        break;
      case 1060:
        placholderKey = 'JOURNALTYPE';
        break;
      case 1061:
        placholderKey = 'Services';
        break;
      case 1062:
        placholderKey = 'AppCode';
        break;
      case 1063:
        placholderKey = 'SecLogins';
        break;
      case 1064:
        placholderKey = 'group';
        break;
      case 1065:
        placholderKey = 'Branches';
        break;
      case 1066:
        placholderKey = 'SPECIALITY';
        break;
      case 1068:
        placholderKey = 'Links';
        break;
      case 1069:
        placholderKey = 'DIAGNOSES';
        this.canBeCached = false;
        break;
      case 1070:
        placholderKey = 'category';
        break;
      case 1071:
        placholderKey = 'MANAGMENT';
        break;
      case 1073:
        placholderKey = 'PatientStat';
        break;
      case 1074:
        placholderKey = 'VisaMachine';
        break;
      case 1076:
        placholderKey = 'BuildingTypes';
        break;
      case 1077:
        placholderKey = 'SecLogins';
        break;
      case 1078:
        placholderKey = 'Pharmacy';

        break;
      case 1080:
        placholderKey = 'SUPPLIER';
        break;
      //else if (appcode == 1081) { placholderKey = 'Pharmacy'; break;
      case 1082:
        placholderKey = 'SERVICENAME';
        this.canBeCached = false;
        break;
      case 1084:
        placholderKey = 'DEDUCTIONS';
        break;
      case 1085:
        placholderKey = 'MEMOSCODE';
        break;
      case 1088:
        placholderKey = 'COMPLAINTS';
        this.canBeCached = false;
        break;
      case 1087:
        placholderKey = 'BALANCETRANSDATA';
        break;
      case 1089:
        placholderKey = 'FINDINGS';
        this.canBeCached = false;
        break;
      case 1090:
        placholderKey = 'HISTORY';
        break;
      case 1091:
        placholderKey = 'ALLERGIES';
        break;
      case 1092:
        placholderKey = 'REFLUXFROMPATIENT';
        this.canBeCached = false;
        break;
      case 1093:
        placholderKey = 'RESIDENCEDEGREE';
        break;
      case 1094:
        placholderKey = 'OPERATIONSSKILLS';
        break;
      case 1096:
        placholderKey = 'visitNum';
        this.canBeCached = false;
        break;
      case 1097:
        placholderKey = 'BillItem';
        break;
      case 1098:
        placholderKey = 'BUILD';
        break;
      case 1099:
        placholderKey = 'FLOOR';
        this.canBeCached = false;
        break;
      case 1100:
        placholderKey = 'ROOM';
        this.canBeCached = false;
        break;
      case 1101:
        placholderKey = 'BED';
        this.canBeCached = false;
        break;
      case 1102:
        placholderKey = 'DOSE';
        this.canBeCached = false;
        break;
      case 1103:
        placholderKey = 'PERIOD';
        this.canBeCached = false;
        break;
      case 1104:
        placholderKey = 'IV';
        break;
      case 1105:
        placholderKey = 'ITEM';
        this.canBeCached = false;
        break;
      case 1106:
        placholderKey = 'ITEM';
        this.canBeCached = false;
        break;
      case 1107:
        placholderKey = 'COMPANIONNAME';
        break;
      case 1108:
        placholderKey = '';
        break;
      case 1109:
        placholderKey = 'ITEM';
        this.canBeCached = false;
        break;
      case 1110:
        placholderKey = 'GROUPINGTYPE';
        break;
      case 1111:
        placholderKey = '';
        break;

      case 1112:
        placholderKey = 'ADDTIONTRANS';
        this.canBeCached = false;
        break;
      case 1113:
        placholderKey = 'DEVICE';
        break;
      case 1115:
        placholderKey = 'SERVICENAME';
        this.canBeCached = false;
        break;
      case 1120:
        placholderKey = 'STORE';
        break;
      case 1122:
        placholderKey = 'DBTABLE';
        break;
      case 1123:
        placholderKey = 'ITEM';
        break;
      case 1124:
        placholderKey = 'SERVICEACCESSOR';
        break;
      case 1126:
        placholderKey = 'Pharmacy';
        this.canBeCached = false;
        break;
      case 1127:
        placholderKey = 'Store';
        this.canBeCached = false;
        break;
      case 1130:
        placholderKey = 'InOutVariable';
        break;
      case 1131:
        placholderKey = 'DOSE';
        this.canBeCached = false;
        break;
      case 1132:
        placholderKey = 'UNIT';
        this.canBeCached = false;
        break;
      case 1133:
        placholderKey = 'DEVICE';
        break;
      case 1134:
        placholderKey = 'AMBCODE';
        break;
      case 1135:
        placholderKey = 'REPTEMPLATES';
        break;

      // case 1137:
      //   placholderKey = 'BODYPART';
      //   break;
      case 1138:
        placholderKey = 'DEALVARIABLES';
        break;
      case 1139:
        placholderKey = 'OUTPATCLAIMS';
        break;
      case 1140:
        placholderKey = 'INPATCLAIMS';
        break;
      case 1141:
        placholderKey = 'BILLITEMSGROUPS';
        break;
      case 1142:
        placholderKey = 'MANUFACTURINGCOMPANY';
        break;
      case 1143:
        placholderKey = 'SEELLPUBLICK';
        break;
      case 1144:
        placholderKey = 'CLIENT';
        this.canBeCached = false;
        break;
      case 1162:
        placholderKey = 'CLIENT';
        this.canBeCached = false;
        break;
      case 1145:
        placholderKey = 'SALITEMS';
        break;
      case 1146:
        placholderKey = 'VIOPERIOD';
        break;
      case 1147:
        placholderKey = 'JOBDEGREE';
        break;
      case 1148:
        placholderKey = 'VACSTATICS';
        break;
      case 1149:
        placholderKey = 'VACNAMES';
        break;
      case 1150:
        placholderKey = 'PAYROLLTYPE';
        break;
      case 1151:
        placholderKey = 'SALITEMS';
        break;

      case 1154:
        placholderKey = 'Section';
        break;
      case 1155:
        placholderKey = 'SUPPLIERS';
        break;
      case 1157:
        placholderKey = 'ASSETSTYPE';
        break;
      case 1158:
        placholderKey = 'LOANS';
        break;
      case 1159:
        placholderKey = 'ADDTIONTRANS';
        this.canBeCached = false;
        break;
      case 1160:
        placholderKey = 'SHIFTS';
        break;
      case 1161:
        placholderKey = 'TYPE';
        break;
      case 1163:
        placholderKey = 'OPERSKILL';
        break;
      case 1164:
        placholderKey = 'UNIVERSITY';
        break;
      case 1165:
        placholderKey = 'ROOM';
        this.canBeCached = false;
        break;
      case 1167:
        placholderKey = 'TRANSACTIONBFFER';
        this.canBeCached = false;
        break;
      case 1170:
        placholderKey = 'DEVICEID';
        this.canBeCached = false;
        break;
      case 1171:
        placholderKey = 'Attention';
        this.canBeCached = false;
        break;
      case 1172:
        placholderKey = 'ATTENTIONCONDITION';
        this.canBeCached = false;
        break;
      case 1174:
        placholderKey = 'DEAL';
        this.canBeCached = false;
        break;
      case 1191:
        placholderKey = 'COURSE';
        this.canBeCached = false;
        break;
      case 1215:
        placholderKey = 'Employee';
        this.canBeCached = false;
        break;
      case 1216:
        placholderKey = 'Employee';
        break;
      case 1199:
        placholderKey = '';
        break;
      case 1217:
        placholderKey = 'FACULTY';
        this.canBeCached = false;
        break;

      case 1235:
        placholderKey = 'PACAGE';
        this.canBeCached = false;
        break;

      case 1241:
        placholderKey = 'BLOODBANK_STORE';
        this.canBeCached = false;
        break;

      case 1247:
        if (this.workAsBarcode) {
          placholderKey = 'BARCODE';
        } else {
          placholderKey = 'ITEMNAME';
        }
        this.canBeCached = false;
        break;
      case 1432:
        if (this.workAsBarcode) {
          placholderKey = 'BARCODE';
        } else {
          placholderKey = 'ITEMNAME';
        }
        this.canBeCached = false;
        break;

      case 1251:
        placholderKey = 'TRANSTYPE';
        break;

      case 1265:
        placholderKey = 'APPCODESSTP';
        this.canBeCached = false;
        break;

      case 1275:
        placholderKey = 'Employee';
        break;
      case 1277:
        placholderKey = 'TRANSFIERBODIES';
        break;
      case 1297:
        placholderKey = 'MODULENAME';
        this.canBeCached = false;
        break;
      case 1401:
        placholderKey = 'TPACODE';
        this.canBeCached = false;
        break;
      case 1405:
        placholderKey = 'LogedMsg';
        this.canBeCached = false;
        break;
      case 1410:
        placholderKey = 'PatOldContract';
        this.canBeCached = false;
        break;
      case 225:
        placholderKey = 'stopSalary';
        this.canBeCached = false;
        break;
      case 257:
        placholderKey = 'JOBSPLANNING';
        this.canBeCached = false;
        break;

      case 300:
        placholderKey = 'CUSTOMERSTYPES';
        this.canBeCached = false;
        break;

      case 371:
        placholderKey = 'LEADFLAG';
        this.canBeCached = false;
        break;

      case 385:
        placholderKey = 'INCOMPLETEFINGERPRINT';
        this.canBeCached = false;
        break;
      case 386:
        placholderKey = 'PROTECTIONLEVEL';
        this.canBeCached = false;
        break;

      case 460:
        placholderKey = 'ABSENTTYPE';
        this.canBeCached = false;
        break;
      case 1210:
        placholderKey = 'APPLICANT';
        this.canBeCached = false;
        break;
      case 1225:
        placholderKey = 'ITEMPLACE';
        this.canBeCached = false;
        break;
      case 1190:
        placholderKey = 'LOANREASON';
        this.canBeCached = false;
        break;
      case 8016:
        placholderKey = 'EXCLUDEOUTCASHIER';
        this.canBeCached = false;
        break;
      case 1237:
        placholderKey = 'SERVICENAME';
        break;
      case 1442:
        placholderKey = 'SERVICENAME';
        break;
      case 1447:
        placholderKey = 'Employee';
        break;
      case 1239:
        placholderKey = 'Beneficiary';
        break;
      case 1243:
        placholderKey = 'Branches';
        break;
      case 1246:
        placholderKey = 'THECAFETERIA';
        break;
      case 1254:
        placholderKey = 'Pharmacy';
        this.canBeCached = false;
        break;
      case 1252:
        placholderKey = 'Store';
        this.canBeCached = false;
        break;
      case 1253:
        placholderKey = 'group';
        break;

      case 1262:
        placholderKey = 'EXPECTEDSERVICEPATIENT';
        break;
      case 1298:
        placholderKey = 'BRANCHESPARM';
        break;

      case 1272:
        placholderKey = 'BABYPATCODE';
        this.canBeCached = false;
        break;
      case 1274:
        placholderKey = 'HRRESIDENCESTP';
        this.canBeCached = false;
        break;
      case 1276:
        placholderKey = 'OFFICIALVAC';
        this.canBeCached = false;
        break;
      case 1281:
        placholderKey = 'MANAGMENT';
        this.canBeCached = false;
        break;
      case 268:
        placholderKey = 'PriceList';
        break;
      case 322:
        placholderKey = 'DISPLAYUNITS';
        break;
      case 325:
        placholderKey = 'DISORADD';
        break;
      case 326:
        placholderKey = 'GENDER';
        break;
      case 330:
        placholderKey = 'BLOODEXAMINATIONRESULT';
        break;
      // ITEMPLACE
      case 360:
        placholderKey = 'TypeShow';
        break;
      case 399:
        placholderKey = 'EVALUATIONTERMTYPE';
        break;
      case 364:
        placholderKey = 'NUTIRATIONTYPE';
        break;
      case 366:
        placholderKey = 'EXCHANGESTATUS';
        break;
      case 363:
        placholderKey = 'COSTCENTERDEFAULT';
        break;
      case 361:
        placholderKey = 'BARCODETYPE';
        break;
      case 378:
        placholderKey = 'Religion';
        break;
      case 1282:
        placholderKey = 'EVALUATIONTERMS';
        break;
      case 1284:
        placholderKey = 'Store';
        break;
      case 1285:
        placholderKey = 'ITEMNAME';
        break;
      case 1287:
        placholderKey = 'SUPPLIER';
        break;
      case 1286:
        placholderKey = 'ITEMNAME';
        break;
      case 1309:
        placholderKey = 'reson';
        break;
      case 1313:
        placholderKey = 'DEALS';
        break;

      case 1314:
        placholderKey = 'ADDMISSION';
        break;
      case 1316:
        placholderKey = 'CCHI_CODE';
        break;

      case 1320:
        placholderKey = 'CURVIES';
        break;
      case 1246:
        placholderKey = 'BANKACCOUNTNUMBER';
        break;
      case 455:
        placholderKey = 'COMPANYITEMTYPE';
        break;
      case 476:
        placholderKey = 'COMPATIBILITY';
        break;
      case 1326:
        placholderKey = 'CshVisaCardsType';
        break;
      case 39:
        placholderKey = 'RECEIPTTYPE';
        break;
      case 1188:
        placholderKey = 'SUPPLIERGROUP';
        break;
      case 518:
        placholderKey = 'BILLTYPES';
        break;
      case 549:
        placholderKey = 'FinishStatus';
        break;
      case 521:
        placholderKey = 'CLAIMREPORTTYPE';
        break;
      case 529:
        placholderKey = 'SUMMATIONBY';
        break;
      case 1207:
        placholderKey = 'BENEFICIARYSTORE';
        break;
      case 1428:
        placholderKey = 'MAINSTORE';
        break;
      case 533:
        placholderKey = 'UNITDESCRIPTION';
        break;
      case 541:
        placholderKey = 'HIDEONEXCELENHANCE';
        break;
      case 542:
        placholderKey = 'OPERATIONPRICINGWAY';
        break;
      case 543:
        placholderKey = 'CODEPRINTTYPE';
        break;
      case 544:
        placholderKey = 'QRCODEPRINTSIZE';
        break;
      case 557:
        placholderKey = 'CAMPAIGNTYPE';
        break;
      case 560:
        placholderKey = 'DISCOUNTTYPE';
        break;
      case 1434:
        placholderKey = 'CLIENT';
        break;
      case 1437:
        placholderKey = 'CLIENTSTYPE';
        break;
      case 1438:
        placholderKey = 'CLIENTSGROUP';
        break;
      case 1443:
        placholderKey = 'TASKCLASSIFICATION';
        break;
      case 1444:
        placholderKey = 'CAMPAIGNNAME';
        break;
      case 1445:
        placholderKey = 'TASKCLASSIFICATIONSTAGE';
        break;
      case 1446:
        placholderKey = 'MARKLEADSTYPES';
        break;
      case 1449:
        placholderKey = 'COMPLAINTCLASSIFICATION';
        break;
      case 567:
        placholderKey = 'COMPLAINTSTATUS';
        break;
      case 579:
        placholderKey = 'REQTYPE';
        break;
      default:
        break;

    }
    if (this.customPlaceHolder) {
      placholderKey = this.customPlaceHolder;
    }
    let _options = new Options({
      valueField: 'code',
      labelField: 'nameEn',
      labelFieldAr: 'nameAr',
      searchFields: ['code', 'nameEn', 'nameAr'],
      placholderKey: placholderKey
    });

    return _options;
  }
  /**
   * used to create observable in input search
   */
  restPaging() {
    this._first = 1;
    this._nextNo = this.rows;
    this.globalFastSearchObj.FromRow = 1;
    this.globalFastSearchObj.ToRow = this.rows;
  }
  createObservableSearch() {
    if (this.serviceObject) {
      this.searchInputSubscribe = this.searchInputControl.valueChanges.pipe(
        debounceTime(400),
        switchMap(val => {
          this.restPaging();
          return this.callService(val, false, false);
        }))
        .subscribe(
          (item: any) => {
            this.handelCallServiceReturn(item);
          },
          err => console.error('from selectize ', err),
          () => { }
        );
    }
  }

  /**-------------------------------------------------------
   * call if you need to get data from server in init
   */
  initalizeData(val: string) {

    if (val == undefined || val == null) val = '';
    this.globalFastSearchObj.SearchData = val;
    this.getCachedResult();

    if (this.selectizeOptions.currentResults.length == 0 || this.searchOnServerWithNoFilter) {
      this.callServiceToAssignVal(val);
    }
    else {
      if (
        this.globalFastSearchObj.SearchData != '' &&
        this.selectizeOptions.items && this.selectizeOptions.items.length > 0
      ) {
        const CodeOrCustom = this.CodeOrCustomCode();
        let filtered = this._selectizeService.filter(
          this.globalFastSearchObj.SearchData,
          CodeOrCustom,
          this.selectizeOptions.items,
          true
        );

        if (filtered.length == 1) {
          this.assignSelectedItem(filtered[0], false, true);
        }
        if (filtered.length == 0) {
          this.callServiceToAssignVal(val);
        }
      }
    }
  }
  CodeOrCustomCode(): string[] {
    if (this.globalFastSearchObj && this.globalFastSearchObj.objDynamic && this.globalFastSearchObj.objDynamic['writeValueSearch']) {
      return ['code'];
    }
    if (this.selectizeOptions.items && this.selectizeOptions.items.length > 0) {
      const CodeOrCustom = this.selectizeOptions.items[0]['customCode'] != undefined ? ['customCode'] : ['code'];
      return CodeOrCustom;
    } else

      return ['code'];
  }
  findInCach(value) {
    const _key = this._selectizeService.getCachKey(this.getFastSearchKey());
    return this._selectizeService.findInCach(_key, value);
  }
  getCachedResult() {
    if (!this.canBeCached) {
      return [];
    }
    const _key = this._selectizeService.getCachKey(this.getFastSearchKey());
    let filtered = this._selectizeService.getCachedResult(_key);
    this.selectizeOptions.currentResults = this.selectizeOptions.items = filtered;
  }
  handelCallServiceReturn(item) {
    let _data: any = [];
    if (item && item.data != undefined) {
      _data = item.data;
      _data = this.exclusion(_data);

      this.selectizeOptions.items = this.serviceObject.mergeNewItems(
        item.data,
        this.selectizeOptions.items
      );
    } else if (item) {
      _data = item;
      _data = this.exclusion(_data);
      this.selectizeOptions.items = this.serviceObject.mergeNewItems(
        item,
        this.selectizeOptions.items
      );
    }
    if (item && item.data1) {
      this.addtionalFilterKeys = item.data1;
    }

    this.selectizeOptions.currentResults = _data;
    /// #ibrahim __________________________________________
    if (this.selectizeOptions.currentResults && this.selectizeOptions.currentResults.length > 0)
      this.totalRecords(this.selectizeOptions.currentResults[0]['rowsCount']);
    //_____________________________________________________
    if (this.selectizeOptions.currentResults == undefined) {
      this.selectizeOptions.currentResults = [];
    }

    //abdo
    // if (this.serviceObject.appCode == 1078 && this.selectizeOptions.currentResults.length > 0) {
    //   // this.appcodeForConcat=1247;
    //   this.searchInputControl.setValue(
    //     this.translate.currentLang == 'ar'
    //       ? this.multiItems[0]['nameAr']
    //       : this.multiItems[0]['nameEn'],
    //     { emitEvent: false }
    //   );
    //   console.log(this.multiItems)
    // }

    if ((!this.isFocused) || (this.workAsBarcode && this.selectizeOptions.currentResults.length == 1 && this.inputElement.nativeElement.value != '')) {

      this.selectIfOneTime();
    }

    else if (this.selectTopOne && this.selectizeOptions.currentResults.length == 1) {
      this.searchInputControl.setValue(
        this.translate.currentLang == 'ar'
          ? this.selectizeOptions.selected[this.selectizeOptions.labelFieldAr]
          : this.selectizeOptions.selected[this.selectizeOptions.labelField],
        { emitEvent: false }
      );
    }



    if (_data.length <= 0 && (this.addNewItem == 1 || this.addNewItem == 2)) {
      this.selectizeOptions.currentResults = [{
        code: null,
        nameAr: this.newItemValue,
        nameEn: this.newItemValue
      }];
    }
  }
  /**
   * used to show  all option without filter
   */
  unfilter() {
    if (this.selectizeOptions.currentResults && this.selectizeOptions.items) {
      this.selectizeOptions.currentResults = this.selectizeOptions.items;
    }
  }
  exclusion(_data: any[]) {
    if (this.excludedCodes) {
      let exclusionArr = this.excludedCodes.split(',');
      exclusionArr.forEach(a => {
        let indx = _data.findIndex(x => x.code == a);
        if (indx != -1) {
          _data.splice(indx, 1);
        }
      });
    }
    return _data;
  }
  selectIfOneTime() {
    if (
      (this.selectizeOptions.currentResults &&
        this.selectizeOptions.currentResults.length == 1 &&
        this.selectizeOptions.selected == null)
    ) {
      if (this.workAsBarcode ||
        (this.searchInputControl.value ==
          this.selectizeOptions.currentResults[0].code)
        ||
        (this.searchInputControl.value ==
          this.selectizeOptions.currentResults[0].customCode)
      ) {
        this.select(this.selectizeOptions.currentResults[0]);
        if (this.workAsBarcode) {
          this.emitSelectedItems();
        }
      }
    }

  }
  /**--------------------------------------------------------------
   * used to call data and assign val
   * @param value code value
   */
  callServiceToAssignVal(val) {
    this.callService(val, true, false).subscribe((item: any) => {

      this.handelCallServiceReturn(item);

      if (
        this.globalFastSearchObj.SearchData != '' &&
        this.selectizeOptions.items &&
        this.selectizeOptions.items.length > 0
      ) {
        const CodeOrCustom = this.CodeOrCustomCode();
        let filtered = this._selectizeService.filter(
          this.globalFastSearchObj.SearchData,
          CodeOrCustom,
          this.selectizeOptions.items,
          true
        );
        // eng reda

        if (this.selectizeData == true) { this._userSessionService.setSessionKey("itemData", this.selectizeOptions.items); }
        this.selectizeOptions.items = [];
        if (filtered.length == 1) {
          this.assignSelectedItem(filtered[0], false, true);
        }

        this.unfilter();
      }
      else {
        ///_____________________________gouhar_________________________________//
        this.clear();
      }
    },
    );
  }
  /**--------------------------------------------------------------
   * used to invoke function from service object
   * @param value form input search
   */

  callService(val: any, searchCodeOnly: boolean, forceRefresh: boolean): Observable<any> {
    let searchFields = this.selectizeOptions.searchFields;
    let searchExact = false;
    let recallServer = false;
    if (searchCodeOnly) {
      searchFields = ['code'];
      searchExact = true;
    }
    var searchTextLength = 0;
    if (val != undefined) {
      if (this.oldSearchKeys.filter(e => e == val).length == 0) {
        this.oldSearchKeys.push(val);
        recallServer = true;
      }
      searchTextLength = val.length;
    }

    if (this.serviceObject) {
      // check to prevent  send two request to server
      if (this.selectizeOptions) {
        if (this.selectizeOptions.items) {
          if (this.selectizeOptions.items.length > 0) {
            if (!searchExact) {
              const CodeOrCustom = this.CodeOrCustomCode();
              searchFields[0] = CodeOrCustom[0];
            }
            const filtered = this._selectizeService.filter(
              val,
              searchFields,
              this.selectizeOptions.items,
              searchExact
            );
            // filtered = this.addtionalFilter(filtered);
            if (filtered.length > 0 && !recallServer && !forceRefresh && !this.forceRefreshEverySearch) {
              return observableOf(filtered);
            }
          }
        }
      }
      //---------------gouhar--------------------------/
      this.paginatorParmsToGlobalFastSearchObj(val, searchExact);
      return this._selectizeService.fastSearch(this.getFastSearchKey());
    }
  }
  paginatorParmsToGlobalFastSearchObj(val: string, searchExact) {

    if (this.paginator) {
      if (this.globalFastSearchObj.FromRow <= 0) {
        this.globalFastSearchObj.FromRow = 1;
        this.globalFastSearchObj.ToRow = this.globalFastSearchObj.FromRow + this.rows;
      }
      if (this.globalFastSearchObj.ToRow - this.globalFastSearchObj.ToRow > this.rows) {
        this.globalFastSearchObj.ToRow = this.globalFastSearchObj.FromRow + this.rows;
      }
    }
    this.globalFastSearchObj.SearchData = val;
    this.setFastSearchKey('writeValueSearch', searchExact ? 1 : 0);

  }
  addtionalFilter(data: any[]) {
    if (this.globalFastSearchObj.objDynamic) {
      data = this._selectizeService.addtionalFilter(
        this.globalFastSearchObj.objDynamic,
        this.addtionalFilterKeys,
        data
      );
    }
    return data;
  }
  filterCurrentItemsBySearchKeys() {
    if (this.selectizeOptions && this.selectizeOptions.currentResults) {
      this.selectizeOptions.currentResults = this.addtionalFilter(
        this.selectizeOptions.currentResults
      );
    }
  }
  /**--------------------------------------------------------------
   * used to create new object of FastSearch  interface
   * @param searchText form input search
   */
  createSearchObject(searchText: string) {
    this.globalFastSearchObj.SearchData = searchText;
    this.globalFastSearchObj.AppCode = this.appcode;
    return this.globalFastSearchObj;
  }
  /**--------------------------------------------------------------
   * used to set value for key in fast search object
   * @param key name for key that wull be set
   * @param value value will bet set to key
   */
  setFastSearchKey(key: string, value: any) {
    this.setFastSearchObjDynamicKey(key, value);
  }

  /**
   * used to add seach kay to stored procdure
   * @param key name of key want to add to search cariteria
   * @param value value of key
   */
  setFastSearchObjDynamicKey(key: string, value: any) {

    if (!this.globalFastSearchObj.objDynamic) {
      this.globalFastSearchObj.objDynamic = <any>{};
      this.globalFastSearchObj.objDynamic[key] = value;
    } else {
      this.globalFastSearchObj.objDynamic[key] = value;
    }
  }


  /**
   * used to remove key form search object
   * @param key name of key wanted to remove from search
   */
  removeFastSearchObjDynamicKey(key: string) {
    if (this.globalFastSearchObj.objDynamic) {
      if (this.globalFastSearchObj.objDynamic[key]) {
        delete this.globalFastSearchObj.objDynamic[key];
      }
    }
  }
  /**--------------------------------------------------------------
   * used to set value for key in fast search object
   */
  getFastSearchKey() {
    return this.globalFastSearchObj;
  }
  //*********************************************************************************************
  searchChanged(event: any) { }

  /*****************************************************************
   * event fired after user select element from item list
   * @param selecetdItem
   */
  select(selecetdItems: any) {
    if (this.multi) {
      if (selecetdItems) {
        this.assignMultiSelectedItem(selecetdItems, true, false);
        this.value = this.multiCodesString;
        this.propagateChange(this.multiCodesString);
      }
    } else {
      if (selecetdItems.code >= 0 || selecetdItems.code < 0) {
        this.assignSelectedItem(selecetdItems, false, false);

        this.toggleDropdown = false;
        // remove subscribtion and subscribe again
        this.reCreateObservable();
      }
      this.value = selecetdItems.code;
      this.propagateChange(selecetdItems.code);
    }
    if (selecetdItems.code == null && (this.addNewItem == 1 || this.addNewItem == 2)) {
      let newItem = {
        code: 0,
        nameAr: selecetdItems.nameAr,
        nameEn: selecetdItems.nameEn,
        Type: selecetdItems.type,
        appCode: this.appcode
      }
      if (this.addNewItem == 1) {
        this._addItemHelper.addItem(newItem);
      } else {
        this.onAddNewItem.emit(newItem);
      }

    }
  }
  newItemData$() {
    this._userSessionService.getSessionKey$('NewItemData' + this.appcode)
      .subscribe((keys: any) => {
        let NewItemData: any = {};
        if (keys.value) {
          this.clear();
          this.clearItems();
          NewItemData = keys.value;
          if (this.appcode == NewItemData.appCode) {

            this.assignSelectedItem(NewItemData, false, false);
            this.toggleDropdown = false;

            this.reCreateObservable();
            this.value = NewItemData.code;
            this.propagateChange(NewItemData.code);
            this._userSessionService.setSessionKey('NewItemData' + this.appcode, {}, false);
          }
        }
      });
  }
  emitSelectedItems() {
    this.toggleDropdown = false;
    // remove subscribtion and subscribe again
    this.reCreateObservable();

    let _items = [];
    this.multiItems.forEach(x => {
      _items.push(Object.assign({}, x));
      x['highLightedForMulti'] = false;
    });

    this.addSelected.emit(_items);

    this.inputElement.nativeElement.select();
    if (this.workAsBarcode) {
      this.searchInputControl.setValue('');
      this.keyDownArr = [];
      this.selectizeOptions.currentResults = [];
    }
    this.toggleDropdown = false;
    this.inputElement.nativeElement.blur();
  }
  deleteMltiItems() {

    this.multiItems = [];
    this.addSelected.emit(this.multiItems);
  }
  assignSelectedItem(selecetdItem: any, silent: boolean, AutoEmited: boolean) {
    if (selecetdItem) {
      this.selectizeOptions.selected = selecetdItem;
      this.searchInputControl.setValue(
        this.translate.currentLang == 'ar'
          ? this.selectizeOptions.selected[this.selectizeOptions.labelFieldAr]
          : this.selectizeOptions.selected[this.selectizeOptions.labelField],
        { emitEvent: false }
      );
      if (!silent) {
        selecetdItem['AutoEmited'] = AutoEmited;
        this.clicked.emit(selecetdItem);
        this.itemSelected.emit(selecetdItem);
      }
    }
    this.unfilter();
  }

  assignMultiSelectedItem(
    selecetdItems: any,
    silent: boolean,
    AutoEmited: boolean
  ) {
    if (selecetdItems) {
      let indx = this.multiItems.findIndex(x => x.code === selecetdItems.code);
      if (indx != -1) {
        this.multiItems.splice(indx, 1);
        selecetdItems['highLightedForMulti'] = false;
      } else {
        selecetdItems['highLightedForMulti'] = true;
        this.multiItems.push(selecetdItems);
      }
      let x = [];
      this.multiItems.forEach(a => {
        x.push(a['code']);
      });
      this.multiCodesString = x.join(',');

      if (!silent) {
        selecetdItems['AutoEmited'] = AutoEmited;
        this.addSelected.emit(selecetdItems);
      }
      this.inputElement.nativeElement.select();
    }
  }
  removeObservable() {
    if (this.searchInputSubscribe) {
      this.searchInputSubscribe.unsubscribe();
    }
  }
  /**
   * used to remove subscribtion and subscribe again
   */
  reCreateObservable() {
    if (this.searchInputSubscribe) {
      this.searchInputSubscribe.unsubscribe();
      setTimeout(() => this.createObservableSearch(), 10);
    }
  }

  /**************************************
   *
   */
  setControlValue() {
    if (this.selectizeOptions.selected) {
      this.searchInputControl.setValue(
        this.translate.currentLang == 'ar'
          ? this.selectizeOptions.selected[this.selectizeOptions.labelFieldAr]
          : this.selectizeOptions.selected[this.selectizeOptions.labelField],
        { emitEvent: false }
      );
    }
  }
  /**************************************
   *
   */
  setFormControl(labelFieldAr: any, labelFieldEn: any) {
    this.searchInputControl.setValue(
      this.translate.currentLang == 'ar' ? labelFieldAr : labelFieldEn
    );
    this.innerText.valueAr = labelFieldAr;
    this.innerText.valueEn = labelFieldEn;
  }

  /*********************************************************
   * call when dev need to update selected value of selectize from code behind (ts)
   */
  updateSelected(): boolean {
    if (this.selectizeOptions.hasOptions) {
      this.selectizeOptions.selected = this.selectizeOptions.items.find(
        it => it[this.selectizeOptions.valueField] == this.innerValue
      );
      this.setControlValue();
    }
    if (this.selectizeOptions.selected == undefined) return false;
    return true;
  }
  /*
     * clear selected items in the selectize
     */
  clear(autoEmited?: boolean) {
    if (this.selectizeOptions) this.selectizeOptions.selected = null;
    this.searchInputControl.setValue('', { emitEvent: false });
    this.propagateChange(null);
    this.innerValue = null;
    this.clicked.emit(null);
    if (autoEmited == undefined) autoEmited = false;
    this.itemSelected.emit({ AutoEmited: autoEmited, Clear: true });
    this.multiItems = [];
  }


  clearItems() {
    if (this.selectizeOptions) {
      if (this.selectizeOptions.items) {
        this.selectizeOptions.items = [];
      }
      if (this.selectizeOptions.currentResults) {
        this.selectizeOptions.currentResults = [];
      }
    }
  }

  /*
    * add new items to  items in the selectize
    */
  addItems(nItems: any) {
    let newItems = [];
    if (typeof nItems === 'object' && nItems.length == undefined)
      newItems.push(nItems);
    else if (typeof nItems === 'object' && nItems.length > 0) newItems = nItems;

    this.selectizeOptions.items = this.selectizeOptions.currentResults = this._selectizeService.mergeNewItems(
      newItems,
      this.selectizeOptions.items
    );
  }

  addOptions(items: any[], selectizeOptionInstance: any): void {
    if (items != null) {
      selectizeOptionInstance.currentResults = selectizeOptionInstance.items = items;
    }
  }

  // used for arrow navigation
  setAdjacentOption(direction: number) {

    let _options = this.selectizeOptions.currentResults;
    var index = this.highLightedOptionInedx + direction;

    if (index >= 0 && index < _options.length) {
      this.highLightedOptionInedx = index;
      this.highLightedOption =
        _options[index][this.selectizeOptions.valueField];
    }
  }

  //----------------------
  onBlur() {
    this.isFocused = false;
    this.toggleDropdown = false;
    this.onFocusClasses = '';
  }
  onInputBlur() {
    if (!this.multi)
      this.selectIfOneTime();
  }
  newItemValue = '';
  onEnter(value: string) { this.newItemValue = value; }
  onFocus(val: string) {
    // localStorage.clear();
    if (this.selectizeOptions.items) {
      this.selectizeOptions.currentResults = this.selectizeOptions.items;
      //this.filterCurrentItemsBySearchKeys();
    }
    if (
      this.searchOnFocus &&
      (this.oldSearchKeys.filter(e => e == '').length == 0 ||
        this.selectizeOptions.currentResults.length == 0)
    ) {
      this.initalizeData(val);
    }
    this.isFocused = true;
    this.toggleDropdown = true;
    // this.onFocusClasses = 'selectize-absolute';  edited by abood
  }

  onMouseHover(e: any) {
    //console.log("onMouseHover", e);
  }

  onlabelClick() {
    if (this.toggleDropdown) {
      this.toggleDropdown = false;
    }
  }
  //#region input events
  onKeydown(event) {
    this.keydown.emit(event);
    this.hotkeys(event);
  }
  onChange(event) {
    this.change.emit(event);
  }

  //#endregion
  ///-----------------start of pagination -------------------- #ibrahim
  @Input()
  pageLinkSize: number = 3;///----------visiblePages-------- #ibrahim max size of buttton show it can be as Input 

  @Input()
  paginator: boolean = false;

  @Input()
  rowsPerPageOptions: number[] = [5, 10, 20, 50, 100, 500]; // input from selectize

  public pageLinks: number[];  ///  arr of  visiblePages

  public _totalRecords: number = 0;  /// rowsCount returns of data base
  public _nextNo: number = 0; /// 
  public _prevNo: number = 0; /// 

  public _first: number = 0; /// start from zerp by deafult

  public _rows: number; // input from selectize /// عاوز كام بعد ال first
  hoveredItem;

  /// ____________________ function to get total records and RowsCount ____________________
  totalRecords(val: number) {
    // edit
    this._totalRecords = val;
    this.updatePageLinks();
  }

  @Input()
  get first(): number {
    return this._first;
  }

  set first(val: number) {
    this._first = val;
    this.updatePageLinks();
  }

  @Input()
  get rows(): number {
    return this._rows;
  }

  set rows(val: number) {
    this._rows = val;
    this.updatePageLinks();
  }

  isFirstPage() {

    return this.getPage() === 0;
  }

  isLastPage() {

    return this.getPage() === this.getPageCount() - 1;
  }

  getPageCount() {

    return Math.ceil(this._totalRecords / this.rows) || 1;
  }
  //________ 
  calculatePageLinkBoundaries() {

    let numberOfPages = this.getPageCount(),
      visiblePages = Math.min(this.pageLinkSize, numberOfPages);

    //calculate range, keep current in middle if necessary
    let start = Math.max(0, Math.ceil(this.getPage() - visiblePages / 2)),
      end = Math.min(numberOfPages - 1, start + visiblePages - 1);

    //check when approaching to last page
    var delta = this.pageLinkSize - (end - start + 1);
    start = Math.max(0, start - delta);

    return [start, end];
  }
  //________ function to get count of pages ____________________________________
  updatePageLinks() {

    this.pageLinks = [];
    let boundaries = this.calculatePageLinkBoundaries(),
      start = boundaries[0],
      end = boundaries[1];

    for (let i = start; i <= end; i++) {
      this.pageLinks.push(i + 1);
    }
  }
  lastPageIndex: number;
  changePage(p: number, event, type) {

    this.first = this.rows * p;
    if (type == "specificPageNo") {

      if (p >= 0) {
        const state = {
          page: p,
          FromRow: this.rows * p,
          ToRow: this.rows + this.rows * p
        };
        //set general object ..
        this.globalFastSearchObj.FromRow = state.FromRow;
        this.globalFastSearchObj.ToRow = state.ToRow;
        // reset array
        this.selectizeOptions.currentResults = this.selectizeOptions.items = [];
        // get new data by new offsit and pageSize

        /// set next  +1
        this._nextNo = this._nextNo + 1;
        this.lastPageIndex = this._nextNo;
      }
    }

    //...........................................................................
    else if (type == "next") {
      const state = {
        FromRow: this.rows * (this._nextNo + 1),
        ToRow: this.rows + this.rows * (this._nextNo + 1)
      };
      //set general object ..
      this.globalFastSearchObj.FromRow = state.FromRow;
      this.globalFastSearchObj.ToRow = state.ToRow;
      // reset array
      this.selectizeOptions.currentResults = this.selectizeOptions.items = [];
      //__________refreshing data of new offsite and page size _______

      /// set next  +1
      this._nextNo = this._nextNo + 1;
      this.lastPageIndex = this._nextNo;
    }
    //...........................................................................

    else if (type == "firstPage") {
      const state = {
        FromRow: 1,
        ToRow: this.rows
      };
      this.globalFastSearchObj.FromRow = state.FromRow;
      this.globalFastSearchObj.ToRow = state.ToRow;

      this.selectizeOptions.currentResults = this.selectizeOptions.items = [];
      //__________refreshing data of new offsite and page size _______

      this._nextNo = 0;
    }
    else if (type == "prev" && this._nextNo > 0) {

      this._nextNo = this._nextNo - 1

      const state = {
        FromRow: this.rows * (this._nextNo),
        ToRow: this.rows + this.rows * (this._nextNo)
      };

      if (state.FromRow == 0)
        state.FromRow = 1
      this.globalFastSearchObj.FromRow = state.FromRow;
      this.globalFastSearchObj.ToRow = state.ToRow;
      this.selectizeOptions.currentResults = this.selectizeOptions.items = [];

    }
    else if (type == "lastPage") {
      //------- function to get start page and end page-- #ibrahim

      const state = {
        FromRow: this._totalRecords - this.rows,
        ToRow: this._totalRecords
      };
      this.globalFastSearchObj.FromRow = state.FromRow;
      this.globalFastSearchObj.ToRow = state.ToRow;
      this.selectizeOptions.currentResults = this.selectizeOptions.items = [];

    }
    else if (type == 'refresh') {


    }

    //this.onFocus(this.searchInputControl.value);
    if (event) {
      event.preventDefault();
    }
    // ---- prob to open selectize ------------
    this.callService(this.searchInputControl.value, false, type == 'refresh' ? true : false).subscribe(
      (item: any) => {
        this.handelCallServiceReturn(item);
      },
      err => console.error('from selectize ', err),
      () => { }
    );

    this.toggleDropdown = true;

    setTimeout(() => {
      if (this.selectizeOptions.currentResults && this.selectizeOptions.currentResults.length > 0)
        this.totalRecords(this.selectizeOptions.currentResults[0]['rowsCount']);
    }, 2000);
  }

  getPage(): number {

    return Math.floor(this.first / this.rows);
  }

  changePageToFirst(event) {
    // ------------ first page
    this.changePage(0, event, "firstPage");
  }

  changePageToPrev(event) {
    this.changePage(this.getPage() - 1, event, "prev");
  }

  changePageToNext(event) {

    this.changePage(this.getPage() + 1, event, "next");
  }

  changePageToLast(event) {

    this.changePage(this.getPageCount() - 1, event, "lastPage");
  }

  onRppChange(event) {

    this.rows = this.rowsPerPageOptions[event.target.selectedIndex];
    this.changePageToFirst(event);
    this.cachPreferredPageSize();

  }
  cachPreferredPageSize() {
    this._selectizeService.cachPreferredPageSize(this.appcode, this.rows);
  }
  getPreferredPageSize() {
    this.rows = this._selectizeService.getPreferredPageSize(this.appcode);
  }
  refreshCurrent() {
    this.changePage(this.getPage(), event, "refresh");

  }

  ///-----------------end of pagination --------------------
}

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, IconActionModule, TranslateModule.forChild()],
  providers: [StorageService],
  declarations: [SelectizeComponent],
  exports: [SelectizeComponent]
})
export class SelectizeModule { }
