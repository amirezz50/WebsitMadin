import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CONFIG } from "../../shared/config";
import { HttpGeneralService } from '../../shared';
import { DocManagementTrans } from "../image-upload-new";
import { createAuthorizationHeader } from "../../shared/utility";
let DocManagmentUrl = CONFIG.baseUrls.DocManagment;

@Injectable()
export class imageUploadNewService {

    constructor(
        private _httpGeneralService: HttpGeneralService,
        private _http: HttpClient, ) { }

    saveImage(DocManagementTrans: DocManagementTrans) {
        return this._httpGeneralService.add(DocManagementTrans, `${DocManagmentUrl}/SaveImage`);
    }

    GetImage(DocManagementTrans: DocManagementTrans) {
        // return this._httpGeneralService.add(DocManagementTrans, `${DocManagmentUrl}/GetImage`);
        let headers = createAuthorizationHeader();
        DocManagmentUrl = this._httpGeneralService.modifyUrl(DocManagmentUrl);

        return `${this._httpGeneralService.apiUrlNew + DocManagmentUrl}/GetImage?type=${DocManagementTrans.docManagementSerial}&id=${DocManagementTrans.tableRowId}&random=${Math.random()}`
        //return this._http.get(, { headers: headers })
    }

    GetImagePth(DocManagementTrans: DocManagementTrans){
        return this._httpGeneralService.add(DocManagementTrans, `${DocManagmentUrl}/GetImagePath`);
    }

    // dealsSearch(dealParms: PricingParms) {
    //     return this._httpGeneralService.add(dealParms, `${dealsSetupUrl}/Search`);
    // }

    // addDealsSetup(dealData: DealsSetup) {
    //     return this._httpGeneralService.add(dealData, dealsSetupUrl);
    // }

    // getDealPriceLists(id:number) {
    //     return this._httpGeneralService.get(id, dealsSetupUrl);
    // }

    // dealsComponentsLoad(dealParms: PricingParms) {
    //     return this._httpGeneralService.add(dealParms, `${dealsSetupUrl}/DealsComponents`);
    // }

    // addDeals(deals:DealsTrans[]){
    //      return this._httpGeneralService.addCollection(deals, `${dealsSetupUrl}/DealsTrans`);
    // }
}