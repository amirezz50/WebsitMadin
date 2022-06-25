import { DocManagementTrans } from './../image-upload-new';
import { HttpGeneralService } from './../../shared/http-general.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CONFIG } from "../../shared/config";

let DocManagmentUrl = CONFIG.baseUrls.DocManagment;

@Injectable()
export class imageUploadAllService {


  constructor(
    private _httpGeneralService: HttpGeneralService,
    private _http: HttpClient,) { }

  getCategoriesData(DocFolderLookupSerial: number) {
    return this._httpGeneralService.getWith(`${DocManagmentUrl}/docCategories/${DocFolderLookupSerial}`);
  }

  // uploadImage(formData) {
  //   return ajax.post(`${this.apiUrl}api/upload`, formData);
  // }

  // deleteImage(formData) {
  //   return this.http.post<any>(`${this.apiUrl}api/deleteImage`, formData)
  //   .pipe(
  //     catchError(this.handleError)
  //   );
  // }
  getAllImage(DocManagementTrans: DocManagementTrans) {
    return this._httpGeneralService.add(DocManagementTrans, `${DocManagmentUrl}/GetAllImage`);
  }
  saveAllImage(DocManagementTrans: DocManagementTrans) {
    return this._httpGeneralService.add(DocManagementTrans, `${DocManagmentUrl}/SaveAllImage`);
  }

  updateImageData(imageData: DocManagementTrans) {
    return this._httpGeneralService.update(imageData.serial, imageData, `${DocManagmentUrl}/UpdateImageData`);
  }

  getImagebyName(DocManagementTrans: DocManagementTrans) {
    DocManagmentUrl = this._httpGeneralService.modifyUrl(DocManagmentUrl);
    return `${this._httpGeneralService.apiUrlNew + DocManagmentUrl}/GetImagebyName?type=${DocManagementTrans.docManagementSerial}&id=${DocManagementTrans.tableRowId}&ImageName=${DocManagementTrans.docPath}`
  }
  // deleteImage(DocManagementTrans: DocManagementTrans) {
  //   return this._httpGeneralService.add(DocManagementTrans, `${DocManagmentUrl}/DeleteImage`);
  // }
  deleteImage(serial: number) {
    return this._httpGeneralService.delete(serial, `${DocManagmentUrl}/DeleteImage`);
  }
  updateFlageCode(data: any) {
    return this._httpGeneralService.update(data.flagCode, data, `${DocManagmentUrl}/UpdateFlag`);
  }

  // saveProduct(formData) {
  //   return this.http.post<any>(`${DocManagmentUrl}api/saveProduct`, formData)
  //   .pipe(
  //     catchError(this.handleError)
  //   );
  // }

  // private handleError(error: HttpErrorResponse) {
  //   if (error.error instanceof ErrorEvent) {
  //     // A client-side or network error occurred. Handle it accordingly.
  //     console.error('An error occurred:', error.error.message);
  //   } else {
  //     // The backend returned an unsuccessful response code.
  //     // The response body may contain clues as to what went wrong,
  //     console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
  //   }
  //   // return an observable with a user-facing error message
  //   return throwError('Something bad happened. Please try again later.');
  // }
}


export interface IDataSave {
  userType: number;
  userCode: number;
  transCode: number;
  billNumber: number;
  lookupSerial: number;
  docManagmentSerial: number;
  docManagementLookupSerial: number;
  serial?: number;

  visitSerial?: number;
  name?: string;
  searchData?: string;
  allVisits?: string;
  tableRowId?: number;
  transCodeArray?: string
}

export interface ImageData {
  serial?: number;
  imageName: string;
  transData: Date;
  notes: string;
  docPath?: string;
  transSerial?: number;
  billNumber?: number;
  tableRowId?: number;
}