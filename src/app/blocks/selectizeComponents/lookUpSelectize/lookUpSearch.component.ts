//built in libs
import {
    NgModule, Component, OnInit, ViewChild, Output, Input, EventEmitter, AfterViewInit,
    forwardRef
} from '@angular/core';
import { Observable } from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import { SharedModule } from '../../../shared/shared.module';

import { ControlValueAccessor, FormControl , NG_VALUE_ACCESSOR} from '@angular/forms';

// shared libs
import { SelectizeComponent, Options } from '../../selectize';
//services

import { LookUpsSearch } from './lookupssearch';

@Component({
    selector: 'lookUp-search',
    templateUrl: './lookUpSearch.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => LookUpSearchComponent),
            multi: true
        }
    ]
})

export class LookUpSearchComponent implements OnInit, AfterViewInit, ControlValueAccessor {
    @Input() smallInput: boolean = false;
    @Input() parentCode: number;
    @Input() lookUpName: string;
    @Input() lookUpsSearch: LookUpsSearch;
    @Input() tabindex: number;
    //******* value for 2 way binding  
    value: any;

    // fucntion var type for ControlValueAccessor
    propagateChange = (_: any) => { };


    @Output()
    private code: EventEmitter<any> = new EventEmitter();

    selectizeLookUpOptions: Options;
    lookUpList: any[] = [];
    @ViewChild('LookUpSelectize', {static: false}) selectizeLookUp: SelectizeComponent;


    constructor(
        public translate: TranslateService) {
        this.selectizeLookUpOptions = new Options({
            valueField: "code",
            labelField: "nameEn",
            labelFieldAr: "nameAr",
            searchFields: ["code", "nameEn", "nameAr"],
            placholderKey: this.lookUpName
        });
        this.lookUpsSearch = <LookUpsSearch>{}
    }

    ngOnInit() {
        this._initlizeLookUpSelectize();
    }
    ngAfterViewInit() {
        this.selectizeLookUpOptions.placholderKey = this.lookUpName;
    }


    /**
     * ********************************************************
     * from ControlValueAccessor interface call after value change and in init
     * @param k
     */
    writeValue(value: any) {
        this.value = value;
    }
    /**
     * from ControlValueAccessor interface call function after input change 
     * @param fn
     */
    registerOnChange(fn) {
        this.propagateChange = fn;
    }
    /**
     * from ControlValueAccessorinterface used to call function after input touched
     */
    registerOnTouched() {
    }
//------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------
    //dropdown for lookUp
    searchLookUpChanged(k: string): void {
        if (!this.selectizeLookUpOptions.hasOptions) {
            this._initlizeLookUpSelectize(k);
        }
    }
    _initlizeLookUpSelectize(k?: string) {
        if (this.lookUpsSearch != null) {
            let selecetdValue = <any>{
                code: this.lookUpsSearch.code,
                nameEn: this.lookUpsSearch.nameEn,
                nameAr: this.lookUpsSearch.nameAr
            };
            this.selectizeLookUpOptions.selected = selecetdValue;
        }

    //  this.getLookUpList(this.parentCode.toString()).subscribe(
    //         result => { this.lookUpList = result },
    //         erro => console.log(erro),
    //         () => {
    //             if (this.selectizeLookUp != undefined)
    //                 this.selectizeLookUp.addOptions(this.lookUpList, this.selectizeLookUpOptions);
    //         });
    }
    // getLookUpList(k?: string): Observable<any[]> {
    //     return this._lookUpDetailService.searchLookUpDetails(k);
    // }

    onLookUpClicked(selectedItem: any): void {
        this.code.emit(selectedItem.code);
    }
}


@NgModule({
    imports: [SharedModule],
    declarations: [LookUpSearchComponent],
    exports: [LookUpSearchComponent]
})
export class LookUpsSearchModule { }


