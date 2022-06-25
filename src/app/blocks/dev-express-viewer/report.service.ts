import {Injectable} from '@angular/core';

import {  HttpGeneralService } from '../../shared/shared';
import { CONFIG } from '../../shared/config';


let reportUrl = CONFIG.baseUrls.reportUrl;
@Injectable()
export class ReportService {

    constructor(private httpGeneralService: HttpGeneralService) { }


    getReportAppCodes(linkId :number) {
        return this.httpGeneralService.get(linkId, reportUrl);
    }
    getReportsBySecLogin() {
      return this.httpGeneralService.getWith(reportUrl);
    }
}
