import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CONFIG } from './config';

@Injectable()
export class SharedDateService {
    commonUrl: string = CONFIG.baseUrls.common.replace(CONFIG.Urls.apiUrlOld, CONFIG.Urls.apiUrlNew);
    SelectedAllServices = [];
    constructor(private _http: HttpClient) {
    }

    todayFromServer: Date;

    // observable for common controller
    day$ = this._http.get(`${this.commonUrl}/Today/`).pipe(map(res => res));

    /**
     * subscribe for day$ observable
     */
    subscribe() {
        this.day$.subscribe((day: Date) => {
            this.todayFromServer = day;
        }, err => console.log('from shared date call server fun', err)
            , () => {
                return this.convertFromDateToNgBsObject(this.todayFromServer);
            });
    }

    getTodayFromServer() {
        return this.subscribe();
    }

    /*************************************************************
     * used to get date object from ng bootstrap datepicker object
     * @param oldDate
     */
    convertFromNgBsToDate(oldDate: any) {
        if (!oldDate || !oldDate.year || oldDate.year == undefined || oldDate.year == null)
            return oldDate;
        return new Date(oldDate.year, oldDate.month - 1, oldDate.day);
    }



    //////////convert from bs to date
    ///////
    convertFromBsToDateTime(time: any,acceptZeroTime:boolean = false) {
        let date = new Date();
        date.setHours(time.hour, time.minute);
        if(acceptZeroTime){
            date["AcceptZeroTime"] = 1 ;
            date["AcceptZeroTime"] = 1;
        }
        return (date);
    }

    convertFromBsToDateTimeObj(time: any) {

        let date = new Date(time);
        if (date && time) {

            return {
                hour: date.getHours(),
                minute: date.getMinutes(),
            };
        }
        else {
            return;
        }
    }
    /**************************************************************
     * used to get ng bootstrap datepicker object  from date object
     * take date object in string format or date format
     * @param oldDate
     */
    convertFromDateToNgBsObject(oldDate: any) {
        return getNgBsObj(oldDate);
    }

    // saveClickEvent = new EventEmitter();
    // saveSub: Subscription;

    // emitSaveClick() {
    //     this.saveClickEvent.emit();
    // }
}


/*************************************************************
     * used to get date object from ng bootstrap datepicker object
     * @param oldDate
     */
export function getDateObj(oldDate: any, time?: any): any {
    let _datetime: Date = null;
    if (!oldDate || !oldDate.year || oldDate.year == undefined || oldDate.year == null)
        return oldDate;


    _datetime = new Date(oldDate.year, oldDate.month - 1, oldDate.day);
    if (time && (time['hour'] || time['minute'])) {
        _datetime.setHours(time['hour'], time['minute']);
    }
    return _datetime;
}

export function getNgbTime(time: any): any {
    let date = new Date(time);
    if (date && time) {
        return {
            hour: date.getHours(),
            minute: date.getMinutes(),
        };
    }
    else {
        return;
    }
}

/**************************************************************
     * used to get ng bootstrap datepicker object  from date object
     * take date object in string format or date format
     * @param oldDate
     */
export function getNgBsObj(oldDate: any): any {

    let dateObj = new Date(oldDate);
    if (dateObj && oldDate) {
        let dateStr = dateObj.toJSON();
        const year = dateStr.substr(0, 4)
        const month = dateStr.substr(5, 2)
        const day = dateStr.substr(8, 2);
        if (isNumber(year) && isNumber(month) && isNumber(day)) {
            return {
                year: +year,
                month: +month,
                day: +day,
            };
        }
        else {
            return null;
        }

    }
}

export function isToday(date): boolean {
    const _date = new Date(date);
    const today = new Date();
    return _date.getDate() == today.getDate() &&
        _date.getMonth() == today.getMonth() &&
        _date.getFullYear() == today.getFullYear()
}


export function isNumber(value: any): value is number {
    return !isNaN(toInteger(value));
}
export function toInteger(value: any): number {
    return parseInt(`${value}`, 10);
}

export function calculateBmi(height: number, weight: number): any {
    height = height / 100; // height in cm
    let Bmi = (weight / (height ** 2)).toFixed(3);
    return Bmi;
}



export function GenerateMedDoseDesc({ dosTypeAr, name, doseQty, dosTypeEn, freqQty, periodQty, routeAdminAr, routeAdminEn, freqType,
    periodType, routeAdminCode, rxNotes,isActiveMaterial, identifierAr, identifierEn }, type: 'ar' | 'en'): { ar: string, en: string } {
          
    var t = '';//name;
    var e = doseQty;
    var x = type == 'ar' ? dosTypeAr : dosTypeEn;
    var s = periodQty;
    var y = type == 'ar' ? routeAdminAr : routeAdminEn;
    var freqQty = freqQty > 0 ? freqQty : 0;
    var identifierAr = identifierAr;
    var identifierEn = identifierEn;
    var isActiveMaterial = isActiveMaterial;
    var xEn='';
    var xAr='';
    var freqName: { ar?: string, en?: string } = { ar: '', en: '' };
    var freqNames:{ ar?: string, en?: string } = { ar: '', en: '' };
 
    if (freqType == 3) {
        // freqQty = freqQty * 1;
        freqName = {
            ar: 'يوم',
            en: 'Day'
        };
        freqNames = {
            ar: 'أيام',
            en: 'Days'
        };
    }
    if (freqType == 4) {
        // freqQty = freqQty * 7;
        freqName = {
            ar: 'اسبوع',
            en: 'Week'
        };
        freqNames = {
            ar: 'أسابيع',
            en: 'Weeks'
        };
    }
    if (freqType == 5) {
        // freqQty = freqQty * 30;
        freqName = {
            ar: 'شهر',
            en: 'Month'
        }
        freqNames = {
            ar: 'شهور',
            en: 'Months'
        };
    }
    var periodQtyd = periodQty > 0 ? periodQty : 0;
    var periodName: { ar?: string, en?: string } = { ar: '', en: '' };
    var periodNames: { ar?: string, en?: string } = { ar: '', en: '' };
    if (periodType == 3) {
        // periodQtyd = periodQty * 1;
        periodName = {
            ar: 'يوم',
            en: 'Day'
        };
        periodNames = {
            ar: 'أيام',
            en: 'Days'
        };
    }
    if (periodType == 4) {
        // periodQtyd = periodQty * 7;
        periodName.ar = 'اسبوع';
        periodName.en = 'Week';
        periodNames = {
            ar: 'أسابيع',
            en: 'Weeks'
        };
    }
    if (periodType == 5) {
        // periodQtyd = periodQty * 30;
        periodName = {
            ar: 'شهر',
            en: 'Month'
        };
        periodNames = {
            ar: 'شهور',
            en: 'Months'
        };
    }
    if (isActiveMaterial == 1) {
        xEn = ''
        xAr = ''
    }
    else {
    xEn = 'By '
    xAr = 'ب'
    }
    console.log("activematerial:" + isActiveMaterial + "xEn:" + xEn + "xAr:" + xAr);

    if (s == 1 || s == 2)
        return {
            ar: periodType > 2 ?
                `${t} ${e} ${dosTypeAr}   ${identifierAr ? 'لكل ' + identifierAr : ''}  كل   ${periodQtyd} ${periodName.ar}  ${freqQty ? 'لمدة ' + freqQty + ' ' + freqName.ar : ''} 
                ${routeAdminAr ? 'طريقه التناول ' + routeAdminAr : ''} ${rxNotes ? '_' + rxNotes : ''}` :
                `${t} ${e} ${dosTypeAr}   ${identifierAr ? 'لكل ' + identifierAr : ''}  كل ${s} ساعة   ${freqQty ? 'لمدة ' + freqQty + ' ' + freqName.ar : ''} 
                ${routeAdminAr ? 'طريقه التناول ' + routeAdminAr : ''} ${rxNotes ? '_' + rxNotes : ''}`,

            en: periodType > 2 ?
                `${t} ${e} ${dosTypeEn} ${identifierAr ? 'For Every ' + identifierEn : ''}  Every ${periodQtyd} ${periodName.en}   ${freqQty ? 'For ' + freqQty + ' ' + freqName.en : ''} 
                 ${rxNotes ? '_' + rxNotes : ''}` :
                `${t} ${e} ${dosTypeEn} ${identifierAr ? 'For Every ' + identifierEn : ''} Every ${s} Hour    ${freqQty ? 'For ' + freqQty + ' ' + freqName.en : ''}
                  ${rxNotes ? '_' + rxNotes : ''}`
        };

    if (s > 2)
        return {
            ar: periodType > 2 ?
                `${t} ${e} ${dosTypeAr}  ${identifierAr ? 'لكل ' + identifierAr : ''} كل ${periodQtyd} ${periodNames.ar} ${routeAdminCode ? xAr + y : ''} ${freqQty ? 'لمدة ' + freqQty + ' ' + freqName.ar : ''}
                ${routeAdminAr ? 'طريقه التناول ' + routeAdminAr : ''}  ${rxNotes ? '_' + rxNotes : ''}` :
                `${t} ${e} ${dosTypeAr}  ${identifierAr ? 'لكل ' + identifierAr : ''} كل ${s} ساعات ${routeAdminCode ? xAr + y : ''} ${freqQty ? 'لمدة ' + freqQty + ' ' + freqName.ar : ''} 
                ${routeAdminAr ? 'طريقه التناول ' + routeAdminAr : ''}  ${rxNotes ? '_' + rxNotes : ''}`,
            en: periodType > 2 ?
                `${t} ${e} ${dosTypeEn} ${identifierAr ? 'For Every ' + identifierEn : ''} Every ${periodQtyd} ${periodNames.en}   ${routeAdminCode ? xEn + y : ''}
                 ${freqQty ? 'For ' + freqQty + ' ' + freqName.en : ''}    ${rxNotes ? rxNotes : ''}` :
                `${t} ${e} ${dosTypeEn} ${identifierAr ? 'For Every ' + identifierEn : ''} Every ${s} Hours  ${routeAdminCode ? xEn + y : ''} ${freqQty ? 'For ' + freqQty + ' ' + freqName.en : ''}
                 ${rxNotes ? '_' + rxNotes : ''}`
        };
    if (!s) {
        return {
            ar: '',
            en: ''
        }
    }
}