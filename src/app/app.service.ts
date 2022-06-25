import { Injectable } from '@angular/core';
import { CONFIG } from './shared/config';
import { HttpGeneralService } from './shared/http-general.service';

let auth = CONFIG.baseUrls.auth;

@Injectable()
export class AppService {
    constructor(private httpGeneralService: HttpGeneralService) { }

    getNewSecLogin(id) {
        
        return this.httpGeneralService.get(id, auth);

    }
}
