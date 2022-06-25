
import { Component, EventEmitter, Output, Input, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { IdentityTypeService, IdentityTypes } from './identity_type.service';
import { isNumber } from '../../shared/utility';
//services

@Component({
  selector: 'identity-component',
  templateUrl: './identity_type.component.html',
  styles: [`

      .placeholder input{
        width: calc(100% - 30px);
      }

    `]

})

export class IdentityTypeComponent implements OnInit {

  //define variables
  identityTypes: any[] = [
  { 'code': 2, 'nameAr': 'رقم الجواز', 'nameEn': 'Passport Number' },
  { 'code': 3, 'nameAr': 'الهوية الوطنية', 'nameEn': 'Nationalty  Identity' },
  { 'code': 4, 'nameAr': 'رقم الاقامة', 'nameEn': 'Residence Number' }
  ];
  havingIdentityValue: boolean = true;
  invalidMessage: string = "";
  identityType: number;
  invaildvalue: boolean = false;
  //valueFormated: string = "0000000DDMMYY0"; 
  valueFormated: string = "#-YYMMDD-##-##-##-#";


  //---------------------------------------------------------------------------------------------------------------------------
  identityForm: FormGroup;
  //---------------------------------------------------------------------------------------------------------------------------

  @Input() smallInput: boolean = true;
  @Input() disableIdentity: boolean;
  @Input() identityTypeRegister: number;

  @Output()
  private identityValueInfoEmitted: EventEmitter<any> = new EventEmitter();

  //---------------------------------------------------------------------------------------------------------------------------

  constructor(
    private _identityTypeService: IdentityTypeService,
    public translate: TranslateService,
    private fb: FormBuilder) { }

  //---------------------------------------------------------------------------------------------------------------------------
  //---------------------------------------------------------------------------------------------------------------------------

  ngOnInit() {

    // this.getIdentityType();
    this.identityForm = this.fb.group({
      identityType: null,
      identityValue: null,
      valueFormated: this.valueFormated,
      gender: '',
      birthDate: '',
      birthPlace: ''
    });
    this.onIdentitySelected(this.identityTypeRegister)

  }

  //******************************** dropdown  of identity values *********************************************************************

  /**
   * get identity type from db
  //  */
  // getIdentityType(): void {

  //   this._identityService
  //     .getIdentities()
  //     .subscribe(identity => {
  //       this.identityTypes = identity;
  //     })
  // }

  /*************************************************************************************
   * call function when identiy type selection option changed 
   * @param number value of selected type 
   */
  onIdentitySelected(selecetdValue: number): void {
    selecetdValue = +selecetdValue ? +selecetdValue : +this.identityForm.get('identityType').value;

    this.invalidMessage = "";
    if (selecetdValue === IdentityTypes.NOTAPPLIED)
      this.havingIdentityValue = false;
    else
      this.havingIdentityValue = true;

    this.identityForm.patchValue({ identityType: selecetdValue });
    this.identityType = +selecetdValue;
    if (this.identityType == 3) {
      const identityValue = this.identityForm.get('identityValue');
      identityValue.setValidators([Validators.maxLength(10), Validators.minLength(10)]);
      identityValue.updateValueAndValidity();
    }
    if (this.identityType == 1 || this.identityType == 3) {
      if (isNaN(+this.identityForm.get('identityValue').value)) {
        this.identityForm.patchValue({ identityValue: '' });
      }
    }

  }


  onIdentityKeyup(event: any) {

    const len = event.target.value.length;
    if (len == 14)
      this.onIdentityValueBlur();

    if (this.identityType == 1) {
      let x = this.parseIden(event.target.value);
      this.identityForm.get('valueFormated').setValue(x[1]);
    }
    if (this.identityType == 3) {
      this.onIdentityValueBlur();
    }
  }
  parseIden(str: string): string[] {
    if (isNumber(str))
      this.invaildvalue = false;
    else
      this.invaildvalue = true;

    var year = '', month = '', day = '', millennium = '', birthgov = '';
    let arr1 = str.split('');
    let arr2 = this.valueFormated.split('');

    let _form1 = '';
    arr1.forEach((item, indx, arr) => {
      //---
      if (indx == 0) millennium = arr1[indx];
      //---
      if (indx == 2) year = arr1[1] + arr1[indx];
      if (indx == 4) month = arr1[3] + arr1[indx];
      if (indx == 6) day = arr1[5] + arr1[indx];
      if (indx == 8) birthgov = arr1[7] + arr1[indx];


      if (indx == 0 || indx == 6 || indx == 8 || indx == 10 || indx == 12) {
        _form1 = _form1 + item + '-';

      } else {
        _form1 = _form1 + item;
      }
    })
    arr1 = _form1.split('');
    const _formLen = arr1.length;

    let _form2 = '';
    arr2.forEach((item, indx, arr) => {
      if (indx < _formLen) {
        _form2 = _form2 + arr1[indx];
      } else {
        _form2 = _form2 + item;
      }
    })
    if (isNumber(millennium) && (+millennium > 3 || +millennium < 2))
      this.invaildvalue = true;
    if (isNumber(month) && (+month > 12 || +month == 0))
      this.invaildvalue = true;
    if (isNumber(day) && (+day > 31 || +day == 0))
      this.invaildvalue = true;
    if (isNumber(birthgov) && (this._identityTypeService.getBirthPlace(birthgov) == '0'))
      this.invaildvalue = true;


    return [_form1, _form2];

  }

  //********************* validaton in nat values  **************************************************************************
  /**
   * call after identity value (input value ) changed
   * used to get gender birth date and burth place from identity id
   */
  onIdentityValueBlur() {

    this.invalidMessage = "";
    this.invaildvalue = false;
    let type = this.identityForm.get('identityType').value;
    let value = String(this.identityForm.get('identityValue').value);

    if (type == 0) { return; }

    let result = this._identityTypeService.validateInput(value, parseInt(type));

    if (result == true && type == IdentityTypes.NATIONALID) {
      let identiyObject = this._identityTypeService.extractInformation(value, IdentityTypes.NATIONALID);

      this.identityForm.patchValue({
        gender: identiyObject.gender,
        birthDate: identiyObject.birthDate,
        birthPlace: identiyObject.birthPlace
      })
      this.identityValueInfoEmitted.emit(this._identityTypeService.extractInformation(value, IdentityTypes.NATIONALID));
    }
    if (result == false || (type == IdentityTypes.NATIONALID && value.length != 14)) {
      this.invalidMessage = "invalid";
      this.invaildvalue = true;
    }
  }


  //---------------------------------------------------------------------------------------------------------------------/
  /**
   * used to update value in identity form group
   * @param IIdentity object
   */
  updateFormGroup(identity: IIdentity) {
    this.identityForm.setValue({
      identityType: identity.identityType,
      identityValue: identity.identityValue,
      valueFormated: this.valueFormated,
      gender: identity.gender,
      birthDate: identity.birthDate.toLocaleDateString(),
      birthPlace: identity.birthPlace,
    });
    this.identityType = identity.identityType;
  }

  /**
   * used to update control of identity form, only one form control
   * @param name of form control which updated 
   * @param value new value from form control
   */
  updateFormControl(name: FormControl, value: string) {
    this.identityForm.patchValue({ name: value })
  }

  /**
   * return identity form group
   */
  getIdentityForm(): FormGroup {
    return this.identityForm;
  }
}


export interface IIdentity {
  identityType: number;
  identityValue: string;
  valueFormated: string;
  gender: number;
  birthDate: Date;
  birthPlace: string

}
