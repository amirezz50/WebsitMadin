
import { Injectable } from '@angular/core';
import { CONFIG } from '../../shared/config';
import {  HttpGeneralService } from '../../shared/shared';


let dBRUserRUrl = CONFIG.baseUrls.dBRUserR;
export interface DbrSetupUser {

  code: number;
  descAr: string;
  descEn: string;
  rType: number;
  sort: number;

  //search parms
  fastSearchData: string;
  offset?: number;
  pageSize?: number;
  rowsCount?: number;
  dataStatus: number;

}
 

@Injectable()
export class DbrSetupUserService {
  constructor(
    private httpGeneralService: HttpGeneralService) { }

  getDbrSetupUser(code: number) {
    //return this.httpGeneralService.search(id, translationUrl)
    return this.httpGeneralService.get(code, dBRUserRUrl)
  }

  addDbrSetupUser(dbrSetupUser: DbrSetupUser[]) {
    return this.httpGeneralService.add(dbrSetupUser, dBRUserRUrl)
  }

  updateDbrSetupUser(dbrSetupUser: DbrSetupUser) {
    return this.httpGeneralService.update<DbrSetupUser>(dbrSetupUser.code, dbrSetupUser, dBRUserRUrl)
  }

  deleteDbrSetupUser(code: number) {
    return this.httpGeneralService.delete<number>(code, dBRUserRUrl)
  }

  searchDbrSetupUser(searchObj: DbrSetupUser) {
    return this.httpGeneralService.search(searchObj, dBRUserRUrl)
  }

}
