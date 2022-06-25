import { Injectable } from '@angular/core';
import { HttpGeneralService } from '../../shared/shared';
import { OutpatientParms } from '../../shared/search-params';
import { CONFIG } from '../../shared/config';

let schedulingUrl = CONFIG.baseUrls.scheduling;

@Injectable()
export class TimeSlotPickerService {

    constructor(
        private _httpGeneralService: HttpGeneralService
    ) { }

    GetTimeSlots(_outpatientParms: OutpatientParms) {
        return this._httpGeneralService.add(_outpatientParms, `${schedulingUrl}/OpGetFirstFreeDaySlots`)
    }
    GetMonthlyResourcesSlot(_outpatientParms: OutpatientParms) {
        return this._httpGeneralService.add(_outpatientParms, `${schedulingUrl}/GetMonthlyResourcesSlot`)
    }

}

export interface ITimeSlotObj {
    id?: number;
    resourceId?: number;
    startTimeSlot?: Date;
    endTimeSlot?: Date;
    parentId?: number;
    startTime?: string;
    endTime?: string;
    firstslot?: number;
    slotStatus?: number;
    slotToggle?: number;
    servStatus?: number;
    expectedStartTime?: Date;
    minutesPerSlot?: number;
    scheduleTimeSerial?: number;
    patCode?: number;
    gender?: number;
    dateOnly?: string;
    genDaysNameAr?: string;
    genDaysNameEn?: string;

    lastSlotId?: number;
}