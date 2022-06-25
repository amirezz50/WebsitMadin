import { Injectable } from "@angular/core";
import { CONFIG } from "../../shared/config";
import { HttpGeneralService } from "../../shared/http-general.service";


let medicalsDataUrl = CONFIG.baseUrls.medicalsData;
const labTestUrl = CONFIG.baseUrls.labTest;
const labServiceSetupUrl = CONFIG.baseUrls.labServiceSetup;
const supplierServicesUrl = CONFIG.baseUrls.supplierServices;
const reservationVisitUrl = CONFIG.baseUrls.reservationVisit;
@Injectable()
export class LabTestService {

    constructor(private httpGenSer: HttpGeneralService) { }

    //#region Unit

    /**--------------------------------------------------------------------
     * load patient services result
     * @param parms
     */
    // getConfirmedPatients(parms: PatientOrderParms) {
    //     return this.orderingSer.getConfirmedPatients(parms);
    // }

    /**--------------------------------------------------------------------
     * load patient services result
     * @param parms
     */
    // getConfirmedPatientServices(parms: PatientOrderParms) {
    //     return this.orderingSer.getConfirmedPatientServices(parms);
    // }

    /**--------------------------------------------------------------------
     * load all sheets for current service
     * @param serviceCode
     */
    getLabTestSheets(serviceSheets: any) {
        return this.httpGenSer.post(serviceSheets, `${labTestUrl}/TestSheets`);
    }

    /**--------------------------------------------------------------------
     * save lab result
     * @param serviceSheets
     */
    resultAdd(serviceSheets: any[]) {
        return this.httpGenSer.addCollection(serviceSheets, `${labTestUrl}/Result/Add`);
    }
    getDoctors(MedicalType: number, DefaultMedTypeDoc: number) {
        return this.httpGenSer.getWith(`${medicalsDataUrl}/DefaultDoctors/${MedicalType}/${DefaultMedTypeDoc}`)
    }
    /**--------------------------------------------------------------------
    * edit lab result
    * @param serviceSheets
    */
    resultEdit(serviceSheets: any[]) {
        return this.httpGenSer.addCollection(serviceSheets, `${labTestUrl}/Result/Review/Add`);
    }
    /**
     * used to cancel any step in workflow
     * @param result must conatin regpatservieserial
     */
    resultCancelStep(result: any) {
        return this.httpGenSer.post(result, `${labTestUrl}/Result/CancelStep`);
    }
    /**--------------------------------------------------------------------
     * load result for patient service for review
     * @param patServiceSerial
     */
    getPatientTestResult(patServiceSerial: number) {
        return this.httpGenSer.get(patServiceSerial, `${labTestUrl}/PatientTestResult`);
    }

    /**--------------------------------------------------------------------
     * load result for patient service for print
     * @param patServiceSerial
     */
    // getPatientTestResultPrint(printSerials: String) {
    //     return this.httpGenSer.getWith(`${labTestUrl}/Result/Print/${printSerials}`);
    // }
    getPatientTestResultPrintHistory(newStatus: any) {
        // return this.httpGeneralService.add(newStatus, `${radOrderingUrl}/WorkFlow`);
        return this.httpGenSer.post(newStatus, `${labTestUrl}/Result/Print/history`);
    }
    getPatientTestResultPatient(newStatus: any) {
        // return this.httpGeneralService.add(newStatus, `${radOrderingUrl}/WorkFlow`);
        return this.httpGenSer.post(newStatus, `${labTestUrl}/Result/Print/Patient`);
    }
    getBarcodeImage(patServiceSerial: number): any {
        return this.httpGenSer.getWith(`${labTestUrl}/Barcode/${patServiceSerial}`);
    }

    getBarcodeImageForServices(patServices: any[]): any {
        return this.httpGenSer.addCollection(patServices, `${labTestUrl}/Barcode/Services`);
    }
    getLabSampleColect(patServices: any[]): any {
        return this.httpGenSer.addCollection(patServices, `${labTestUrl}/getLabSampleColect`);
    }
    getPatientSampleColect(parms: any): any {
        return this.httpGenSer.post(parms, `${labTestUrl}/getPatientSampleColect`);
    }


    regPatServiceWorkFlowAdd(newStatus: any) {
        // return this.httpGeneralService.add(newStatus, `${radOrderingUrl}/WorkFlow`);
        return this.httpGenSer.add(newStatus, `${labTestUrl}/WorkFlow/ChangeStatus`);
    }

    workFlowServicesChangeStatus(newStatus: any[]) {
        // return this.httpGeneralService.add(newStatus, `${radOrderingUrl}/WorkFlow`);
        return this.httpGenSer.addCollection(newStatus, `${labTestUrl}/WorkFlow/ChangeStatus/Services`);
    }

    regPatServiceWorkFlowSearch(newStatus: any) {
        return this.httpGenSer.post(newStatus, `${labTestUrl}/WorkFlow/GetStatus`);
    }

    //#region service supplier

    getOutsideLabData(outSideSupplier: any) {
        return this.httpGenSer.post(outSideSupplier, `${supplierServicesUrl}/Transactions`);
    }

    addSendToOutsideLabData(outSideSupplier: any[]) {
        return this.httpGenSer.addCollection(outSideSupplier, `${supplierServicesUrl}/Transactions/collection`)
    }
    UpdateRegPatService(regPatService: any) {
        return this.httpGenSer.update<any>(regPatService.serial, regPatService, labServiceSetupUrl);
    }
    //#endregion
    labsamplesave(labsample: any) {
        return this.httpGenSer.add<any>(labsample, `${labTestUrl}/WorkFlow/any`);
    }
    addlabsample(labsample: any[]) {
        // return this.httpGeneralService.add(newStatus, `${radOrderingUrl}/WorkFlow`);
        return this.httpGenSer.addCollection(labsample, `${labTestUrl}/WorkFlow/any`);
    }
    addlabRecivesample(labsample: any[]) {
        // return this.httpGeneralService.add(newStatus, `${radOrderingUrl}/WorkFlow`);
        return this.httpGenSer.addCollection(labsample, `${labTestUrl}/WorkFlow/addlabRecivesample`);
    }

    anyReceive(labsample: any[]) {
        return this.httpGenSer.addCollection(labsample, `${labTestUrl}/anyReceive`);
    }
    //#endregion Receving and Examining covid 19     sayed
    addlabCovidRecivesample(labsample: any) {
        return this.httpGenSer.add(labsample, `${labTestUrl}/addlabCovidRecivesample`);
    }
    addlabCovidResultSample(any : any []){
        return this.httpGenSer.addCollection(any , `${labTestUrl}/addlabCovidResultSample`)
    }
    deleteany( serial : number ){
        return this.httpGenSer.delete<number>(serial , `${labTestUrl}/WorkFlow/deleteany` )
    }
    getany(any: any) {
        return this.httpGenSer.add(any, `${labTestUrl}/getany`)

    }
    getlabPatResult(labPatResult: any) {
        return this.httpGenSer.add(labPatResult, `${labTestUrl}/getlabPatResult`)

    }
    getanyBarCodeData(Barcodes:  any[]) {
        return this.httpGenSer.add(Barcodes, `${labTestUrl}/Barcode/getanyBarCodeData`)
    }

    changeServiceStatus(selectedService: any) {
        return this.httpGenSer.add(selectedService, `${reservationVisitUrl}/ChangeStatus`);
    }
    //#endregion

    formateLabResultMatrix(Item: any[], options: any) {

        var HashMAp = {};
        let filterdate = []
        let filtersheetsArr = []
        let filterservices = []
        //////////////////////////----------- dates ----------
        var datesArr = Item.map(res => {
            let obj: any = {
                resultWriteDate: res.resultWriteDate,
                regPatServiceSerial: res.regPatServiceSerial,
                serviceCode: res.serviceCode,
                serviceNameAr: res.serviceNameAr
            };
            return obj
        });
        datesArr.forEach(element => {
            if (!filterdate.find(ser => ser.resultWriteDate === element.resultWriteDate)) {
                filterdate.push(element)
            }
        });
        datesArr = filterdate
        ///////////////////////////--------- sheets ---------------------------------------------------
        var sheetsArr = Item.map(res => {
            let obj: any = {
                sheetCode: res.sheetCode,
                sheetNameAr: res.sheetNameAr,
                serviceCode: res.serviceCode,
                serviceNameAr: res.serviceNameAr,
            };
            return obj
        });
        sheetsArr.forEach(element => {
            let count = 0
            if (!filtersheetsArr.find(ser => (ser.serviceCode === element.serviceCode) && (ser.sheetCode === element.sheetCode))) {
                filtersheetsArr.push(element)
            }
        });

        sheetsArr = filtersheetsArr

        ///////////////////////////--------- services ---------------------------------------------------
        var services = Item.map(res => {
            let obj: any = {
                serviceCode: res.serviceCode,
                serviceNameAr: res.serviceNameAr
            };
            return obj
        });
        services.forEach(element => {
            if (!filterservices.find(ser => (ser.serviceCode === element.serviceCode) && (ser.sheetCode === element.sheetCode))) {
                filterservices.push(element)
            }
        });
        services = filterservices
        // // // // // // // ------------------------------------------------------------
        // var services = Item.map(res => res.serviceCode);
        // services = services.filter((v, i, a) => a.indexOf(v) === i);

        Item.forEach(el => {
            //HashMAp[this.getformatedDate( el) +'_' +  el['sheetCode'] +'_' +  el['serviceCode']] = el.resultValue
            HashMAp[el['resultWriteDate'] + '_' + el['sheetNameAr']] = el.resultValue
        });
        return { headersLev1: services, headersLev2: sheetsArr, rows: datesArr, hashMap: HashMAp }
    }
}
