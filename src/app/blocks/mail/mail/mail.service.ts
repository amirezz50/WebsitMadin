import { Injectable } from '@angular/core';
import { CONFIG } from '../../../shared/config';
import { HttpGeneralService } from '../../../shared';
let commonsUrl = CONFIG.baseUrls.common;
@Injectable()
export class MailService {
    constructor(private httpGeneralService: HttpGeneralService) {}
    sentEmail(file: any) {
      return this.httpGeneralService.post(file , `${commonsUrl}/attachFile`);
    }
}

