import { Component, OnInit, OnDestroy, Input, ViewChild, Output, EventEmitter } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { UserSessionService } from "../../app-user-session.service";
import { ObjListFilterPipe } from "../../blocks/pipes/obj-list-filter.pipe";
import { EnumPatServiceStatus } from "../../enumeration/enum-pat-service-status";
import { PrintComponent } from "../../print-component";
import { RegPatService } from "../portal-new-reservation/portal-new-reservation-interface";
import { OrderPatientAction } from "../portal-pat-services-history/portal-pat-services-history.component";
import { LabTestService } from "./lab-test.service";

;


@Component({
    selector: 'LabTestPrintMaster',
    templateUrl: './lab-test-print-master.component.html'
})
export class LabTestPrintMasterComponent implements OnInit, OnDestroy {
    PrintViewType: number = 1;
    currentAppCode;
    PrintSerials = "";
    printServiceCode = ""
    count = 0;
    stockSettingsParms: any = {};
    multiPrintFlag: number;
    hasCorrectedValue: number;
    position = 0;
    myAppCode = 683;
    printafterwrite = 682;
    controlsParams;
    patientData: any;
    testData: any[] = [];
    MicroBilogyArray: any[] = [];
    testDataMultiRowInPrint: any[] = [];
    serviceComment: any[] = [];
    autoPrint = false;
    private ngUnsubscribe = new Subject<void>();
    patServices: any[] = [];
    pipetransform: ObjListFilterPipe;
    RegPatService: RegPatService = <RegPatService>{}
    LabSheetCtg: any = [];
    LabServiceCtg: any = [];
    counter = -1;
    x;
    LabResultparms: any = <any>{}
    printhistory: boolean = false
    HistoryArr: any = []
    HistoryColumnArr: any = []
    HistoryRowArr: any = []
    PatClaimsToExport: number = 0
    visitSerial: number = 0
    patcode: number = 0;
    printTimes: boolean = false;
    correctedResultsAppear: boolean = false;
    needRefresh: boolean = true
    timesArr: any = []
    @Input() set PatService(value) {
        if (value) {
            this.resetAfterServiceChange();
            this.userSession.setSessionKey(OrderPatientAction.Order_Next_AppCode, 683);
            this.setPatService([value]);
        } else {
        }
    }

    @ViewChild('printComponent', { static: false }) printComponent: PrintComponent;
    @Output()
    myStepFinished = new EventEmitter<any>()
    constructor(private labTestService: LabTestService
        , private userSession: UserSessionService,
         public translate: TranslateService) { }

    ngOnInit() {
        this.userSession
            .subscribeToKey$('PatClaimsToExport').pipe(
                takeUntil(this.ngUnsubscribe))
            .subscribe(res => {
                if (res && res.value && res.value.visitSerial) {

                    this.PatClaimsToExport = 1
                    this.visitSerial = res.value.visitSerial
                    this.patcode = res.value.patCode

                    this.getResultReport();
                }
            });
        this.getLab_Pat_Service$();
        this.userSession
            .subscribeToKey$('Printhistory').pipe(
                takeUntil(this.ngUnsubscribe))
            .subscribe(res => {
                this.printhistory = res.value
            });
    }
    //#region service and appcodes from session
    getLab_Pat_Service$() {
        this.userSession
            .subscribeToKey$(OrderPatientAction.Order_Pat_Service).pipe(
                takeUntil(this.ngUnsubscribe))
            .subscribe(res => {
                if (res.name == OrderPatientAction.Order_Pat_Service) {
                    this.resetAfterServiceChange();
                    if (res && res.value && res.value.service) {

                        this.setPatService(res.value.service);
                    }

                }
            });


    }
    printTimesCheck(event) {

        this.needRefresh = false
        this.printTimes = event
        setTimeout(() => {
            this.needRefresh = true

            setTimeout(() => {
                if (this.printComponent) {
                    this.printComponent.PrintView()

                }
            }, 200)
        }, 200);



    }
    correctedResultsAppearCheck(event) {
        this.needRefresh = false
        this.correctedResultsAppear = event
        setTimeout(() => {
            this.needRefresh = true

            setTimeout(() => {
                if (this.printComponent) {
                    this.printComponent.PrintView()

                }
            }, 200)
        }, 200);

    }

    resetAfterServiceChange() {
        this.patientData = undefined;
        this.PatClaimsToExport = 0
        this.testData = [];
        this.patServices = [];
        this.serviceComment = []
        this.autoPrint = false;
        this.HistoryRowArr = []
        this.HistoryArr = []
        this.HistoryColumnArr = []
    }
    getColspan(headersLev1): number {
        return this.HistoryArr.headersLev2.filter(el => el.serviceCode == headersLev1.serviceCode).length;
    }

    setPatService(service: any[]) {
        let sesioncode = this.userSession.getSessionKey<any>(OrderPatientAction.Order_Next_AppCode)



            this.patientData = undefined;
            this.testData = [];
            this.autoPrint = false;
            this.patServices = service;
            this.getResultReport();

    }
    testDataMap = new Map<string, []>();
    getResultReport() {

        this.PrintSerials = " "
        this.printServiceCode = " "
        for (let i = 0; i < this.patServices.length; i++) {
            if (i == this.patServices.length - 1) {
                this.PrintSerials += "" + this.patServices[i].serial
                this.printServiceCode += "" + this.patServices[i].serviceCode
                continue;
            } else (i)
            this.PrintSerials += " " + this.patServices[i].serial + ", "
            this.printServiceCode += " " + this.patServices[i].serviceCode + ", "
            this.counter++;
        }
        if (this.PatClaimsToExport) {
            this.LabResultparms.visitSerial = this.visitSerial;
            this.LabResultparms.printhistory = 2
        } else {
            this.LabResultparms.printSerials = this.PrintSerials;
            this.LabResultparms.visitSerial = this.patServices.length > 0 ? this.patServices[0].visitSerial : null;
            this.LabResultparms.printServiceCode = this.printServiceCode;
        }
        this.labTestService
            .getPatientTestResultPrintHistory(this.LabResultparms).pipe(
                takeUntil(this.ngUnsubscribe))
            .subscribe(res => {
                if (res) {

                    this.resetAfterServiceChange();
                    if (res.data && res.data.length > 0) {
                        this.patientData = res['data'][0];
                        this.PrintViewType = res['data'][0]['printViewType'] ? res['data'][0]['printViewType'] : 1
                        this.patServices = res['data'];
                    }
                    if (res.data1 && res.data1.length > 0) {
                        this.testData = res['data1'];

                        this.testData.sort((a, b) => (a.appearOrder > b.appearOrder ? 1 : -1));
                        this.testData.forEach(element => {
                            let sheetcomments: { commentDescAr: string; commentDescEn: string; sheetCode: number }[] = []
                            element.comments = sheetcomments
                            let str = element.refValue;
                            let strSheetValue = element.sheetValue
                            let strResultValue = element.resultValue
                            if (!str) {
                                str = "";
                            }
                            else {
                                let newstr = str.replace('&lt;', '<');
                                let fStr = newstr.replace('&gt;', '>');
                                element.refValue = fStr;
                            }
                            if (!strSheetValue) {
                                strSheetValue = "";
                            }
                            else {
                                let newstrSheetValue = strSheetValue.replace('&lt;', '<');
                                let fStrSheetValue = newstrSheetValue.replace('&gt;', '>');
                                element.sheetValue = fStrSheetValue;
                            }
                            if (!strResultValue) {
                                strResultValue = "";
                            }
                            else {
                                let newstrResultValue = strResultValue.replace('&lt;', '<');
                                let fstrResultValue = newstrResultValue.replace('&gt;', '>');
                                element.resultValue = fstrResultValue;
                            }
                        });
                        // sayed
                        this.makeTwoRowInOneRow(this.testData);
                        // this.getMappingData(this.testData)

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
                            if (this.PrintViewType == 2) {
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
                                        this.LabServiceCtg.push(filter);
                                    }
                                });
                                this.LabServiceCtg.forEach(element => {
                                    element['LabSheetCtg'] = this.LabSheetCtg.filter(item => item.serviceId == element.serviceId)
                                });
                            }
                            //5=mmc
                            if ([1, 3, 5].includes(this.PrintViewType)) {
                                this.testData.forEach(items => {
                                    if (!this.LabSheetCtg.find(ser => (ser.labSheetCtgCode === items.labSheetCtgCode))) {
                                        let filter = {}
                                        filter['labSheetCtgCode'] = items.labSheetCtgCode
                                        filter['labSheetCtgDescAr'] = items.labSheetCtgDescAr
                                        filter['labSheetCtgDescEn'] = items.labSheetCtgDescEn
                                        this.LabSheetCtg.push(filter);



                                    }

                                });

                            }
                        }
                        if (res.data5 && res.data5.length > 0) {
                            this.HistoryArr = this.labTestService.formateLabResultMatrix(res.data5, '');
                            this.labTestService.formateLabResultMatrix(res.data5, '')

                        }
                        if (res.data6 && res.data6.length > 0) {
                            this.timesArr = res.data6;
                        }

                    }
                }

                this.autoPrint = true;
                setTimeout(() => { if (this.printComponent) { this.printComponent.PrintView() } }, 200);
            });
    }
    makeTwoRowInOneRow(testData1: any[]) {
        this.MicroBilogyArray = testData1.filter(el => el.loinC_NUM == 'S_1');
        console.log(this.MicroBilogyArray);
        if (testData1[0]['multiPrintFlag'] == 2) {
            testData1 = testData1.filter(el => el.loinC_NUM != 'S_1');
        }
        let classfication = new Map<string, []>();
        classfication = this.groupBy(testData1, s => s.labSheetCtgDescAr);
        let keysoFClassification = Array.from(classfication.keys());
        this.testDataMultiRowInPrint = []
        keysoFClassification.forEach(el => {
            let testData = testData1.filter(el2 => el2['labSheetCtgDescAr'] === el)

            for (let x = 0; x < testData.length; x++) {
                if (!testData[x]['SPLICED'] && (testData[x]['multiPrintFlag'] == 1 || testData[x]['multiPrintFlag'] == 2)) {
                    testData[x]['SPLICED'] = 1
                    if (testData[x + 1]) {
                        testData[x + 1]['SPLICED'] = 1
                        testData[x].sheetNameAr2 = testData[x + 1].sheetNameAr
                        testData[x].sheetNameEn2 = testData[x + 1].sheetNameEn
                        testData[x].unitNameAr2 = testData[x + 1].unitNameAr
                        testData[x].sheetNameEn2 = testData[x + 1].sheetNameEn
                        testData[x].unitRefValueAr2 = testData[x + 1].unitRefValueAr
                        testData[x].refValue2 = testData[x + 1].refValue
                        testData[x].unitRefValueEn2 = testData[x + 1].unitRefValueEn
                        testData[x].unitRefValueEn2 = testData[x + 1].unitRefValueEn
                        testData[x].sheetValue2 = testData[x + 1].sheetValue
                        testData[x].abnormality2 = testData[x + 1].abnormality
                        testData[x].sheetOptionAr2 = testData[x + 1].sheetOptionAr
                        testData[x].resultValue2 = testData[x + 1].resultValue
                        this.testDataMultiRowInPrint.push(testData[x])
                    }
                    else {
                        this.testDataMultiRowInPrint.push(testData[x])
                    }
                }
            }
        });

        if (this.testDataMultiRowInPrint.length > 0) {
            this.getMappingData(this.testDataMultiRowInPrint)
        } else {
            this.getMappingData(this.testData)
        }
    }

    keysArr: any[] = [];
    obj: any;
    testDataMapWithClassifcation = new Map<string, []>();
    keysoFClassification: any[] = []
    getMappingData(testData: any[]) {
        this.obj = {};
        this.multiPrintFlag = testData[0].multiPrintFlag ? testData[0].multiPrintFlag : 0;
        this.hasCorrectedValue = testData[0].hasCorrectedValue ? testData[0].hasCorrectedValue : 0;
        this.testDataMap = this.groupBy(testData, pet => pet.servCategoryAr);
        this.testDataMap.forEach((value: [], key: string) => {//worked
            let classfication = new Map<string, []>();
            classfication = this.groupBy(testData, s => s.labSheetCtgDescAr);
            let keysoFClassification = Array.from(classfication.keys());
            this.obj[key] = [];
            keysoFClassification.forEach(element => {
                this.obj[key].push({ calssName: element, RowType: 1 });
                let arr = value.filter(xx => xx['labSheetCtgDescAr'] == element);
                this.obj[key] = this.obj[key].concat(arr)
                // this.obj[key].concat(arr );

            });
            this.keysArr = Object.keys(this.obj);
        });




        // this.testDataMap.forEach((value: [], key: string) => {//worked
        //     this.obj[key] = value;
        //     this.keysArr = Object.keys(this.obj);
        // });
    }

    // ---------------------------------------------------------------------------------------------------------------------------------
    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    PrintedCount() {
        const arr: RegPatService[] = [];
        for (let i = 0; i < this.patServices.length; i++) {
            this.patServices[i].printedCount = this.patServices[i].printedCount == null ? 1 : this.patServices[i].printedCount + 1;
            arr.push({
                serial: this.patServices[i].serial,
                servStatus: EnumPatServiceStatus.ResultPrinted,
                printedCount: this.patServices[i].printedCount
            });
        }

        this.labTestService
            .workFlowServicesChangeStatus(arr)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(res => {
                if (res.returnFlag == true) {
                    this.userSession.setSessionKey(
                        OrderPatientAction.Order_Update_Service_Status,
                        true
                    );
                    this.myStepFinished.emit(false);
                }
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
}



