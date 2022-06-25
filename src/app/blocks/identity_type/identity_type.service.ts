//https://ar.wikipedia.org/wiki/%D8%A8%D8%B7%D8%A7%D9%82%D8%A9_%D8%A7%D9%84%D8%B1%D9%82%D9%85_%D8%A7%D9%84%D9%82%D9%88%D9%85%D9%8A
import { Injectable } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Injectable()
export class IdentityTypeService {
    birthYear: number;
    constructor(
        public translate: TranslateService) { }

    validateInput(identityTypeVal: string, identityType: IdentityTypes): boolean {
        switch (identityType) {
            case IdentityTypes.NATIONALID:
                return this.validatNationalId(identityTypeVal);
            case IdentityTypes.PASSPORT:
                return this.validatPassportNumber(identityTypeVal);
            case IdentityTypes.IDENTITY:
                return this.validatIdentity(identityTypeVal);
            case IdentityTypes.RESIDENCE:
                return this.validatResidence(identityTypeVal);
            case IdentityTypes.NOTAPPLIED:
                return true;
            default:
                return false;
        }
    }

    //#region validators
    validatNationalId(num: string): boolean {
        // Egyptian National Id
        var regex = /(2|3)[0-9][0-9]((?!0229|0230|0231|0431|0631|0831|1131)(((0)[1-9]|(1)[0-2])((0)[1-9]|[1-2][0-9]|(3)[0-1])))(01|02|03|04|11|12|13|14|15|16|17|18|19|21|22|23|24|25|26|27|28|29|31|32|33|34|35|88)\d\d\d\d\d/g
        this.birthYear = +(+num.substr(0, 1) == 2 ? '19' + num.substr(1, 2) : '20' + num.substr(1, 2));
        if (regex.test(num.toString()) == false) {
            if (this.birthYear  % 4 == 0 && num.substr(3, 4) == '0229')
                return true;
            return false;
        }
        else
            return true;
    }
    validatPassportNumber(num: string): boolean {
        var regex = /^[0 - 9]$/igm
        return regex.test(num.toString());
    }
    validatIdentity(num: string): boolean {
        //only teen numbers
        // if(num.length > 10 ||  num.length < 10 )
        // return false  ;
       // var regex = /^[0 - 9]\d{9}$/igm
        var regex = /\d{10}$/igm
        return regex.test(num.toString());
    }
    validatResidence(num: string): boolean {
        //only 12 numbers
        var regex = /^[0 - 9]$/igm
        return regex.test(num.toString());
    }
    //#endregion 

    //#region data processing
    extractInformation(num: string, type: IdentityTypes): NationalIdInformation {
     
        if (type == IdentityTypes.NATIONALID) {
            let birthdateYear = this.birthYear ;
            let birthdateMonth = +num.substr(3, 2) - 1;
            let birthdateDay = +num.substr(5, 2) - 0;
            let birthPlace = num.substr(7, 2);
            let gender = (+num.substr(12, 1)) % 2 == 0 ? Gender.Female : Gender.Male; //before last  digit if odd then female else male

            let generatedObj = new NationalIdInformation(gender, new Date(birthdateYear, birthdateMonth, birthdateDay), this.getBirthPlace(birthPlace));
            return generatedObj;
        }
    }
    getBirthPlace(num: string): string {
        switch (num) {
            case "01": return this.translate.currentLang == 'ar' ? "القاهرة" : "Cairo";
            case "02": return this.translate.currentLang == 'ar' ? "الاسكندرية" : "Alex";
            case "03": return this.translate.currentLang == 'ar' ? "بور سعيد" : "PortSaieed";
            case "04": return this.translate.currentLang == 'ar' ? "السويس" : "Suez";
            case "11": return this.translate.currentLang == 'ar' ? "دمياط" : "Damietta";
            case "12": return this.translate.currentLang == 'ar' ? "الدقهلية" : "Dakahlia";
            case "13": return this.translate.currentLang == 'ar' ? "الشرقية" : "Sharqia";
            case "14": return this.translate.currentLang == 'ar' ? "القليوبية" : "Qalyubia";
            case "15": return this.translate.currentLang == 'ar' ? "كفر الشيخ" : "Kafr el-Sheikh";
            case "16": return this.translate.currentLang == 'ar' ? "الغربية" : "Gharbia";
            case "17": return this.translate.currentLang == 'ar' ? "المنوفية" : "Monufia";
            case "18": return this.translate.currentLang == 'ar' ? "البحيرة" : "Beheira";
            case "19": return this.translate.currentLang == 'ar' ? "الاسماعيلية" : "Ismailia";
            case "21": return this.translate.currentLang == 'ar' ? "الجيزة" : "Giza";
            case "22": return this.translate.currentLang == 'ar' ? "بنى سويف" : "Beni Suef";
            case "23": return this.translate.currentLang == 'ar' ? "الفيوم" : "Faiyum";
            case "24": return this.translate.currentLang == 'ar' ? "المنيا" : "Minya";
            case "25": return this.translate.currentLang == 'ar' ? "أسيوط" : "Asyut";
            case "26": return this.translate.currentLang == 'ar' ? "سوهاج" : "Sohag";
            case "27": return this.translate.currentLang == 'ar' ? "قنا" : "Qena";
            case "28": return this.translate.currentLang == 'ar' ? "أسوان" : "Aswan";
            case "29": return this.translate.currentLang == 'ar' ? "الأقصر" : "Luxor";
            case "31": return this.translate.currentLang == 'ar' ? "البحر الأحمر" : "Red Sea";
            case "32": return this.translate.currentLang == 'ar' ? "الوادى الجديد" : "New Valley";
            case "33": return this.translate.currentLang == 'ar' ? "مطروح" : "Matruh";
            case "34": return this.translate.currentLang == 'ar' ? "شمال سيناء" : "North sini";
            case "35": return this.translate.currentLang == 'ar' ? "جنوب سيناء" : "South sini";
            case "88": return this.translate.currentLang == 'ar' ? "خارج مصر" : "Out of Egypt";
            default: { return '0'}
        }
    }
    //#endregion
}



export enum IdentityTypes {
    NATIONALID = 1,
    PASSPORT = 2,
    IDENTITY = 3,
    RESIDENCE = 4,
    NOTAPPLIED = 5
}
enum Gender {
    Male = 1,
    Female = 2
}
class NationalIdInformation {
    gender: Gender;
    birthDate: Date;
    birthPlace: string;

    constructor(_gender: number, _birthDate: Date, _birthPlace: string) {
        this.gender = _gender || 1;
        this.birthDate = _birthDate || new Date(1980, 10, 23);
        this.birthPlace = _birthPlace || '';
    }
}



