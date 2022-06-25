  
import { Injectable } from '@angular/core';
import {  HttpGeneralService } from '../../shared/shared';
import { CONFIG } from '../../shared/config';


let DBRUserRDetailsUrl = CONFIG.baseUrls.dBRUserRDetails;
export interface DbrParmsUser {

  code: number;
  dBRUserRCode: number;
  dBRDevRParmsCode: number;
  //search parms
  fastSearchData: string;
  offset?: number;
  pageSize?: number;
  rowsCount?: number;
  dataStatus: number;

}

@Injectable()
export class DbrParmsUserService {
  constructor(
    private httpGeneralService: HttpGeneralService) { }

  getDbrParmsUser(code: number) {
    //return this.httpGeneralService.search(id, translationUrl)
    return this.httpGeneralService.get(code, DBRUserRDetailsUrl)
  }

  addDbrParmsUser(dbrParmsUser: DbrParmsUser[]) {
    return this.httpGeneralService.add(dbrParmsUser, DBRUserRDetailsUrl)
  }

  updateDbrParmsUser(dbrParmsUser: DbrParmsUser) {
    return this.httpGeneralService.update<DbrParmsUser>(dbrParmsUser.code, dbrParmsUser, DBRUserRDetailsUrl)
  }

  deleteDbrParmsUser(code: number) {
    return this.httpGeneralService.delete<number>(code, DBRUserRDetailsUrl)
  }

  searchDbrParmsUser(searchObj: DbrParmsUser) {
    return this.httpGeneralService.search(searchObj, DBRUserRDetailsUrl)
  }

}
