import { Injectable } from '@angular/core';
import {  HttpGeneralService, StockModuleSettingsParms } from '../../shared';
import { CONFIG } from '../../shared/config';
let TherapeuticCardsUrl = CONFIG.baseUrls.TreatmentCards;
let stockTransUrl = CONFIG.baseUrls.StockTrans;

export interface TherapeuticCards {

    code: number;
    contractId?: number;
    contractNotRest?: number;
    cardNo?: string;
    patientCode: number;
    startDate?: any;
    endDate: any;
    policyNumber:string;
    eligibilityNo?: number;
    patSharingPercentFromCardFlag?:number; 
    inTransferBodiesSerial?:number; 
}

@Injectable()
export class PortalTherapeuticCardsService {
    constructor(private httpGeneralService: HttpGeneralService) { }

    getTherapeuticCards(id: number) {
        return this.httpGeneralService.get(id, TherapeuticCardsUrl)
    }

    deleteTherapeuticCards(therapeuticCards: TherapeuticCards) {
        return this.httpGeneralService.delete<number>(therapeuticCards.code, TherapeuticCardsUrl)
    }

    getStockModuleSettings(parms: StockModuleSettingsParms) {
        return this.httpGeneralService.add(parms, `${stockTransUrl}/GetStockModuleSettings`);
      }
}
