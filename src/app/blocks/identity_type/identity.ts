export class Identity {
    identityValue: string;
    identityType: number;
    identityTypeNameAr: string;
    identityTypeNameEn: string;


    constructor(_identityValue?: string, _identityType?: number,
        _identityTypeNameAr?: string, _identityTypeNameEn?: string) {
        this.identityValue = _identityValue;
        this.identityType = _identityType;
        this.identityTypeNameAr = _identityTypeNameAr;
        this.identityTypeNameEn = _identityTypeNameEn;
    }

}