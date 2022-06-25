import { Injectable } from '@angular/core';
import {  HttpGeneralService } from '../../shared';
import { CONFIG } from '../../shared/config';
let hrSearchCretiriaUrl = CONFIG.baseUrls.hr;

export interface HrSearchCretiria {
  ngbFromDate:Date;
  ngbToDate:Date;
  empCode:number;
  jobType:number;
  hrManagementCode:number;
  department:number;
  contractType:number;
}

@Injectable()
export class HrSearchCretiriaService {
    constructor(private httpGeneralService: HttpGeneralService) {}

    searchEmp(_HrSearchCretiria :HrSearchCretiria){
      return this.httpGeneralService.add<HrSearchCretiria>(_HrSearchCretiria, `${hrSearchCretiriaUrl}/HrParmsCeriteriaFastSearch`);
    }

    getDate(dateType: number) {
      return this.httpGeneralService.getWith(`${hrSearchCretiriaUrl}/${dateType}/GetDateHrParmsCeriteriaFastSearch`);
  }
}

