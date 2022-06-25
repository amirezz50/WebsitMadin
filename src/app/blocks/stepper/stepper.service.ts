
import {of as observableOf,  Observable, Subject } from 'rxjs';

import {map} from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { ExceptionService } from '../exception.service';
import { SpinnerService } from '../spinner';
import { AppCodeGroup } from '../../shared';
import { CONFIG } from './../../shared/config';
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
    visible?: number;
    appCode?: number;
    isDone?: boolean;
    isActive?: boolean;
    isValid?: boolean;
    isFirstTime?: boolean;
    isLastStep?: boolean;

}

@Injectable()
export class StepperService {
  medicalSheetsUrl = '';
  
    constructor(private _http: HttpClient,
        private _exceptionService: ExceptionService,
        private _spinnerService: SpinnerService,
        private  _httpGeneralService: HttpGeneralService
) {
      linkDetailsUrl =  linkDetailsUrl.replace(CONFIG.Urls.apiUrlOld, CONFIG.Urls.apiUrlNew);
      this.medicalSheetsUrl =CONFIG.baseUrls.medicalSheets;
  }
    
    
    getControls(LinkId: number, controlType: AppCodeGroup, required: boolean, componentName: string, category: string) {
      if (componentName == undefined) componentName = '0';
      if (category == undefined) category = '0';
      
      return this._httpGeneralService.getWith(`${linkDetailsUrl}/${LinkId}/StepperPermissions/${controlType}/${componentName}/${category}`);
    }

    getComponentControls(componentName: string, controlType: AppCodeGroup, category: string) {
      let controls = this.checkComponentControls(componentName);
      if (controls) {
        return this.filterComponentControls(controls, controlType, category).pipe(map(res => {
          return res;
        }));

      }
      else {
        return this._httpGeneralService.getWith(`${linkDetailsUrl}/${componentName}`);
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
    /** *********************************************************
      * filter component controls  by  category   
      * @param componentName
      */
    filterByCategory(_ComponentControls: any[], category: string, linkId: number) {
      let d = [];
      if (_ComponentControls && _ComponentControls.length > 0 && category != (undefined || null) && category !='' && linkId != (undefined || null) ) {
        d = _ComponentControls.filter(e => {
            return  e.category == category && e.linkId == linkId
        });
        return d
      }
      return _ComponentControls;
    }
    
}
