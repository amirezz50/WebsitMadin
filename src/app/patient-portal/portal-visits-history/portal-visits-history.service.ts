import { Injectable } from '@angular/core';
import { CONFIG } from '../../shared/config';
import { HttpGeneralService, OutpatientParms, StockParms } from '../../shared';

let ApiUrl = CONFIG.baseUrls.emrSheets;
let rxUrl = CONFIG.baseUrls.rx;

@Injectable({
  providedIn: 'root'
})
export class PortalVisitsHistoryService {

  constructor(private httpGeneralService: HttpGeneralService) { }

  getAllPatientVisits(data: OutpatientParms) {
    return this.httpGeneralService.post(data, `${ApiUrl}/getEmrAllPatVisits`);
  }

  getrxHistory(_StockParms: StockParms) {
    return this.httpGeneralService.add<StockParms>(_StockParms, `${rxUrl}/getPortalByVisitSerial`);
  }
}
