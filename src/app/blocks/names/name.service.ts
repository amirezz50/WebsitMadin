import { Injectable } from '@angular/core';
import { HttpGeneralService } from '../../shared';
import { CONFIG } from '../../shared/config';
let namesUrl = CONFIG.baseUrls.patients;
@Injectable()
export class NameService {
  constructor(private httpGeneralService: HttpGeneralService) { }
  findSimilarName(name: any) {
    return this.httpGeneralService.post(name, `${namesUrl}/searchSpSimilarName`);
  }


  findSimilarCallName(name: any) {
    return this.httpGeneralService.post(name, `${namesUrl}/searchSpSimilarcallName`);
  }
}

