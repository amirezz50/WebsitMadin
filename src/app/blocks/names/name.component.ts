import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl} from '@angular/forms';
import {  NameService } from '../names/name.service';
import { TranslateService } from '@ngx-translate/core';
import {  UserSessionService } from '../../shared';
import { ModalService } from '../../blocks';

export interface TitleCodes {

    code: number;
    active: boolean;
    nameEn: string;
    nameAr: string;
    gender: number;

}
@Component({
    selector: 'name-component',
    templateUrl: './name.component.html',
    styles: ['.mdl-textfield__label {top: 0;}'],

})
export class NameComponent implements OnInit {
  nameForm: FormGroup;
  toggle;
    namesList: IName = <IName>{};
    names: any = [];
    @ViewChild('content', {static: false}) content: any;
    @Input() empFalge: number; 
    @Input() serachAsCall :number;

    @Input() nameAllowNumber: boolean; 
    @Input() namingTranslationSetting: number;
    @Output()
  private emitTitleCode= new EventEmitter<number>(); 
    
    patientcode: number;
     titleCodeList: TitleCodes[] = [];
    DicCode: number;
    constructor(
        private _modalService: ModalService,
        private _namesService: NameService,
        private _userSessionService: UserSessionService,
        public translate: TranslateService,
        private fb: FormBuilder

    ) {

        
    }
    /////////////find similar name +++++++++++++++++++++++++++++++++#ibrhim
    searchSameNames() {
      
        if (this.serachAsCall>0){

            this.names = [];
            this.namesList = this.getNameFromForm();
    
            this.namesList.vipLevel = this.empFalge;
            this._namesService.findSimilarCallName(this.namesList).subscribe(
                searchResult => {
                    if (searchResult.data && searchResult.data.length > 0) {
                        this.names = searchResult.data;
                    }
                }, error => console.log(error),
                () => {
                    if(this.names && this.names.length > 0)
                    this._modalService.openContent(this.content)
                });
            
        }
        else{
        this.names = [];
        this.namesList = this.getNameFromForm();

        this.namesList.vipLevel = this.empFalge;
        
        this._namesService.findSimilarName(this.namesList).subscribe(
            searchResult => {
                if (searchResult.data && searchResult.data.length > 0) {
                    this.names = searchResult.data;
                }
            }, error => console.log(error),
            () => {
                if(this.names && this.names.length > 0)
                this._modalService.openContent(this.content)
            });
        }
                 
    }
    //this._goBack();
    //_goBack(): void {
    //    this._location.back();
    //}
    getpatientdataRow(patient) {
        this._userSessionService.setSessionKey('SimilarPatData', patient);
    }

    getNameFromForm(): IName {
        //
        let name: IName = <IName>{};
        name.titleCode = this.nameForm.get('titleCode').value;
        name.fnameAr = this.nameForm.get('fnameAr').value;
        name.snameAr = this.nameForm.get('snameAr').value;
        name.tnameAr = this.nameForm.get('tnameAr').value;
        name.lnameAr = this.nameForm.get('lnameAr').value;
        name.fnameEn = this.nameForm.get('fnameEn').value;
        name.snameEn = this.nameForm.get('snameEn').value;
        name.tnameEn = this.nameForm.get('tnameEn').value;
        name.lnameEn = this.nameForm.get('lnameEn').value;
        name.vipLevel = this.empFalge;
        return name;
    }


    ngOnInit() {
        this.getTitleCode();

        this.nameForm = this.fb.group({
            titleCode: null,
            fnameAr: '',
            fnameEn: '',
            snameAr: '',
            snameEn: '',
            tnameAr: '',
            tnameEn: '',
            lnameAr: '',
            lnameEn: '',
            fullnameAr: { value: '', disabled: true },
            fullnameEn: { value: '', disabled: true },
        })
    }


    public getFullNameAr(): string {
        if (this.nameForm)
        return `${this.nameForm.get('fnameAr').value} ${this.nameForm.get('snameAr').value} ${this.nameForm.get('tnameAr').value} ${this.nameForm.get('lnameAr').value}`
    }
    public getFullNameEn(): string {
       if( this.nameForm)
        return `${this.nameForm.get('fnameEn').value} ${this.nameForm.get('snameEn').value} ${this.nameForm.get('tnameEn').value} ${this.nameForm.get('lnameEn').value}`
    }
    // ****************************** used to load title from db *****************************
    private getTitleCode() {
        // this._titlesService.getTitles()
        //     .subscribe(res => {
        //         this.titleCodeList = res.data.data;
        //     },
        //     err => console.error(err),
        //     () => this.titleCodeList = this.titleCodeList)
    }

    // ************* used to update formgroup ****************************************

    updateFormGroup(name: any) {
        this.nameForm.setValue({
            titleCode: name.titleCode ? name.titleCode : 1,
            fnameAr: name.fnameAr,
            fnameEn: name.fnameEn,
            snameAr: name.snameAr,
            snameEn: name.snameEn,
            tnameAr: name.tnameAr,
            tnameEn: name.tnameEn,
            lnameAr: name.lnameAr,
            lnameEn: name.lnameEn,
            fullnameAr: this.getFullNameAr(),
            fullnameEn: this.getFullNameEn()
        })
    }
    //used by passing an model object to get name properties from it  and return  new object of  IName
    getNameObjFromModel(MVObj: any) {
        let _name = <IName>{};
        _name.titleCode = MVObj.titleCode;
        _name.fnameAr = MVObj.fnameAr;
        _name.fnameEn = MVObj.fnameEn;
        _name.snameAr = MVObj.snameAr;
        _name.snameEn = MVObj.snameEn;
        _name.tnameAr = MVObj.tnameAr;
        _name.tnameEn = MVObj.tnameEn;
        _name.lnameAr = MVObj.lnameAr;
        _name.lnameEn = MVObj.lnameEn;
        _name.fullnameAr = this.getFullNameAr();
        _name.fullnameEn = this.getFullNameEn();
        return _name;
    }

    splitFullNameAr(_fullName: any, titleCode?: number) {
        let _name = <IName>{};
        let names = _fullName.split(' ').filter(e => e != '');
        _name.fnameAr = (names.length >= 1 ? names[0] : '');
         _name.fnameEn = this.dictionaryTranslate(_name.fnameAr, 'fnameAr').toString();
        _name.snameAr = (names.length >= 2 ? names[1] : '');
         _name.snameEn = this.dictionaryTranslate(_name.snameAr, 'snameAr').toString();
        _name.tnameAr = (names.length >= 3 ? names[2] : '');
        _name.tnameEn = this.dictionaryTranslate(_name.tnameAr, 'tnameAr').toString();
        _name.lnameAr = (names.length >= 4 ? names[3] : '');
        _name.lnameEn = this.dictionaryTranslate(_name.lnameAr, 'lnameAr').toString();
        if (titleCode)
            _name.titleCode = titleCode;

        _name.fullnameAr = this.getFullNameAr();
        _name.fullnameEn = this.getFullNameEn();
        return _name;
    }

    updateFormControl(name: FormControl, value: string) {
        this.nameForm.patchValue({ name: value })
    }

    getFormGroup(): FormGroup {
        return this.nameForm;
    }
    // navigate to the next input on Tab clicked
    handleKeyEvent(event, id: number) {
        let spName = event.target.value;
        if (spName == 'عبد' || spName == 'أبو' || spName == 'ابو' || spName == 'ابن'
            || spName == 'إبن' || spName == 'بن' || spName == 'أم' || spName == 'ام'
            || spName == 'هبة' || spName == 'هبه' || spName == 'منة' || spName == 'منه'
            || spName == 'سيد' || spName == 'حسام' || spName == 'عماد' || spName == 'بهاء'
            || spName == 'ولى' || spName == 'ولي' || spName == 'نعمة' || spName == 'نعمه'
            || spName == 'فاطمة' || spName == 'فاطمه' || spName == 'علاء' || spName == 'نور'
            || spName == 'صلاح'
        ) { 
            return true;
        }
        else {
            event.preventDefault();
            if (id != 9) {
                id = id + 1;
                document.getElementById(id.toString()).focus();
            }
        }
    }

    // get the arabic names from romans and vice versa
    dictionaryTranslate(name: string, selected: string) {
         
        if((this.namingTranslationSetting ==1 ||  this.namingTranslationSetting ==2)){
            if (name.length >= 2) {
                let _trans = localStorage.getItem(name.toLowerCase());
              
     
     
                 if (_trans != undefined) {
                     _trans = _trans.replace(';', ' ')
                     let x  = _trans.split(" ")
                     _trans = x[0]
                     this.populateValue(_trans, selected)
                     return _trans;
                 }
               
             }
        }
       else{
           return name;
       }
    }

    //populating Names
    populateValue(name: string, selected: string) {
        // populate English name from Arabic
        if (selected == 'fnameAr')
            this.nameForm.get('fnameEn').setValue(name)
        if (selected == 'snameAr')
            this.nameForm.get('snameEn').setValue(name)
        if (selected == 'tnameAr')
            this.nameForm.get('tnameEn').setValue(name)
        if (selected == 'lnameAr')
            this.nameForm.get('lnameEn').setValue(name)

        // populate Arabic name from English
        if (selected == 'fnameEn')
            this.nameForm.get('fnameAr').setValue(name)
        if (selected == 'snameEn')
            this.nameForm.get('snameAr').setValue(name)
        if (selected == 'tnameEn')
            this.nameForm.get('tnameAr').setValue(name)
        if (selected == 'lnameEn')
            this.nameForm.get('lnameAr').setValue(name)

       
    }
//edited by EMAD.AL
    titelCode: number;
    sendTitleCode(){
        this.titelCode= this.nameForm.get('titleCode').value;
        this.emitTitleCode.emit(this.titelCode);
    }

}



export interface IName {
    fnameEn: string;
    snameEn: string;
    tnameEn: string;
    lnameEn: string;
    fnameAr: string;
    snameAr: string;
    tnameAr: string;
    lnameAr: string;
    titleCode: number;
    titleNameAr?: string;
    titleNameEn?: string;
    fullnameAr: string;
    fullnameEn: string;
    vipLevel: number;
}
