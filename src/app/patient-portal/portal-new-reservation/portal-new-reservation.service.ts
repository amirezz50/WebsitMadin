import { Injectable } from '@angular/core';
import { CONFIG } from '../../shared/config';
import { HttpGeneralService, OutpatientParms } from '../../shared';
import { CallData, ComprehensiveRequestMaster, OrderDetails, OrderMaster, RegPatEpisode, RegPatService, RegPatVisit } from './portal-new-reservation-interface';
import { DocManagementTrans } from '../../docu-manage-new/image-upload-new';
import { TherapeuticCards } from '../portal-contracts';

const reservationVisitUrl = CONFIG.baseUrls.reservationVisit;



export interface IReservationFastSerachObj {
  specialityId?: number;
  reservationDate?: Date;
  resourceType?: number;
  entityType?: number;
  docCode?: number;
}


export interface IDoctorsCards {
  code: number;
  doctorNameAr: string;
  doctorNameEn: string;
  mobile: string;
  addressAr: string;
  addressEn: string;
  gender: number;
  genderAr: string;
  genderEn: string;
  nameAr: string;
  nameEn: string;
  docCatNameAr: string;
  docCatNameEn: string;
  specialtyNameAr: string;
  specialtyNameEn: string;
  dayAr: string;
  dayEn: string;
  weekDayCode: number;
  timesAvailable: IAvailableTimes[],
  timeNotAvailableMsg: string;
  shortTimes: IAvailableTimes[];
  _date: string;
  reservationDate: any;
  mobileOnPortal: any;
  timeFound: boolean;
}
export interface IAvailableTimes {
  startTime: string;
  resourceId: number;
  startTimeSlot: string;
  endTimeSlot: string;
  servStatus: any;
  scheduleTimeSerial: number;
  id: number;
}

export interface PatientReservation {
  therapeuticCards: TherapeuticCards;
  regPatVisit: RegPatVisit;
  regPatEpisode: RegPatEpisode;
  regPatServices: RegPatService[];
  visitDocuments: DocManagementTrans[];
  callData?: CallData;
  comprehensiveRequestMaster?: ComprehensiveRequestMaster,
  comprehensiveRequestDetail?: RegPatService[],
  orderMaster?: OrderMaster,
  OrderDetails?: OrderDetails[],
  RegPatServicesOrderDetail? : RegPatService[];

 
}


@Injectable({
  providedIn: 'root'
})
export class PortalNewReservationService {
  constructor(private _httpGeneralService: HttpGeneralService) { }

  getSpecialityServices(outpatientParms: OutpatientParms) {
    return this._httpGeneralService.add(outpatientParms, `${reservationVisitUrl}/SpecialityService`);
  }

  getSpecialityDoctors(data: IReservationFastSerachObj) {
    return this._httpGeneralService.post(data, `${reservationVisitUrl}/GetAvailableDoctorsBySpeciality`);
  }

  getDoctors(specialId: number) {
    return this._httpGeneralService.getWith(`${reservationVisitUrl}/Doctors/${specialId}`);
  }

  addPatientReservation(PatientReservation: PatientReservation) {
    return this._httpGeneralService.add(PatientReservation, `${reservationVisitUrl}`);
  }
  addBookCheckUp(regPatVisitVM: any) {
    return this._httpGeneralService.post(regPatVisitVM, `${reservationVisitUrl}/AddBookCheckUp`);
  }

} 
