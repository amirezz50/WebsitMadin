import { Injectable } from '@angular/core';
import { HttpGeneralService } from '../../shared';
import { CONFIG } from '../../shared/config';
let PortalPatientDashboardUrl = CONFIG.baseUrls.PortalPatientDashboard;

@Injectable({
  providedIn: 'root'
})
export class PortalHomeService {

  constructor(private httpGeneralService: HttpGeneralService) { }

  /////////////////////////////////////////////////#-----> amer hashima <------#//////////////////////////////
  getPortalPatientDashboard(portalPatientDashboard: any) {
    return this.httpGeneralService.add(portalPatientDashboard, `${PortalPatientDashboardUrl}/getPortalPatientDashboardUrl`);
  }

}

