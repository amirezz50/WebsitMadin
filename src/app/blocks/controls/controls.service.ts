
import { of as observableOf, Observable } from 'rxjs';

import { map, catchError, finalize } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';

import { ExceptionService } from '../exception.service';
import { SpinnerService } from '../spinner';
import { CONFIG } from '../../shared/config';
import { HttpGeneralService } from '../../shared/http-general.service';
import { createAuthorizationHeader } from '../../shared/utility';

let linkDetailsUrl = CONFIG.baseUrls.linkDetails;

export interface AppCodes {
    code: number,
    nameEn: string;
    nameAr: string;
    iconName: string;
    cssClasses: string;
    serial: number;
    isLastStep?: boolean;
}
export enum AppCodeGroup {
    Buttons = 1,
    Steps = 2,
    Tabs = 3
}
export class ControlsParams {
    linkId: number;
    appCodeGroup: AppCodeGroup;
    required: boolean;
    appComponentName: string;
    category: string;

    constructor(_linkId: number, _appCodeGroup: AppCodeGroup, _required: boolean, _appComponentName?: string, _category?: string) {
        this.linkId = _linkId;
        this.appCodeGroup = _appCodeGroup;
        this.required = _required;
        this.appComponentName = _appComponentName;
        this.category = _category;
    }
}
@Injectable()
export class ControlsService {
    constructor(private _http: HttpClient,
        private _exceptionService: ExceptionService,
        private httpGeneralService: HttpGeneralService,
        //private httpGeneralService: HttpGeneralService,
        private _spinnerService: SpinnerService) {
        linkDetailsUrl = linkDetailsUrl.replace(CONFIG.Urls.apiUrlOld, CONFIG.Urls.apiUrlNew);
    }

    getControls(LinkId: number, controlType: AppCodeGroup, required: boolean) {
        //return this.httpGeneralService.getWith(`${linkDetailsUrl}/${LinkId}/${controlType}/${required}`);
        this._spinnerService.show();
        let headers = createAuthorizationHeader();
        let componentName = '0';
        let category = '0';
        let data: any = {}
        data.linkId = LinkId,
            data.appComponentName = componentName,
            data.category = category,
            data.controlType = controlType
            // // return this._http.get(`${linkDetailsUrl}/${LinkId}/${controlType}/${required}`, { headers: headers }).pipe(
            // //     map((response: HttpResponse<AppCodes[]>) => response),
            // //     catchError(this._exceptionService.catchBadResponse),
            // //     finalize(() => this._spinnerService.hide()),);
        //     return this._http.post<any>(data, `${linkDetailsUrl}/TabsPermissions`);

        return this.httpGeneralService.post<any>(data, `${linkDetailsUrl}/TabsPermissions`);
    }
    getComponentControls(componentName: string, controlType: AppCodeGroup, category: string) {
        let controls = this.checkComponentControls(componentName);
        if (controls) {
            return this.filterComponentControls(controls, controlType, category).pipe(map(res => {
                return res;
            }));

        }
        else {
            //return this.httpGeneralService.getWith(`${linkDetailsUrl}/${componentName}`);
            this._spinnerService.show();
            let headers = createAuthorizationHeader();
            return this._http.get(`${linkDetailsUrl}/${componentName}`, { headers: headers }).pipe(
                map((response: HttpResponse<any>) => {
                    let temp = response;
                    return temp;

                }),
                catchError(this._exceptionService.catchBadResponse),
                finalize(() => this._spinnerService.hide()));
        }
    }

    /** *********************************************************
    * check if component controls loaded  
    * @param componentName
    */
    checkComponentControls(componentName: string) {
        let ComponentControls = JSON.parse(sessionStorage.getItem(componentName));
        if (ComponentControls) {
            return ComponentControls;
        } else { return false }

    }
    /** *********************************************************
    * filter component controls  by type and category   
    * @param componentName
    */
    filterComponentControls(_ComponentControls: any[], controlType: AppCodeGroup, category: string) {
        let d = {};
        d['data'] = [];
        if (_ComponentControls && _ComponentControls.length > 0) {
            d['data'] = _ComponentControls.filter(e => { e.appCodeGroup == controlType && e.category == category });
            return observableOf(d);
        }
        return observableOf(d);
    }

}
