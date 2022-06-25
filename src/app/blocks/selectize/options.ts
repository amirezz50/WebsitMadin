export class Options {

    // main properties
    valueField: any;
    labelField: any;
    labelFieldAr: any;
    sortField: string[];
    searchFields: string[];
    items: any[];
    currentResults: any[];
    delimiter: string;
    mode: SelectizeMode;
    selected: any;
    placholder: string;
    placholderKey: string;

    get hasOptions(): Boolean {
        return this.items ? this.items.length > 0 : false;
    }

    constructor(selectizeOptions: IOptions) {

        this.valueField = selectizeOptions.valueField;
        this.labelField = selectizeOptions.labelField;
        this.labelFieldAr = selectizeOptions.labelFieldAr;
        this.sortField = selectizeOptions.sortField || [this.valueField];
        this.searchFields = selectizeOptions.searchFields || [this.labelField, this.labelFieldAr, this.valueField];
        this.items = selectizeOptions.items;
        this.delimiter = selectizeOptions.delimiter || ',';
        this.mode = selectizeOptions.mode || SelectizeMode.single;
        this.selected = selectizeOptions.selected;
        this.currentResults = selectizeOptions.currentResults || [];
        this.placholder = selectizeOptions.placholder || 'select...';
        this.placholderKey = `${selectizeOptions.placholderKey}`;
        //this.placholderKey = `${selectizeOptions.placholderKey || 'noPlaceHolder'}`;
    }
}



export interface IOptions {

    valueField?: any;
    labelField?: any;
    labelFieldAr?: any;
    sortField?: string[];
    searchFields?: string[];
    items?: any[];
    currentResults?: any[];
    delimiter?: string;
    mode?: SelectizeMode;
    selected?: any;
    placholder?: string;
    placholderKey?: string;
}


export enum SelectizeMode {
    single = 1,
    multiple = 2
}

/**
 * @description implement selectize template
 * @type string
 */
export class RenderSelectize {

}

const appCodesObject = {

    //------------------------------------------------ Selectize ----------------------------------------------
    1: { placholderKey: 'Gender', controlName: 'gender', type: 'selectize', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    3: { placholderKey: 'Religion', controlName: '', type: 'selectize', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    5: { placholderKey: 'SERVICETYPE', controlName: '', type: 'selectize', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    6: { placholderKey: 'CompanyType', controlName: '', type: 'selectize', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    7: { placholderKey: 'TYPE', controlName: '', type: 'selectize', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    10: { placholderKey: 'ResourceType', controlName: '', type: 'selectize', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    14: { placholderKey: 'ClaimForm', controlName: '', type: 'selectize', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    17: { placholderKey: 'CASHIERTYPE', controlName: '', type: 'selectize', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    19: { placholderKey: 'TYPE', controlName: '', type: 'selectize', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    20: { placholderKey: 'TYPE', controlName: '', type: 'selectize', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    21: { placholderKey: 'INVENTORY', controlName: '', type: 'selectize', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    22: { placholderKey: 'dispensType', controlName: '', type: 'selectize', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    23: { placholderKey: 'MedicalType', controlName: '', type: 'selectize', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    24: { placholderKey: 'BloodGroup', controlName: '', type: 'selectize', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    25: { placholderKey: 'Infraction', controlName: '', type: 'selectize', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    26: { placholderKey: 'SanctionType', controlName: '', type: 'selectize', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    27: { placholderKey: 'CarType', controlName: '', type: 'selectize', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    28: { placholderKey: 'DateType', controlName: '', type: 'selectize', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    34: { placholderKey: 'stockNature', controlName: '', type: 'selectize', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    36: { placholderKey: 'CANCELREASON', controlName: '', type: 'selectize', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    37: { placholderKey: 'PATIENTEXITSTATUS', controlName: '', type: 'selectize', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    38: { placholderKey: 'patStopDeal', controlName: '', type: 'selectize', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    39: { placholderKey: 'BENEFITKIND', controlName: '', type: 'selectize', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    40: { placholderKey: 'PERCENTORVALUE', controlName: '', type: 'selectize', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    41: { placholderKey: 'MEDICALNUMBERCODING', controlName: '', type: 'selectize', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    42: { placholderKey: 'PRIORITYSEARCHCODE', controlName: '', type: 'selectize', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    43: { placholderKey: 'TRANSLATEMETHOD', controlName: '', type: 'selectize', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    44: { placholderKey: 'SecurityLevel', controlName: '', type: 'selectize', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    45: { placholderKey: 'TYPE', controlName: '', type: 'selectize', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    46: { placholderKey: 'DiscountType', controlName: '', type: 'selectize', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    1001: { placholderKey: 'CURRENCY', controlName: '', type: 'selectize', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    1002: { placholderKey: 'PLACE', controlName: '', type: 'selectize', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    1003: { placholderKey: 'ACCOUNTNUMBER', controlName: '', type: 'selectize', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    1004: { placholderKey: 'USER', controlName: '', type: 'selectize', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    1005: { placholderKey: 'COSTCENTER', controlName: '', type: 'selectize', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    1006: { placholderKey: 'Search', controlName: '', type: 'selectize', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    1007: { placholderKey: 'CarDriver', controlName: '', type: 'selectize', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    1008: { placholderKey: 'CarParamedic', controlName: '', type: 'selectize', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    1009: { placholderKey: 'gov', controlName: '', type: 'selectize', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    1010: { placholderKey: 'Country', controlName: '', type: 'selectize', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    1011: { placholderKey: 'city', controlName: '', type: 'selectize', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    1012: { placholderKey: 'village', controlName: '', type: 'selectize', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    1013: { placholderKey: 'nat', controlName: 'nationalityId', type: 'selectize', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    1014: { placholderKey: 'Doctor', controlName: '', type: 'selectize', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    1015: { placholderKey: 'ServiceOfFirstLevel', controlName: '', type: 'selectize', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    1016: { placholderKey: 'Speciality', controlName: '', type: 'selectize', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    1017: { placholderKey: 'group', controlName: '', type: 'selectize', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    1018: { placholderKey: 'USER', controlName: '', type: 'selectize', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    1019: { placholderKey: 'SupplierType', controlName: '', type: 'selectize', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    1020: { placholderKey: 'Employee', controlName: '', type: 'selectize', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    1021: { placholderKey: 'Store', controlName: '', type: 'selectize', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    1022: { placholderKey: 'marital', controlName: '', type: 'selectize', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    1023: { placholderKey: 'patient', controlName: '', type: 'selectize', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    1024: { placholderKey: 'JOB', controlName: '', type: 'selectize', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    1025: { placholderKey: 'DEPARTMENT', controlName: '', type: 'selectize', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    1026: { placholderKey: 'JobType', controlName: '', type: 'selectize', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    1027: { placholderKey: 'category', controlName: '', type: 'selectize', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    1028: { placholderKey: 'PenalityList', controlName: '', type: 'selectize', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    1029: { placholderKey: 'Sanction', controlName: '', type: 'selectize', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    1030: { placholderKey: 'Infractions', controlName: '', type: 'selectize', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    1031: { placholderKey: 'QualificationCat', controlName: '', type: 'selectize', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    1032: { placholderKey: 'group', controlName: '', type: 'selectize', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    1033: { placholderKey: 'redendance', controlName: '', type: 'selectize', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    1034: { placholderKey: 'routesAdmin', controlName: '', type: 'selectize', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    1035: { placholderKey: 'CompanyType', controlName: '', type: 'selectize', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    1036: { placholderKey: 'PatientCategory', controlName: '', type: 'selectize', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    1037: { placholderKey: 'PriceList', controlName: '', type: 'selectize', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    1038: { placholderKey: 'ServiceOfSecondLevel', controlName: '', type: 'selectize', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    1039: { placholderKey: 'Service', controlName: '', type: 'selectize', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    1040: { placholderKey: 'Contract', controlName: 'contractId', type: 'selectize', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    1041: { placholderKey: 'GroupsData', controlName: '', type: 'selectize', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    1045: { placholderKey: 'USER', controlName: 'cashierUserId', type: 'selectize', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    1046: { placholderKey: 'MainCompany', controlName: 'companyCode', type: 'selectize', gridWidth: '2', default: '', dependAppcode: '1048', dependProp: 'ParentId' },
    1047: { placholderKey: 'Cashier', controlName: 'cashierCode', type: 'selectize', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    1048: { placholderKey: 'BranchCompany', controlName: 'CompanyCodeLev2', type: 'selectize', gridWidth: '2', default: '', dependAppcode: '1059', dependProp: 'ParentId' },
    1050: { placholderKey: 'Bank', controlName: '', type: 'selectize', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    1051: { placholderKey: 'VisaType', controlName: '', type: 'selectize', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    1052: { placholderKey: 'SchedulledDoctors', controlName: '', type: 'selectize', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    1053: { placholderKey: 'DiscountDiscription', controlName: '', type: 'selectize', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    1054: { placholderKey: 'ServiceLevelThird', controlName: '', type: 'selectize', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    1055: { placholderKey: 'BillItem', controlName: '', type: 'selectize', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    1059: { placholderKey: 'SUBBRANCHCOMPANY', controlName: 'CompanyCodeLev3', type: 'selectize', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    1093: { placholderKey: 'RESIDENCEDEGREE', controlName: 'ResDegSerial', type: 'selectize', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    1099: { placholderKey: 'FLOOR', controlName: 'FloorCode', type: 'selectize', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    1100: { placholderKey: 'ROOM', controlName: 'RoomCode', type: 'selectize', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    1101: { placholderKey: 'BED', controlName: 'BedCode', type: 'selectize', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },



    //--------------------------------------------  Inputs ---------------------------------------------------

    2000: { placholderKey: "MRN", controlName: 'code', type: 'text', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    2001: { placholderKey: 'Name', controlName: 'fullnameEn', type: 'text', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    2002: { placholderKey: 'IDENTITYVALUE', controlName: 'identityValue', type: 'text', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    2003: { placholderKey: 'MOBILENUMBER', controlName: 'mobile', type: 'text', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    2004: { placholderKey: 'ReceiptSerial', controlName: 'receiptSerial', type: 'numbersOnly', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    2005: { placholderKey: 'STARTDATE', controlName: 'ngbFromDate', type: 'date', gridWidth: '2', default: 'today', dependAppcode: '', dependProp: '' },
    2006: { placholderKey: 'ENDDATE', controlName: 'ngbToDate', type: 'date', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    2007: { placholderKey: "MRN", controlName: 'patCode', type: 'numbersOnly', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    2008: { placholderKey: 'Name', controlName: 'patFullnameEn', type: 'text', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    2009: { placholderKey: 'visitNum', controlName: 'visitNo', type: 'numbersOnly', gridWidth: '2', default: '', dependAppcode: '', dependProp: '' },
    2010: { placholderKey: 'VisitDate', controlName: 'ngbVisitDate', type: 'date', gridWidth: '3', default: 'today' },

    

};

export function getAppCodesKeys(...key) {
    let temp = [];

    key[0].forEach(code => {
        let elem = appCodesObject[code];
        elem.code = code;
        temp.push(elem);
    });
    return temp;

}





