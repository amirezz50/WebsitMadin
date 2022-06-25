
import { Injectable } from '@angular/core';
import {  HttpGeneralService } from '../../shared/shared';

import { CONFIG } from '../../shared/config';

let dBRDevRUrl = CONFIG.baseUrls.dBRDevR;
export interface DbrSetup {

  code: number;
  nameAr: string;
  nameEN: string;

  //search parms
  fastSearchData: string;
  offset?: number;
  pageSize?: number;
  rowsCount?: number;
  dataStatus: number;

}


    @Injectable()
    export class DprSetupService {
      constructor(
        private httpGeneralService: HttpGeneralService) { }

      getDbrSetup(code: number) {
        //return this.httpGeneralService.search(id, translationUrl)
        return this.httpGeneralService.get(code, dBRDevRUrl)
      }

      addDbrSetup(dbrSetup: DbrSetup[]) {
        return this.httpGeneralService.add(dbrSetup, dBRDevRUrl)
      }

      updateDbrSetup(dbrSetup: DbrSetup) {
        return this.httpGeneralService.update<DbrSetup>(dbrSetup.code, dbrSetup, dBRDevRUrl)
      }

      deleteDbrSetup(code: number) {
        return this.httpGeneralService.delete<number>(code, dBRDevRUrl)
      }

      searchDbrSetup(searchObj: DbrSetup) {
        return this.httpGeneralService.search(searchObj, dBRDevRUrl)
      }

    }
