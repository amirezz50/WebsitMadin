import { Injectable } from '@angular/core';
import { HttpGeneralService, OutpatientParms } from '../../shared';
import { CONFIG } from '../../shared/config';



export interface Medical {
  empId: number;
  branchId: number;
  medicalType: number;
  speciality: number;
  category: number;
  showOper: boolean;
  showCathe: boolean;
  showEndo: boolean;
  catheter: boolean,
  dialysis: boolean,
  physicaltherapy: boolean,
  binoculars: boolean,
  surgery: boolean
  specialityNameEn: string;
  specialityNameAr: string;
  categoryNameAr: string;
  categoryNameEn: string;
  medicalTypeEn: string;
  medicalTypeAr: string;
  nameAr: string;
  nameEn: string;
  code: number;
  fullnameAr: string;
  fullnameEn: string;
  defaultMedTypeDoc: boolean;
  consultantOfExamService: boolean;
  visiableOnPortal: number;
  mobileOnPortal?: string;
  portalUnique?: boolean;
  practionerlicense?: string
}

const ApiUrl = CONFIG.baseUrls.regPatVisit;
const medicalsDataUrl = CONFIG.baseUrls.medicalsData;

@Injectable({
  providedIn: 'root'
})
export class PortalReservationsHistoryService {

  constructor(private httpGeneralService: HttpGeneralService) { }

  getAllPatientReservationsHistory(data: OutpatientParms) {
    return this.httpGeneralService.post(data, `${ApiUrl}/PortalGetPatReservationsHistory`);
  }

  getUniquePortalDoctors(medical: Medical) {
    return this.httpGeneralService.add<Medical>(medical, `${medicalsDataUrl}/PortalUniqueDoctors`).toPromise();
  }
}
