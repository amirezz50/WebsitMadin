import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CONFIG } from '../../shared/config';
import { HttpGeneralService } from '../../shared/http-general.service';

let countsDashBoardUrl = CONFIG.baseUrls.common;


@Injectable()
export class CountsDashBoardService {
  constructor(private _httpGeneralService: HttpGeneralService){
    }
    getCounts(parms: any) {
      return this._httpGeneralService.add( parms , `${countsDashBoardUrl}/GetCountsDashBoard`);

  }
    
    useRestApi() {
      return this._httpGeneralService.useRestApi('');

    }
}
