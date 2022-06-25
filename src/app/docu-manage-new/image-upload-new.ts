export interface DocManagementTrans {
    serial?: number;
    docManagementSerial?: number;
    tableRowId: number;
    documentLookupCode?: number;
    docPath?: string;
    dBDocSerial?: number;
    base64?: string;
    base64Arr?: string[];
    docFolderLookupSerial?: number;
    savePlaceType?: number;
    allVisits?: number;
    publishPath?: string;
    imageDataArr?: string[];
    imageData?: string;
    searchData?: string;
    fileEvent?: any;
    exportPdf?: number;
    transSerial?: number;
    billNumber?: number;
    regPatServiceSerial?: number;
    BankTranferSerial?: number;
    file?: File;
    docName?: string;
    fileToUpload?: FileToUpload;
    transDate?: Date;
    imageName?: string;
    notes?: string;
    emrHtmlReportSerial?:number
    transCodeArray?:string
}

export class FileToUpload {
    fileName: string = "";
    fileSize: number = 0;
    fileType: string = "";
    lastModifiedTime: number = 0;
    lastModifiedDate: Date = null;
    fileAsBase64: string = "";
}