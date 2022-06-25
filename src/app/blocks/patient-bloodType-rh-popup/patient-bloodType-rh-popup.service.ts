import { Injectable } from '@angular/core';
import { HttpGeneralService, HrParms } from '../../shared';
import { CONFIG } from '../../shared/config';
let medicalSheetsUrl = CONFIG.baseUrls.medicalSheets;
export interface PatientBloodTypeData {
  code: number;
  bloodGroup: number;
  rhValue: number;
}

@Injectable()
export class PatientBloodTypeService {

  constructor(private httpGeneralService: HttpGeneralService) { }

  getPatBlodTypeRHData(code: number) {
    return this.httpGeneralService.get(code, `${medicalSheetsUrl}/getPatBlodTypeAndRH`);
  }

  updatePatBloodType(_PatientBloodTypeData: PatientBloodTypeData) {
    return this.httpGeneralService.update<PatientBloodTypeData>(_PatientBloodTypeData.code, _PatientBloodTypeData, `${medicalSheetsUrl}/updatePatBlodTypeAndRH`);
  }

}
