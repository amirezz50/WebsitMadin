import { Injectable } from '@angular/core';
import { HttpGeneralService } from '../shared';
import { CONFIG } from '../shared/config';

let medicalSheetsUrl = CONFIG.baseUrls.medicalSheets;

let ordersUrl = CONFIG.baseUrls.orders;
let ordering = CONFIG.baseUrls.ordering;
@Injectable()
export class ServiceHistoryService {
  constructor(private httpGeneralService: HttpGeneralService) { }

  patServicesLoad(_regPat: any) {
    return this.httpGeneralService.add(_regPat, `${ordersUrl}/patServicesLoad`);
  }
  portalPatServicesLoad(_regPat: any) {
    return this.httpGeneralService.add(_regPat, `${ordersUrl}/portalPatServicesLoad`);
  }
  PortalRegPatServiceExaminationLoad(_regPat: any) {
    return this.httpGeneralService.add(_regPat, `${ordersUrl}/PortalRegPatServiceExaminationLoad`);
  }
  
  RegEmergancyTransferLoad(_regPat: any) {
    return this.httpGeneralService.add(_regPat, `${ordersUrl}/RegEmergancyTransferLoad`);
  }
  UpdateSerivceMedicalStep(_regPat: any[]) {
    return this.httpGeneralService.add(_regPat, `${ordering}/UpdateSerivceMedicalStep`);
  }
  writtenReportsSearch(searchParms: any) {
    return this.httpGeneralService.post(searchParms, `${medicalSheetsUrl}/reports/WrittenReportsLoad`);
  }

}
