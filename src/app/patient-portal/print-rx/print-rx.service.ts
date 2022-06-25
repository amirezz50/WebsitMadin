import { Injectable } from '@angular/core';
import { CONFIG } from '../../shared/config';
import { HttpGeneralService, OutpatientParms, StockParms } from '../../shared';
let rxUrl = CONFIG.baseUrls.rx;

@Injectable({
  providedIn: 'root'
})
export class PrintRxService {
  constructor(private httpGeneralService: HttpGeneralService) { }

  rxAllRxMediactionsReport(_StockParms: StockParms) {
    return this.httpGeneralService.add<StockParms>(_StockParms, `${rxUrl}/getrxReport`);
  }
}
