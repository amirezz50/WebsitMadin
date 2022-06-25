import { Component, OnInit, Renderer2, ElementRef, ViewChild, EventEmitter, Output, OnDestroy, Input, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { IDataSave, imageUploadAllService, ImageData } from "../image-upload-all.service";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { TranslateService } from "@ngx-translate/core";
import { FileUploader } from '../../../blocks/file-upload/file-uploader.class';
import { DocManagementTrans } from './../../image-upload-new';
import { ModalService } from '../../../blocks/modal';
import { getDateObj, UserSessionService, getNgBsObj } from '../../../shared';
import { SelectizeComponent } from '../../../blocks/selectize';
import { ToastService } from '../../../blocks/toast';
import { NumberCardModule } from '@swimlane/ngx-charts';
export interface Lookups {
    itemType: number;
    serial: number;
    dataStatus: number;
    code: number;
    nameAr: string;
    nameEn: string;
    fastSearchData:string;
    active?: any;
  }

@Component({
    selector: 'sanabel-files-upload',
    templateUrl: './files-upload.component.html',
    styleUrls: ['./files-upload.component.css']
})
export class FilesUploadComponent implements OnInit, OnDestroy, AfterViewInit {
    @Input() multiple: boolean = false;
    @Input() approvals: boolean = false;
    private ngUnsubscribe: Subject<void> = new Subject<void>();
    dataToSave: IDataSave = <IDataSave>{};
    @ViewChild('visitSerial', { static: false }) visitSerial: SelectizeComponent;
    @ViewChild('visitSerial1', { static: false }) visitSerial1: SelectizeComponent;
    @ViewChild('visitSerial2', { static: false }) visitSerial2: SelectizeComponent;
    @ViewChild('billNumber', { static: false }) billNumber: SelectizeComponent;
    @ViewChild('transSerial', { static: false }) transSerial: SelectizeComponent;
    docCategories: any[] = [];
    lookupDataList: Lookups[] = [];
    ChildCategory: any[] = [];

    targetType: number = 1;
    selectSerial: number = 1;
    showUpMenue: number = 0;
    showPatScanner: boolean = false
    allVisits: boolean = false
    fileEvent;
    _imageBase64: any;
    _imageBase641: any;
    _imageBase64Copy: any[] = [];
    alldata: any[] = [];
    url: any;
    uploadError: string;
    publishPath: any;

    imageData: ImageData = <ImageData>{};
    showVisitSerial: boolean = false;
    
    DocManagementTrans: DocManagementTrans = <DocManagementTrans>{};
    public uploader: FileUploader = new FileUploader({});
    @ViewChild('image', { static: false }) private image: ElementRef;
    @Output() close = new EventEmitter();
    mode: number;
    empData: any;
    values: any[];
    pageMode: number = 0;

    oldDocPath: any;

    streaming = false;
    video = null;
    canvas = null;
    photo = null;
    startbutton = null;
    popupPublishPath = null;

    showSelectedImage = false;
    @Input() ignorePageMode: number;
    @Input() popupMode: number;
    _patientVisitCode: number;
    @Input()
    set patientVisitCode(value: number) {
        this._patientVisitCode = value;
    }
    get patientVisitCode(): number {
        return this._patientVisitCode;
    }

    _patientCode: number;
    @Input()
    set patientCode(value: number) {
        this._patientCode = value;
        if (this.visitSerial) {
            this.visitSerial.clear();
            this.visitSerial.clearItems();
            this.visitSerial.setFastSearchObjDynamicKey('PatCode', this._patientCode);
        }
    }
    get patientCode(): number {
        return this._patientCode;
    }
    SupBillScanner: any = <any>{};
    master: any = <any>{};
    empCode : number;
    serviceCode : number
    constructor(
        public translate: TranslateService,
        private _route: ActivatedRoute,
        private _modalService: ModalService,
        private _toastService: ToastService,
        private _userSessionService: UserSessionService,
        private _imageUploadAllService: imageUploadAllService,
        private renderer: Renderer2
    ) {
        this.mode = +this._route.snapshot.params['mode'];
        console.log('mode' + this.mode)

    }
    ngOnInit() {
        this.getModalData$();
        this._userSessionService.subscribeToKey$('SupBillScaninging')
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((keys: any) => {
                if (keys.value) {
                    this.SupBillScanner = keys.value;
                    // this.getGetSupBillPrintResetInfo();
                }
            });

            //-------------------------------------------------------
            this._userSessionService.subscribeToKey$('SetEmpCode')
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((keys: any) => {
                if (keys.value) {
                    this.empCode = keys.value;
                    this.dataToSave.userCode =  this.empCode
                    this.getAllImageForFirst(  this.dataToSave);
                }
            });
              //-------------------------------------------------------
              this._userSessionService.subscribeToKey$('patientInfo')
              .pipe(takeUntil(this.ngUnsubscribe))
              .subscribe((keys: any) => {
                  if (keys.value) {
                      console.log('patientInfoSession',keys.value)
                      this.serviceCode = keys.value.visitSerial ;
                      this.dataToSave.userCode =  this.serviceCode
                      this.getAllImageForFirst(  this.dataToSave);
                  }
              });
            //-------------------------------------------------------
        if (this._userSessionService.getModalKey('FilesUploadComponent')) {
            this.master = this._userSessionService.getModalKey('FilesUploadComponent')["inputs"];
            if (this.master.pageType) {///التحويلات البنكيه
                this.dataToSave.tableRowId = +this.master.tableRowId
                this.dataToSave.userCode = +this.master.tableRowId
                this.dataToSave.userType = +this.master.pageType
                this.showUpMenue = +this.master.pageType

                this.resetFormData();

                this.getCategoriesData(+this.master.pageType);
            } else {
                this.approvals = true;
                this._patientVisitCode = +this.master.patientCode;
                this._patientVisitCode = this.master.visitSerial;
                this.dataToSave['emrHtmlReportSerial'] = this.master.emrHtmlReportSerial
            }
        }
        if (!this.master || !this.master.pageType)
            this.initFileUploadComp();
    }
    getModalData$() {
        this._userSessionService.getModalKey$()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((keys: any) => {
                if (keys && keys.inputs && keys.name == 'FilesUploadComponent') {
                    if (keys.inputs.pageType) {
                        this.publishPath = ''
                        this.image = <ElementRef>{};
                        this.alldata = [];

                        this.resetFormData();

                        this.dataToSave.tableRowId = keys.inputs.tableRowId
                        this.dataToSave.userCode = keys.inputs.tableRowId
                        this.dataToSave.userType = keys.inputs.pageType
                        this.showUpMenue = +keys.inputs.pageType

                        this.getCategoriesData(keys.inputs.pageType);
                    } else {
                        this.approvals = true;
                        this._patientVisitCode = +keys.inputs.patientCode;
                        this._patientVisitCode = keys.inputs.visitSerial;
                        this.dataToSave['emrHtmlReportSerial'] = keys.inputs.emrHtmlReportSerial
                        this.initFileUploadComp();
                    }
                }
            });
    }

    initFileUploadComp() {
        let _date = new Date();
        this.imageData.transData = getNgBsObj(_date);
        if (this._patientVisitCode && this._patientVisitCode > 0) {
            this.dataToSave.userCode = this._patientVisitCode;
            this.dataToSave.visitSerial = this._patientVisitCode;
            this.dataToSave.userType = 1;
            this.pageMode = 1;
            if (this.visitSerial) {
                this.visitSerial.writeValue(this._patientVisitCode);
            }
            this.getCategoriesData(1);
        } else {
            this.pageMode = this.ignorePageMode != 1 ? +this._route.snapshot.params['mode'] : 0;
            this.pageMode =  this.pageMode > 0 ?  this.pageMode :  this.popupMode
            if (this.pageMode == 1 || this.pageMode == 4 || this.pageMode == 3 || this.pageMode == 2|| this.pageMode == 9) {//مريض-مورد-موظف
                this.showUpMenue = 0;
                this.dataToSave.userType = this.pageMode;
                this.targetType = this.pageMode;
                this.getCategoriesData(this.pageMode);
            } else {
                this._userSessionService
                    .subscribeToKey$('UserCodeData')
                    .pipe(takeUntil(this.ngUnsubscribe))
                    .subscribe(res => {
                        if (res.value) {
                            let user = res.value;
                            if (user) {
                                this.targetType = user.userType
                                if (user.userType == 1) {
                                    this.showVisitSerial = true;
                                    this.showPatScanner = false
                                    this.dataToSave.userCode = +user.userCode;
                                } else if (user.userType == 2) {
                                    this.dataToSave.userCode = +user.userCode;
                                    this.showPatScanner = true
                                } else if (user.userType == 4) {
                                    //////////////////////////////////////////////////////مورد//رقم فاتور//كود الحركه

                                    this.dataToSave.userCode = +user.userCode;
                                    this.dataToSave.transCode = user.transCode;
                                    this.imageData.transSerial = user.transCode;
                                    this.imageData.billNumber = user.billNumber
                                    this.dataToSave.billNumber = user.billNumber;
                                    this.dataToSave.transCodeArray = user.transCodeArray;
                                    //this.dataToSave.lookupSerial = 0
                                    this.showPatScanner = true;
                                }
                                this.showUpMenue = user.userType;
                                this.dataToSave.userType = user.userType;
                                this.getCategoriesData(user.userType);
                            }
                        } else {
                            let id = +this._route.snapshot.params['id'];
                            if (id == 0) {
                                this.showUpMenue = 0;
                                this.dataToSave.userType = 1;
                                this.getCategoriesData(1);
                            } else {
                                this.showUpMenue = id;
                                this.dataToSave.userType = id;
                                this.dataToSave.userCode = +this._route.snapshot.queryParamMap.get('userCode');
                                this.getCategoriesData(id);
                            }
                        }
                    });
            }
        }
    }


    ngAfterViewInit() {
        if (this.visitSerial) {
            this.visitSerial.writeValue(this._patientVisitCode);
            this.visitSerial.clear();
            this.visitSerial.clearItems();
            this.visitSerial.setFastSearchObjDynamicKey('PatCode', this._patientCode);
        }
    }
    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete(); 
        this._userSessionService.setSessionKey('UserCodeData', {});
    }
    flagCode: number;
    setChangeStep(ev: any) {
        if (ev && ev.target.value) {
            let data = {
                flagCode: +ev.target.value
            }
            this.flagCode = +ev.target.value;
            this._imageUploadAllService.updateFlageCode(data)
                .pipe(takeUntil(this.ngUnsubscribe))
                .subscribe(c => {
                    console.log(c);
                });
        }
    }

    getChangeData(ev: any) {
        if (ev && ev.target.value) {
            if (this.image.nativeElement.children.length > 0) {
                for (var i = this.image.nativeElement.children.length - 1; i >= 0; --i) {
                    this.image.nativeElement.children[i].remove();
                }
            }
            this.resetFormData();
            this.selectSerial = 1;
            this.alldata = [];
            this.ChildCategory = [];
            this.dataToSave.userCode = 0;
            this.dataToSave.visitSerial = 0;
            this.publishPath = null;
            this.targetType = +ev.target.value;
            this.dataToSave.userType = this.targetType;
            this.getCategoriesData(this.targetType);
        }
    }
    // patCode: number;
    getAllVisitsData(ev: any) {
        if (ev && ev.target.value) {
            this.visitSerial2.clear();
            this.visitSerial2.clearItems();
            this.visitSerial2.setFastSearchObjDynamicKey('PatCode', this.patCode);
        } else {
            this.visitSerial.clear();
            this.visitSerial.clearItems();
            this.visitSerial.setFastSearchObjDynamicKey('PatCode', this.patCode);
        }
    }
    patCode: number;
    getAllImageForFirst(ev: any, code?: number) {
        console.log(ev);
        if (ev && ev != null && ev['AutoEmited'] == false) {
            if (code && code == 1) {
                if (this.dataToSave.visitSerial > 0) {
                    this.dataToSave.visitSerial = 0;
                }
                this.dataToSave.userCode = ev.code;
                this.patCode = ev.code;
                if (this.visitSerial) {
                    this.visitSerial.clear();
                    this.visitSerial.clearItems();
                    this.visitSerial.setFastSearchObjDynamicKey('PatCode', ev.code);
                } else if (this.visitSerial2) {
                    this.visitSerial2.clear();
                    this.visitSerial2.clearItems();
                    this.visitSerial2.setFastSearchObjDynamicKey('PatCode', ev.code);
                }
            } else {

                this.dataToSave.userCode = ev.code;
                /////targetType==4 -------------مورد 
                if (this.targetType == 4) {

                    this.transSerial.clear();
                    this.transSerial.clearItems();
                    this.billNumber.clear();
                    this.billNumber.clearItems();
                }

            }
            this.getLookupSerial(this.dataToSave.lookupSerial);
        }

    }

    getVisitSerial(ev: any) {
        if (ev && ev.code && !ev['AutoEmited']) {
            this.dataToSave.visitSerial = ev.code;
            this.allVisits = false
            this.getLookupSerial(this.dataToSave.lookupSerial);

        }
    }

    // fire by default when get all categories to get first data 
    // fire when clcik on parent category to get child data
    getLookupSerial(serial: number, name?: string) {
        if (name) {
            this.dataToSave.name = name;
        }
        if (serial) {
            if (this.image.nativeElement.children.length > 0) {
                for (var i = this.image.nativeElement.children.length - 1; i >= 0; --i) {
                    this.image.nativeElement.children[i].remove();
                }
            }
            this.dataToSave.lookupSerial = serial;
            this.getChildCategory(serial);
        }
        this.imageData.imageName = name
    }

    // fire when click on child category to get its images
    getChildCategoryId(id: number, docManagementLookupSerial?: number) {
        if (id) {
            this.dataToSave.docManagmentSerial = id;
            this.dataToSave.docManagementLookupSerial = docManagementLookupSerial;
            this.getAllImages();
        }
    }

    // get child categories and then call get first cat images
    getChildCategory(code: number) {
        if (code) {
            this.ChildCategory = [];

            if (this.childCategories && this.childCategories.length > 0) {
                this.ChildCategory = this.childCategories.filter(el => el.parentSerial == code);
                this.values = Object.assign([], this.ChildCategory);
                if (this.ChildCategory.length > 0) {
                    this.dataToSave.docManagmentSerial = this.ChildCategory[0].serial;
                    this.dataToSave.docManagementLookupSerial = this.ChildCategory[0].docManagementLookupSerial;
                    this.getImagesData();
                    this.getAllImages();
                }
            }
        }
    }
    childCategories: any[] = [];
    getCategoriesData(id: number) {
        if (id) {
            this._imageUploadAllService.getCategoriesData(id)
                .pipe(takeUntil(this.ngUnsubscribe))
                .subscribe(
                    res => {
                        this.lookupDataList = res.data;
                        this.docCategories = res.data1;
                        this.childCategories = res.data2;
                        this.flagCode = res.data3[0].inOutFlag;
                    },
                    err => console.log(err),
                    () => {

                        if (this.docCategories.length > 0) {
                            this.dataToSave.lookupSerial = this.docCategories[0].serial;
                            this.getImagesData();
                            this.getAllImages();

                        }
                    }
                );
        }
    }

    getImagesByFilter(value: string) {
        if (value && value.length > 0) {
            this.dataToSave.searchData = value;
            this.getAllImages();
        } else {
            this.dataToSave.searchData = undefined;
            this.getAllImages();
        }
    }

    exp: any = /^[A-Za-z][A-Za-z0-9_ ]*$/;
    filterListByName(value: string) {
        if (value && value.length > 0) {
            if (this.exp.test(value) || value == '') {
                //this.ChildCategory = [];
                this.ChildCategory = this.values.filter(s => s['nameEn'].includes(value));
            } else {
                this.ChildCategory = this.values.filter(s => s['nameAr'].includes(value));
            }
        }
        if (value.length == 0) {
            this.ChildCategory = this.values;
        }
    }

    resetFormData() {
        this.allImagesData = []
        this.imageData = <ImageData>{};
        this.imageData.transData = getNgBsObj(new Date());
        this.alldata = [];
        this.publishPath = ''
        this.image = <ElementRef>{};
        this.ChildCategory = []
        this._imageBase64Copy = [];
    }
    setDocManagementTransToGet() {
        this.DocManagementTrans = <DocManagementTrans>{};
        this.DocManagementTrans.base64Arr = this._imageBase64Copy;
        this.DocManagementTrans.tableRowId = this.dataToSave.userCode ? this.dataToSave.userCode : this.dataToSave.tableRowId;
        this.DocManagementTrans.transSerial = this.dataToSave.transCode;
        this.DocManagementTrans.billNumber = this.dataToSave.billNumber;
        this.DocManagementTrans.transCodeArray = this.dataToSave.transCodeArray;
        this.DocManagementTrans.serial = this.dataToSave.serial;
        this.DocManagementTrans.docFolderLookupSerial = +this.dataToSave.userType;
        this.DocManagementTrans.allVisits = this.allVisits ? 1 : 0
        this.DocManagementTrans.searchData = this.dataToSave.searchData;
        if (this.dataToSave.docManagmentSerial && this.dataToSave.docManagmentSerial > 0) {
            // this.DocManagementTrans.documentLookupCode = this.dataToSave.docManagementLookupSerial;
            this.DocManagementTrans.docManagementSerial = this.dataToSave.docManagmentSerial;
        }

        if (this.dataToSave.visitSerial && this.dataToSave.visitSerial > 0 && !this.DocManagementTrans.allVisits) {
            this.DocManagementTrans.tableRowId = this.dataToSave.visitSerial;
        }

    }
    getImagesData() {

        if ((this.dataToSave.name == 'medical cards' || this.dataToSave.name == 'convert letter') && (!this.dataToSave.visitSerial || this.dataToSave.visitSerial == 0)) {
            this._toastService.activateMsg('UI65');
            return false;
        }
        this.setDocManagementTransToGet()
        this._imageUploadAllService.getAllImage(this.DocManagementTrans)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(
                res => {
                    this.allImagesData = res ? res.data : [];

                    // here will get statistics 
                    // parent categories - child categories - all images
                    this.docCategories.forEach((parent, i) => {
                        parent.imgCount = 0;
                        this.childCategories
                            .filter(child => parent.serial == child.parentSerial)
                            .forEach(child => {
                                child.count = 0;
                                child.count = this.allImagesData.filter(img => {
                                    if (child.serial == img.docManagementSerial) {
                                        return true;
                                    }
                                }).length;
                                parent.imgCount += child.count;
                            });
                    });


                    this.DocManagementTrans.transCodeArray = ''
                    //    this.DocManagementTrans.documentLookupCode = this.dataToSave.docManagementLookupSerial;
                    this.DocManagementTrans.docManagementSerial = this.dataToSave.docManagmentSerial;
                });
    }
    // get all images
    allImagesData: any[] = [];
    getAllImages() {
        if (this.image.nativeElement.children.length > 0) {
            for (var i = this.image.nativeElement.children.length - 1; i >= 0; --i) {
                this.image.nativeElement.children[i].remove();
            }
        }

        if (this.allImagesData && this.allImagesData.length > 0) {
            this.alldata = this.allImagesData.filter(el => el.documentLookupCode == this.dataToSave.docManagementLookupSerial);
        } else {
            this.alldata = []
        }

        if (this.alldata && this.alldata.length > 0) {
            this.alldata.forEach(x => {
                this.url = this._imageUploadAllService.getImagebyName(x);
                x.url = this.url;
                this.createImageBitmap(this.url, x);
            });
            this.oldDocPath = this.alldata[0].docPath;
            let imgSrc = this.alldata[0].publishPath
            console.log(imgSrc)
            this.publishPath = imgSrc.split('base64,')[1];
            console.log(this.publishPath)

        }
    }

    // file read
    setEvent(event) {
        this.fileEvent = event;
        this.readFile(event);
    }

    readFile(event) {
        if (event) {
            var FR;
            Array.from(event.target.files).forEach(file => {
                FR = new FileReader();
                FR.addEventListener('load', (e: any) => {
                    this._imageBase64 = e.target.result;
                    this.uploadFile();
                });
                // if (event) {
                FR.readAsDataURL(file);//event.target.files[0]);
                // }
            });
        }
    }

    uploadFile() {
        if (this._imageBase64) {
            this.uploadBase64();
        }
    }


    canPlay(ev) {
        if (!this.streaming) {
            this.streaming = true;
        }
    }

    uploadBase64() {
        this._imageBase641 = this._imageBase64.split('base64,')[1]
        this._imageBase64Copy.push(this._imageBase641)
        this.uploadError = '';
        this.createImageBitmap(this._imageBase64);
    }

    imageDataXml: any;
    createImageBitmap(src, data?: any) {
        var srcArr = src.split('=');
        var numArr = srcArr[srcArr.length - 1].split('.');
        if (+numArr[0] > 0) {
            src = src + '&' + String(Math.random());
        }
        const div: HTMLDivElement = this.renderer.createElement('div');
        this.renderer.addClass(div, 'reset-image');
        const img: HTMLImageElement = this.renderer.createElement('img');

        img.src = src;

        if (data) {
            this.renderer.setAttribute(img, 'imageName', data.imageName);
            this.renderer.setAttribute(img, 'transDate', data.transDate);
            this.renderer.setAttribute(img, 'notes', data.notes);
            this.renderer.setAttribute(img, 'serial', data.serial);
            this.renderer.setAttribute(img, 'docPath', data.docPath);
            this.renderer.setAttribute(img, 'transSerial', data.transSerial);
            this.renderer.setAttribute(img, 'billNumber', data.billNumber);
            this.renderer.setAttribute(img, 'tableRowId', data.tableRowId);

        } else {
            this.renderer.setAttribute(img, 'imageName', 'null');
            this.renderer.setAttribute(img, 'transDate', 'null');
            this.renderer.setAttribute(img, 'notes', 'null');
            this.renderer.setAttribute(img, 'docPath', 'null');
            this.renderer.setAttribute(img, 'serial', 'null');
            this.renderer.setAttribute(img, 'billNumber', 'null');
            this.renderer.setAttribute(img, 'transSerial', 'null');
            this.renderer.setAttribute(img, 'tableRowId', 'null');
        }
        this.renderer.addClass(img, 'w-100');
        this.renderer.addClass(img, 'h-100');
        this.renderer.addClass(img, 'mx-auto');
        this.renderer.addClass(img, 'mt-2');
        this.renderer.addClass(img, 'd-block');


        img.addEventListener('click', this.getImagePath.bind(this, img.src, img));

        const a: HTMLAnchorElement = this.renderer.createElement('a');
        this.renderer.addClass(a, 'delete-btn');
        this.renderer.addClass(a, 'btn');
        this.renderer.addClass(a, 'btn-danger');
        this.renderer.addClass(a, 'text-white');
        this.renderer.addClass(a, 'rounded-circle');

        a.addEventListener('click', this.deleteProductImage.bind(this, img.src, data, img, div));

        const span: HTMLElement = this.renderer.createElement('span');

        this.renderer.addClass(span, 'fas');
        this.renderer.addClass(span, 'fa-trash');
        this.renderer.addClass(span, 'text-white');

        this.renderer.appendChild(this.image.nativeElement, div);
        this.renderer.appendChild(div, img);
        this.renderer.appendChild(div, a);
        this.renderer.appendChild(a, span);
    }
    rotateNum: number = 0;
    // regExp = /[\d|.|\+]+/g;
    rotateImage(dir: 'LEFT' | 'RIGHT', type: string = '') {
        let img = document.getElementById('imgPreview-' + type);
        if (img) {
            if (dir == 'RIGHT') {
                this.rotateNum += 90;
            } else {
                this.rotateNum -= 90;
            }
            if (img.style.cssText) {
                img.style.transform = (type != 'general' ? 'translate(-50%, -50%) ' : '') + 'rotate(' + this.rotateNum + 'deg) scale(' + this.scaleNum + ')';
            } else {
                img.style.transform = (type != 'general' ? 'translate(-50%, -50%) ' : '') + 'rotate(' + this.rotateNum + 'deg)';
            }
        }
    }

    // scale image ----
    scaleNum: number = 1;
    zoomImg(scale: 'IN' | 'OUT', type: string = '') {
        let img = document.getElementById('imgPreview-' + type);
        if (img) {
            if (scale == 'IN') {
                this.scaleNum += 0.1;
            } else {
                this.scaleNum -= 0.1;
            }
            if (img.style.cssText) {
                img.style.transform = (type != 'general' ? 'translate(-50%, -50%) ' : '') + 'rotate(' + this.rotateNum + 'deg) scale(' + this.scaleNum + ')';
            } else {
                img.style.transform = (type != 'general' ? 'translate(-50%, -50%) ' : '') + 'scale(' + this.scaleNum + ')';
            }
        }
    }

    deleteProductImage(filename, a, img, div) {

        //this.DocManagementTrans = <DocManagementTrans>{};
        this.DocManagementTrans.docPath = filename;
        if (filename) {
            var nameArr = filename.split('=');
            this._modalService.activeDelMes(String(nameArr[nameArr.length - 1]), String(nameArr[nameArr.length - 1])).then(responseOK => {
                if (responseOK) {
                    this._imageUploadAllService.deleteImage(a.serial)
                        .pipe(takeUntil(this.ngUnsubscribe))
                        .subscribe(

                            res => {
                                if (res && res.returnFlag) {
                                    div.remove();
                                    img.remove()
                                    this._imageBase64Copy = [];
                                    this.imageData = <ImageData>{};
                                    this.imageData.transData = getNgBsObj(new Date());
                                    this.getImagesData();
                                }
                            },
                            err => console.log(err),
                            () => {
                                this.getLookupSerial(this.dataToSave.lookupSerial);;
                            });
                }
            });
        }

    }

    // getImageBase(image.base64)

    getImagePath(image: any, img: any) {
        if (image) {
            this.rotateNum = 0;
            this.publishPath = image;
            this.imageData.transData = (!img.attributes.transdate || img.attributes.transdate.value != 'null') ? getNgBsObj(img.attributes.transdate.value) : getNgBsObj(new Date());
            this.imageData.serial = (!img.attributes.serial || img.attributes.serial.value != 'null') ? +img.attributes.serial.value : 0;
            this.imageData.imageName = (!img.attributes.imagename || img.attributes.imagename.value != 'null') ? img.attributes.imagename.value : '';
            this.imageData.notes = (!img.attributes.notes || img.attributes.notes.value != 'null') ? img.attributes.notes.value : '';
            this.imageData.docPath = (!img.attributes.docPath || img.attributes.docPath.value != 'null') ? img.attributes.docPath.value : '';
            this.imageData.transSerial = (!img.attributes.transSerial || img.attributes.transSerial.value != 'null') ? img.attributes.transSerial.value : '';
            this.imageData.billNumber = (!img.attributes.billNumber || img.attributes.billNumber.value != 'null') ? img.attributes.billNumber.value : '';
            this.imageData.tableRowId = (!img.attributes.tableRowId || img.attributes.tableRowId.value != 'null') ? img.attributes.tableRowId.value : '';

            if (!this.imageData.transData || this.imageData.transData == null) {
                this.imageData.transData = getNgBsObj(new Date());
            }
        }
    }

    //// save new image
    applayPrint: boolean;
    onSubmit() {

        if ((this.dataToSave.name == 'Visit Card' || this.dataToSave.name == 'Transfer Letter') && (!this.dataToSave.visitSerial || this.dataToSave.visitSerial == 0)) {
            this._toastService.activateMsg('UI65');
            return false;
        }
        this.DocManagementTrans = <DocManagementTrans>{};
        this.DocManagementTrans.base64Arr = this._imageBase64Copy;
        this.DocManagementTrans.tableRowId = this.dataToSave.userCode;
        this.DocManagementTrans.transSerial = this.dataToSave.transCode ? this.dataToSave.transCode : this.imageData.transSerial;
        this.DocManagementTrans.billNumber = this.dataToSave.billNumber ? this.dataToSave.billNumber : this.imageData.billNumber;
        this.DocManagementTrans.documentLookupCode = this.dataToSave.lookupSerial;
        this.DocManagementTrans.emrHtmlReportSerial = this.dataToSave['emrHtmlReportSerial'];
        this.DocManagementTrans.docManagementSerial = this.dataToSave.lookupSerial;
        this.DocManagementTrans.docFolderLookupSerial = +this.dataToSave.userType;
        //this.DocManagementTrans.docPath = this.oldDocPath;

        this.imageData.transData = getDateObj(this.imageData.transData);
        const data = this.imageData;
        if (data.serial > 0) {
            this.DocManagementTrans.serial = data.serial;
        }
        this.DocManagementTrans.imageData = JSON.stringify(data);

        if (this.dataToSave.docManagmentSerial && this.dataToSave.docManagmentSerial > 0) {
            this.DocManagementTrans.documentLookupCode = this.dataToSave.docManagementLookupSerial;
            this.DocManagementTrans.docManagementSerial = this.dataToSave.docManagmentSerial;
        }

        if (this.dataToSave.visitSerial && this.dataToSave.visitSerial > 0 && !this.DocManagementTrans.allVisits) {
            this.DocManagementTrans.tableRowId = this.dataToSave.visitSerial;
        }

        if (this.DocManagementTrans.serial > 0) {
            this.DocManagementTrans.docPath = data.docPath;
            this._imageUploadAllService.updateImageData(this.DocManagementTrans)
                .pipe(takeUntil(this.ngUnsubscribe))
                .subscribe(
                    res => {
                        if (res.msgData && res.msgData[0].msgID == 5) {
                            this._imageBase64Copy = [];
                            this.imageData = <ImageData>{};
                            this.imageData.transData = getNgBsObj(new Date());
                            this.getImagesData();
                        }
                    },
                    err => console.log(err),
                    () => {
                        this.getLookupSerial(this.dataToSave.lookupSerial);
                        this.applayPrint = true;
                        this.addMedicalDataPopup('lg')
                    });
        } else {
            this._imageUploadAllService.saveAllImage(this.DocManagementTrans)
                .pipe(takeUntil(this.ngUnsubscribe))
                .subscribe(
                    res => {
                        if (res.msgData && res.msgData[0].msgID == 5) {
                            this._imageBase64Copy = [];
                            this.imageData = <ImageData>{};
                            this.imageData.transData = getNgBsObj(new Date());
                            this.getImagesData();
                        }
                    },
                    err => console.log(err),
                    () => {
                        this.getLookupSerial(this.dataToSave.lookupSerial);
                        this.applayPrint = true;
                        this.addMedicalDataPopup('lg')
                        this._userSessionService.closeModalKey('ServiceConditionComponent', true);
                    });
        }
    }

    onClose(data: any) {
        this.close.emit(data);
    }

    setBase64ToPhoto() {
        var data = this.canvas.toDataURL('image/png');
        this._imageBase64 = data;
        this.photo.setAttribute('src', data);
    }

    clearphoto() {
        var context = this.canvas.getContext('2d');
        context.fillStyle = '#AAA';
        context.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.setBase64ToPhoto();
    }

    takepicture(event) {
        var context = this.canvas.getContext('2d');
        context.drawImage(this.video, 0, 0);

        this.setBase64ToPhoto();
        this.clearphoto();

        event.preventDefault();
    }

    startup() {
        this.video = document.getElementById('video');
        this.canvas = document.getElementById('canvas');
        this.photo = document.getElementById('photo');
        this.startbutton = document.getElementById('startbutton');
     
        this.clearphoto();
    }

    openCamera() {
        this.takepic.openContent().result.then(result => { }, reason => { });
        this.startup();
    }


    // popup part
    @ViewChild('popup', { static: false }) content: any;
    @ViewChild('modal', { static: false }) takepic: any;
    DynamicComponent: any;
    ComponentNo: any;
    addMedicalDataPopup(size?: "sm" | "lg" | "xl") {
        // create object with master data
        let masterParms = {};
        if (size) {
            //send data when model open
            this.content.openModal();
        }
    }
    onpopupClose(parms: any) {
        // get data after model (Popup) close..
        if (parms && parms.output == 'PrintImageComponent') {
        }
    }
    afterPopupClosed(event) {
        if (this.uploader && this.uploader.queue[0]) {
            var FR = new FileReader();
            FR.addEventListener('load', (e: any) => {
                this._imageBase64 = e.target.result;
                this.uploadFile();
                // this.uploader.queue[this.uploader.queue.length - 1].upload();
            });

            if (event && event.target) {
                FR.readAsDataURL(event.target.files[0]);
            }
        }
    }


    slectImage() {
        if (this.publishPath && this.publishPath != null) {
            this.showSelectedImage = true
            this.popupPublishPath = this.publishPath
            document.querySelector('body').classList.add('position-fixed')
        }
    }
    smallScreenSelectedImage() {
        if (this._imageBase64 && this._imageBase64 != null) {
            this.showSelectedImage = true
            this.popupPublishPath = this._imageBase64
            document.querySelector('body').classList.add('position-fixed')
        }
    }
    hideSelectedImage() {
        this.showSelectedImage = false
        document.querySelector('body').classList.remove('position-fixed')
    }


    slideImage(type: 'NEXT' | 'PREV') {
        let indx = this.alldata.findIndex(el => el.url == this.popupPublishPath);
        if (type == 'NEXT') {
            this.popupPublishPath = this.alldata[indx + 1 > this.alldata.length - 1 ? 0 : (indx + 1)].url;
        } else {
            this.popupPublishPath = this.alldata[indx - 1 < 0 ? (this.alldata.length - 1) : (indx - 1)].url;
        }
    }

    setTransSerial(action: any) {
        if (action && action.code) {
            this.billNumber.clear();
            this.billNumber.clearItems();
            this.dataToSave.transCodeArray = action.code.toString() + ',';
            //  this.resetFormData()
            this.getImagesData()
        }
    }

}