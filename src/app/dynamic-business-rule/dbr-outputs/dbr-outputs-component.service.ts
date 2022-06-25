import { CONFIG } from './../../shared/config';

import { Injectable } from '@angular/core';
import {  HttpGeneralService } from '../../shared/shared';


let dBRDevROutputUrl = CONFIG.baseUrls.dBRDevROutput;
export interface DbrOutput {

  code: number;
  DescAr: string;
  DescEn: string;
  DBDesc: string; 

  //search parms
  fastSearchData: string;
  offset?: number;
  pageSize?: number;
  rowsCount?: number;
  dataStatus: number;

}


@Injectable()
export class DbrOutputsService {
  constructor(
    private httpGeneralService: HttpGeneralService) { }

  getDbrOutput(code: number) {
    //return this.httpGeneralService.search(id, translationUrl)
    return this.httpGeneralService.get(code, dBRDevROutputUrl)
  }

  addDbrOutput(dbrOutput: DbrOutput[]) {
    return this.httpGeneralService.add(dbrOutput, dBRDevROutputUrl)
  }

  updateDbrOutput(dbrOutput: DbrOutput) {
    return this.httpGeneralService.update<DbrOutput>(dbrOutput.code, dbrOutput, dBRDevROutputUrl)
  }

  deleteDbrOutput(code: number) {
    return this.httpGeneralService.delete<number>(code, dBRDevROutputUrl)
  }

  searchDbrOutput(searchObj: DbrOutput) {
    return this.httpGeneralService.search(searchObj, dBRDevROutputUrl)
  }

}
