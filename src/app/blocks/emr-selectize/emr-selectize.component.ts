import { Component, OnInit, forwardRef, Input, EventEmitter, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { SelectizeService } from '../selectize/selectize.service';
import { TranslateService } from '@ngx-translate/core';
import { noop } from 'rxjs';

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => EmrSelectizeComponent),
  multi: true
};

@Component({
  selector: 'emr-selectize',
  templateUrl: './emr-selectize.component.html',
  styleUrls: ['./emr-selectize.component.css'],
  providers: [SelectizeService, CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})

export class EmrSelectizeComponent implements OnInit, ControlValueAccessor {
  // appcode ===> 1289
  @Input() lookupCode: number;
  @Input() displayFlex  : number;

  @Input () inputGrid : number ;
  @Input() AppCode: number;
  @Input() FastSearchKeys;
  @Input() compType: 'select' | 'checkbox' | 'checkboxFlex' = 'checkbox';
  innerValue = 0;
  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;
  options: any[] = [];
  @Output()
  private emitLookupCodeWithValue: EventEmitter<any> = new EventEmitter<any>();
  constructor(public translate: TranslateService, private selectizeservice: SelectizeService) { }

  ngOnInit() {
    // console.log('lookupCode', this.lookupCode);
    this.getEmrLookupData();
  }
  get value(): number {
    return this.innerValue;
  };

  //set accessor including call the onchange callback
  set value(v: number) {
    if (v !== this.innerValue) {
      this.innerValue = +v;
      this.onChangeCallback(v);
    }
  }
  // private value = 0;

  writeValue(value: number): void {
    this.value = value;
    this.getEmrLookupData();
  }

  getEmrLookupData() { 
    
    this.selectizeservice
      .getEmrLookupData(this.lookupCode)
      .subscribe((res: any) => {
        this.options = res ? res : [];
        this.options.sort((a, b) => a.sort - b.sort);
      });
  }

  registerOnChange(fn: (_: any) => void): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: any): void {
  }
  onChange(value: any) {
    this.value = value
    this.registerOnChange(value);
    this.writeValue(value)
  }

  selectItem(value: number) {
    this.value = +value;
    this.onChangeFn(this.value);
    this.emitLookupCodeWithValue.emit({lookupCode:this.lookupCode,value:this.value})
  }

  onChangeFn = (_: any) => { };


  getCSSClasses() {
    let cssClasses;
    if (this.displayFlex == 1) {
      cssClasses = {
        'd-flex flex-wrap justify-content-around flex-row mb-3': true,
        'btn-success': false,
        'btn-danger': false
      }
    } else if (this.displayFlex ==2) {
      cssClasses = {
        'd-flex flex-wrap justify-content-between flex-row mb-3': true,
        'btn-success': false,
        'btn-danger': false
      }
    }
    else if (this.displayFlex ==3) {
      cssClasses = {
        'd-flex  flex-wrap justify-content-between flex-row mb-3': true,
        'btn-success': false,
        'btn-danger': false
      }
    }
    else if (this.displayFlex ==4) {
      cssClasses = {
        'd-flex flex-row   flex-wrap justify-content-start  mb-3': true,
        'btn-success': false,
        'btn-danger': false
      }
    }

    else if (this.displayFlex ==4) {
      cssClasses = {
        'd-flex flex-column   flex-wrap justify-content-start  mb-3': true,
        'btn-success': false,
        'btn-danger': false
      }
    }
    else if (this.displayFlex ==4) {
      cssClasses = {
        'd-flex flex-column   flex-wrap justify-content-start  mb-3': true,
        'btn-success': false,
        'btn-danger': false
      }
    }
    
    else {
      cssClasses = {
        'btn-info': false,
        'btn-success': false,
        'btn-danger': false
      }
    }
    return cssClasses;
  }

}
