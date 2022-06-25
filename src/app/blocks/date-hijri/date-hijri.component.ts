import { Location } from '@angular/common';
import { Component, OnInit, Input, forwardRef} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { IslamicCivilI18n } from './../../ng-bootstrap/datepicker/hijri/datepicker-islamiccivil-i18n';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '../../ng-bootstrap/index';
import { FormsModule, FormControl } from '@angular/forms';
import { NgbDateStruct, NgbCalendar, NgbCalendarIslamicCivil, NgbDatepickerI18n } from '../../ng-bootstrap/index';

import { FormBuilder, FormGroup,  Validator } from '@angular/forms';

import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

const noop = () => {
};

export const DateHijri_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DateHijri),
    multi: true
};


@Component({
    selector: 'date-hijri',
    templateUrl: './date-hijri.component.html',
    providers: [{ provide: NgbCalendar, useClass: NgbCalendarIslamicCivil },
        { provide: NgbDatepickerI18n, useClass: IslamicCivilI18n },  DateHijri_VALUE_ACCESSOR]
})
export class DateHijri implements OnInit, ControlValueAccessor, Validator {
    dateHijriForm: FormGroup;

    private bDhijri: NgbDateStruct;
    editPatient: any;
    constructor(    
        private _fb: FormBuilder,  
        public translate: TranslateService,
        private _modalService: NgbModal,
        private _router: Router,
        private _route: ActivatedRoute,
        private _location: Location,  
    ) { }

    ngOnInit() {
        this.dateHijriForm = this._fb.group({
            dateHijri: ''
        });
    }
    //The internal data model

    private innerValue: any ;
    
    //Placeholders for the callbacks which are later providesd
    //by the Control Value Accessor
    private onTouchedCallback: () => void = noop;
    private onChangeCallback: (_: any) => void = noop;

    //get accessor
    get value(): any {
        return this.innerValue;
    };

    //set accessor including call the onchange callback
    set value(v: any) {
        if (v !== this.innerValue) {
            this.innerValue = v;
          
            this.onChangeCallback(v);
        }
    }

    //From ControlValueAccessor interface
    writeValue(value: any) {
        if (value !== this.innerValue) {
            this.innerValue = value;
            this.dateHijriForm.patchValue({ dateHijri: value });
        }
    }


    //From ControlValueAccessor interface
    registerOnChange(fn: any) {
        this.onChangeCallback = fn;
    }

    //From ControlValueAccessor interface
    registerOnTouched(fn: any) {
        this.onTouchedCallback = fn;
    }
    // the method set in registerOnChange to emit changes back to the form
    private propagateChange = (_: any) => { };
    // validates the form, returns null when valid else the validation object
    public validate(c: FormControl) {

        return (this.value > 0) ? null : {
            required: {
                valid: false,
            },
        };

    }


}
