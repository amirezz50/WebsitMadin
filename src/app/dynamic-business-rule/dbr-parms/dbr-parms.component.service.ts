
import { Injectable } from '@angular/core';
import {  HttpGeneralService , DBRParms } from '../../shared/shared';

import { CONFIG } from '../../shared/config';

let dBRDevRParmsUrl = CONFIG.baseUrls.dBRDevRParms;
export interface DbrParms {

  code: number;
  searchAppCode: number;
  sort: number;
  type: number;
  descAr: string;
  descEn: string;


  //search parms
  fastSearchData: string;
  offset?: number;
  pageSize?: number;
  rowsCount?: number;
  dataStatus: number;

}

    @Injectable()
    export class DbrParmsService {
      constructor(
        private httpGeneralService: HttpGeneralService) { }
      //getDbrParms(code: number) {
      //  //return this.httpGeneralService.search(id, translationUrl)
      //  return this.httpGeneralService.get(code, dBRDevRParmsUrl);
      //}

      getDbrParms(dBRParms: number) {
      
        return this.httpGeneralService.get(dBRParms, dBRDevRParmsUrl);
      }

      addDbrParms(dbrParms: DbrParms[]) {
        return this.httpGeneralService.add(dbrParms, dBRDevRParmsUrl)
      }

      updateDbrParms(dbrParms: DbrParms) {
        return this.httpGeneralService.update<DbrParms>(dbrParms.code, dbrParms, dBRDevRParmsUrl)
      }

      deleteDbrParms(code: number) {
        return this.httpGeneralService.delete<number>(code, dBRDevRParmsUrl)
      }

      searchDbrParms(searchObj: DbrParms) {
        return this.httpGeneralService.search(searchObj, dBRDevRParmsUrl)
      }

    }
