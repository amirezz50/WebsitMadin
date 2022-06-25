import { Injectable } from '@angular/core';
import {  HttpGeneralService } from '../../shared/shared';
import { CONFIG } from '../../shared/config';
import { Patient } from '../../patient-portal/portal-login/portal-login-interface';

export interface PatientBloodTypeData {
  code: number;
  bloodGroup: number;
  rhValue: number;
}

@Injectable()
export class PateintBannerService {

  medicalSheetsUrl = '';

  constructor(
    private _httpGeneralService: HttpGeneralService
  ) {
    this.medicalSheetsUrl = CONFIG.baseUrls.medicalSheets;
  }

  bannerDataLoad(SheetParms: any) {
    return this._httpGeneralService.add(SheetParms, `${this.medicalSheetsUrl}/bannerDataLoad`);
  }
  updateBirthData(patientbirthdate: Patient) {
    return this._httpGeneralService.add(patientbirthdate, `${this.medicalSheetsUrl}/updateDirthData`);
  }

  getPatBlodTypeRHData(code: number) {
    return this._httpGeneralService.get(code, `${this.medicalSheetsUrl}/getPatBlodTypeAndRH`);
  }
 
  updatePatBloodType(_PatientBloodTypeData: PatientBloodTypeData) {
    return this._httpGeneralService.update<PatientBloodTypeData>(_PatientBloodTypeData.code, _PatientBloodTypeData, `${this.medicalSheetsUrl}/updatePatBlodTypeAndRH`);
  }
}
