import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, FormArray } from '@angular/forms';

//services
import { AuthService } from './auth.service';
import { LoaderService } from '../ng2-loader/ng2-loader';

//custom types
import { IDefaults } from './IDefaults';
import { SharedDateService } from './date.service';

@Injectable()
export class FormSettingsService {

    controlsValidation: Object = {};
    hiddenFormControls=new Map();
    defaultValues: Array<IDefaults> = [];
    defaultUserBranch: number;
    formJsonObj: Object = {};
    // currentForm: FormGroup;
    //currentFormModel: any;

    constructor(private loaderService: LoaderService,
        private _authService: AuthService,
        private _sharedDateService: SharedDateService,
    ) {
        _authService.fetchuserInfo().subscribe(c => { if (c && c.userID) this.defaultUserBranch = c.defaultBranch });
    }

    setFormSettings(_currentForm: FormGroup, settingFileName: string, _currentFormModel: any, setDefaults?: boolean, folder?: string) {
        // this.currentFormModel = _currentFormModel;
        // this.currentForm = _currentForm;
        if (setDefaults == undefined) setDefaults = true;
        this.loaderService.getSettings(`${settingFileName}_${this.defaultUserBranch == undefined ? 1 : this.defaultUserBranch}`, folder).subscribe(
            v => {
                this.assignValidations(_currentForm, _currentFormModel, v, setDefaults, '');
                this.formJsonObj = v
            },
            error => console.log(error),
            () => {

            }
        );
    }


    getFormJsonObj() {
        return this.formJsonObj
    }

    //------------------------------------------
    stepsObj: any
    setHrJsonSettings(settingFileName: string, folder?: string) {

        this.loaderService.getSettings(`${settingFileName}_${this.defaultUserBranch == undefined ? 1 : this.defaultUserBranch}`
            , folder).subscribe(
                v => {

                    this.stepsObj = v
                },
                error => console.log(error),
                () => { }
            );
    }

    getHrJsonObj() {
        console.log(this.stepsObj)
        return this.stepsObj
    }
    //---------------------------------------------


    assignValidations(_currentForm: FormGroup, _currentFormModel: any, _controlsValidation: any, setDefaults: boolean, _ParentKey: string) {
     
        Object.keys(_currentForm.controls).forEach(key => {

            if (_currentForm.controls[key] instanceof FormArray && (<FormArray>_currentForm.controls[key]).controls) {
                for (const k in _controlsValidation) {
                    if (Object.prototype.hasOwnProperty.call(_controlsValidation, k)) {
                        const element = _controlsValidation[k];
                        for (let i = 0; i < (_currentForm.controls[key] as FormArray).controls.length; i++) {
                            const el: FormGroup = (_currentForm.controls[key] as FormArray).controls[i] as FormGroup;
                            if (el && el.controls)
                                el.controls[k].setValue(element && (element.defaultVal || element.defaultVal == 0) ? element.defaultVal : null);
                        }
                    }
                }
            } else {
                if ((<FormGroup>_currentForm.controls[key]).controls) {
                    this.assignValidations((<FormGroup>_currentForm.controls[key]), _currentFormModel, _controlsValidation, setDefaults, key);
                }
                _currentForm.controls[key].clearValidators();
                _currentForm.controls[key].setValidators(this.getValidatorsMethod(key, _controlsValidation, _ParentKey));
                if (setDefaults) {
                    _currentForm.controls[key].patchValue(this.getDefaultValue(key));
                }
                _currentForm.controls[key].updateValueAndValidity();
            }



        });
    }

    getValidatorsMethod(controlName: string, _controlsValidation: any, _ParentKey: string) {
        if (_ParentKey != '')
            _ParentKey = _ParentKey + '.';
        if (_controlsValidation.hasOwnProperty(_ParentKey + controlName)) {
            return this.getInputValidators(_controlsValidation[_ParentKey + controlName], controlName);
        }
        return null;
    }

    getInputValidators(ValidatorObject: Object, controlName: string) {

        let validationProp: Array<any> = [];

        for (var prop in ValidatorObject) {

            if (prop == 'required' && ValidatorObject[prop] == true) {
                validationProp.push(Validators.required);
            } else if (prop == 'min_length') {
                validationProp.push(Validators.minLength(ValidatorObject[prop]))
            } else if (prop == 'max_length') {
                validationProp.push(Validators.maxLength(ValidatorObject[prop]))
            } else if (prop == 'regex') {
                validationProp.push(Validators.pattern(ValidatorObject[prop]))
            } else if (prop == 'display' && ValidatorObject[prop] == false) {
                //if form control is hidden no need for validation    
                validationProp = null;
              

                this.hiddenFormControls[controlName] =1
      
                 return null;
            } else if (prop == 'defaultVal' && ValidatorObject[prop] && ValidatorObject[prop] != 'currentDate') {
                this.defaultValues.push(<IDefaults>{
                    controlName: controlName,
                    controlValue: ValidatorObject[prop]
                });
            }
            //___________________________ ASMAA ____________________________
            else if (prop == 'defaultVal' && ValidatorObject[prop] == 'currentDate') {
                ValidatorObject[prop] = this._sharedDateService.convertFromDateToNgBsObject(new Date())
                this.defaultValues.push(<IDefaults>{
                    controlName: controlName,
                    controlValue: ValidatorObject[prop]
                });
            }
            //____________________________________________________________________
        }

        if (validationProp.length > 0)
            return validationProp;
        return null;
    }

    assignValue(_currentForm: any, _currentFormModel: any) {
        Object.keys(_currentForm.controls).forEach(key => {
            _currentForm.controls[key].setValue(this.getInputValue(key, _currentFormModel));
            _currentForm.controls[key].updateValueAndValidity();
        });
    }
    getInputValue(controlName: string, _currentFormModel: any) {
        let val = _currentFormModel[controlName];
        return val;
    }

    getDefaultValue(controlName: string) {
        let val = this.defaultValues.find(x => x.controlName == controlName) != null ? this.defaultValues.find(x => x.controlName == controlName).controlValue : '';
        return val;
    }

    setRequired(_currentForm: any, _currentFormModel: any, requiredFlag: boolean, ctrls: string) {
        let ctrllist = ctrls.split(',');
        if (!requiredFlag) {
            // remove all validators from card fields
            Object.keys(_currentForm.controls).forEach(key => {
                if (ctrllist.indexOf(key) != -1) {
                    _currentForm.controls[key].setValidators(null);
                    _currentForm.controls[key].updateValueAndValidity();
                }
            });
        } else if (requiredFlag) {
            Object.keys(_currentForm.controls).forEach(key => {
                if (ctrllist.indexOf(key) != -1 && _currentFormModel[key].length > 0) {
                    _currentForm.controls[key].setValidators(_currentFormModel[key][1]);
                    _currentForm.controls[key].updateValueAndValidity();
                }
            });
        }
    }
}
