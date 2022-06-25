export class PersonName {

    fnameEn: string;
    snameEn: string;
    tnameEn: string;
    lnameEn: string;
    fnameAr: string;
    snameAr: string;
    tnameAr: string;
    lnameAr: string;
    titleCode: number;
    titleNameAr: string;
    titleNameEn: string;

    constructor(_firstNameEn?: string, _secondNameEn?: string,
        _thirdNameEn?: string, _lastNameEn?: string, _firstNameAr?: string,
        _secondNameAr?: string, _thirdNameAr?: string, _lastNameAr?: string, _code?: number, _titleNameAr?: string, _titleNameEn?: string) {
        this.fnameEn = _firstNameEn;
        this.snameEn = _secondNameEn;
        this.tnameEn = _thirdNameEn;
        this.lnameEn = _lastNameEn;
        this.fnameAr = _firstNameAr;
        this.snameAr = _secondNameAr;
        this.tnameAr = _thirdNameAr;
        this.lnameAr = _lastNameAr;
        this.titleCode = _code;
        this.titleNameAr = _titleNameAr;
        this.titleNameEn = _titleNameEn;

    }

}
