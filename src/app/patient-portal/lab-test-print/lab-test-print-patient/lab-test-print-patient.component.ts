import { takeUntil } from 'rxjs/operators'; import { Subject } from 'rxjs';
import { Component, OnInit, Input, ViewChild, EventEmitter, Output, OnDestroy, ElementRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LabTestService } from '../lab-test.service';

// import { EnumPatServiceStatus } from '../../../../../enumeration/enum-pat-service-status';
// import { LabActions } from '../lab-test/lab-test.component';

// import * as jsPDF from 'jspdf'
@Component({
    selector: 'LabTestPrintAllPatient',
    templateUrl: './lab-test-print-patient.component.html'
})
export class LabTestPrintPatientComponent implements OnInit, OnDestroy {
    // PrintViewType: number = 1;
    currentAppCode;
    PrintSerials = "";
    printServiceCode = ""
    count = 0;

    position = 0;
    controlsParams;
    patientData: any;
    testData: any[] = [];
    serviceComment: any[] = [];
    autoPrint = false;
    private ngUnsubscribe = new Subject<void>();
    patServices: any[] = [];
    pipetransform: any;
    LabSheetCtg: any = [];
    LabServiceCtg: any = [];
    counter = -1;
    LabResultparms: any = <any>{}
    printhistory: boolean = false
    HistoryArr: any = []
    HistoryColumnArr: any = []
    HistoryRowArr: any = []
    PatClaimsToExport: number = 0
    _visitSerial: number = 0
    patcode: number = 0
    @Input ()exportToPdf:number;
    @Input() set visitSerial(value) {
        if (value) {

            this._visitSerial = value
            this.resetAfterServiceChange();
            this.getResultReport();
        }

    }
    get visitSerial() {
        return this._visitSerial
    }
    @Output()
    myStepFinished = new EventEmitter<any>()
    @Output() RowsCount = new EventEmitter<number>();
    constructor(private labTestService: LabTestService
        , public translate: TranslateService) { }

    ngOnInit() {


    }

    resetAfterServiceChange() {
        this.patientData = undefined;
        this.testData = undefined;
        this.PatClaimsToExport = 0
        this.patServices = [];
        this.autoPrint = false;
        this.HistoryRowArr = []
        this.HistoryArr = []
        this.HistoryColumnArr = []
        this.testData
        this.currentAppCode;
        this.PrintSerials = "";
        this.printServiceCode = ""
        this.serviceComment = [];
        this.LabSheetCtg = [];
        this.LabServiceCtg = [];
        this.HistoryArr = []
        this.HistoryColumnArr = []
        this.HistoryRowArr = []

    }
    getColspan(headersLev1): number {
        return this.HistoryArr.headersLev2.filter(el => el.serviceCode == headersLev1.serviceCode).length;
    }
    testDataMap = new Map<string, []>();

    getResultReport() {
        this.LabResultparms.visitSerial = this._visitSerial;
        this.LabResultparms.printhistory = 2
        this.labTestService
            .getPatientTestResultPatient(this.LabResultparms).pipe(
                takeUntil(this.ngUnsubscribe))
            .subscribe(res => {
                if (res) {
                    if (res.data && res.data.length > 0) {
                        this.patientData = res['data'][0];
                        // this.PrintViewType = res['data'][0]['printViewType'] ? res['data'][0]['printViewType'] : 1
                        this.patServices = res['data'];
                        this.RowsCount.emit(res.data.length);
                    }
                    if (res.data1 && res.data1.length > 0) {
                        this.testData = res['data1'];
                        this.testData.forEach(element => {
                            let sheetcomments: { commentDescAr: string; commentDescEn: string; sheetCode: number }[] = []
                            element.comments = sheetcomments
                        });
                         // sayed
                         this.getMappingData(this.testData);
                    }
                    if (res.data2 && res.data2.length > 0) {
                        let comments: { commentDescAr: string; commentDescEn: string; sheetCode: number }[] = res['data2'];
                        if (this.testData.length > 0)
                            this.testData.forEach(element => {
                                element.comments = [];
                                element.comments.push(...comments.filter(item => item.sheetCode == element.sheetCode));
                            });
                    }
                    if (res.data3 && res.data3.length > 0) {
                        this.serviceComment = res['data3'];
                    }
                    if (res.data4 && res.data4.length > 0) {
                        if (this.testData && this.testData.length > 0) {
                            this.LabSheetCtg = [],
                                this.LabServiceCtg = []
                            this.testData.forEach(items => {
                                if (!this.LabSheetCtg.find(ser => (ser.labSheetCtgCode === items.labSheetCtgCode && ser.serviceId === items.serviceId))) {
                                    let filter = {}
                                    filter['labSheetCtgCode'] = items.labSheetCtgCode
                                    filter['labSheetCtgDescAr'] = items.labSheetCtgDescAr
                                    filter['labSheetCtgDescEn'] = items.labSheetCtgDescEn
                                    filter['serviceId'] = items.serviceId
                                    filter['serviceNameAr'] = items.serviceNameAr
                                    filter['serviceNameEn'] = items.serviceNameEn
                                    this.LabSheetCtg.push(filter);
                                }
                                if (!this.LabServiceCtg.find(ser => (ser.serviceId === items.serviceId))) {
                                    let filter = {}
                                    filter['serviceId'] = items.serviceId
                                    filter['serviceNameAr'] = items.serviceNameAr
                                    filter['serviceNameEn'] = items.serviceNameEn
                                    filter['resultWriteDate'] = items.resultWriteDate
                                    this.LabServiceCtg.push(filter);
                                }
                            });
                            this.LabServiceCtg.forEach(element => {
                                element['LabSheetCtg'] = this.LabSheetCtg.filter(item => item.serviceId == element.serviceId)
                            });


                        }
                        if (res.data5 && res.data5.length > 0) {
                            this.HistoryArr = this.labTestService.formateLabResultMatrix(res.data5, '');
                            this.labTestService.formateLabResultMatrix(res.data5, '')

                        }
                    }
                }

            });
    }

    keysArr: any[] = [];
    obj: any;
    getMappingData(testData: any[]) {
        this.obj = {};
        this.testDataMap = this.groupBy(testData, pet => pet.servCategoryAr);
        this.testDataMap.forEach((value: [], key: string) => {//worked
            this.obj[key] = value;
            this.keysArr = Object.keys(this.obj);
        });
    }
    groupBy(list, keyGetter) {
        const map = new Map();
        list.forEach((item) => {
            const key = keyGetter(item);
            const collection = map.get(key);
            if (!collection) {
                map.set(key, [item]);
            } else {
                collection.push(item);
            }
        });
        return map;
    }

    getCSSClasses() {
        let cssClasses;

        if (this.exportToPdf) {
            cssClasses = {
                'under-line-cell': true,
            }

        }
        else {
            cssClasses = {
                'under-line-cell': false,
            }
        }
        return cssClasses;
    }

    // ---------------------------------------------------------------------------------------------------------------------------------
    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }


}
