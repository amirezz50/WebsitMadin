import { finalize, catchError, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { customDateJson, createAuthorizationHeader } from './utility';
import { CONFIG } from './config';
import { ExceptionService } from '../blocks/exception.service';
import { SpinnerService } from '../blocks/spinner/spinner.service';
import { ToastService } from '../blocks/toast/toast.service';

@Injectable()
export class HttpGeneralService {
  apiUrlNew: string;
  apiUrlOld: string;
  reportUrl: string;
  constructor(
    private _http: HttpClient,
    private _exceptionService: ExceptionService,
    private _spinnerService: SpinnerService,
    private toastService: ToastService
  ) {
    this.apiUrlNew = CONFIG.Urls.apiUrlNew;
    this.apiUrlOld = CONFIG.Urls.apiUrlOld;
  }
  modifyUrl(url: string): string {
    return CONFIG.updateOldUrl(url);
  }
  //https://rxnav.nlm.nih.gov/InteractionAPIs.html#uLink=Interaction_REST_findInteractionsFromList
  useRestApi(qString: string) {
    //
    //https://rxnav.nlm.nih.gov/REST/drugs?name=Nedocromil
    //https://rxnav.nlm.nih.gov/REST/interaction/interaction.json?rxcui=88014&sources=ONCHigh
    //https://rxnav.nlm.nih.gov/REST/interaction/list.json?rxcuis=207106+152923+656659
    let url =
      'https://rxnav.nlm.nih.gov/REST/interaction/list.json?rxcuis=207106+152923+656659';
    this._spinnerService.show();
    let headers = createAuthorizationHeader();
    return this._http
      .get(url).pipe(
        map(response => {
          return response;
        }),
        catchError(this._exceptionService.catchBadResponse),
        finalize(() => this._spinnerService.hide()));
  }


  /** *********************************************************
   * used to send get request to sever, take whole url
   * @param url
   */
  getWith<T>(url: string) {
    url = this.modifyUrl(url);
    this._spinnerService.show();
    let headers = createAuthorizationHeader();
    return this._http
      .get(url, { headers: headers }).pipe(
        map(response => {
          let temp = <any>response;
          if (temp && temp['msgData']) {
            let returnFlag = this.toastService.HandelDbMessages(temp['msgData']);
            temp['returnFlag'] = returnFlag;
          }
          return temp;
        }),
        catchError(this._exceptionService.catchBadResponse),
        finalize(() => this._spinnerService.hide()));
  }
  /** **********************************************************
   * send get request
   * @param id, 0 to get all ,number to get item
   * @param url
   */
  get<T>(id: number, url: string) {
    url = this.modifyUrl(url);
    this._spinnerService.show();
    let headers = createAuthorizationHeader();
    return this._http
      .get(`${url}/${id}`, { headers: headers }).pipe(
        map(response => {
          let temp = <any>response;
          if (temp && temp['msgData']) {
            let returnFlag = this.toastService.HandelDbMessages(temp['msgData']);
            temp['returnFlag'] = returnFlag;
          }

          return temp;
        }),
        catchError(this._exceptionService.catchBadResponse),
        finalize(() => this._spinnerService.hide()));
  }
  /** **********************************************************
   * send get request
   * @param url
   */
  getWithoutDataset(url: string) {
    url = this.modifyUrl(url);
    this._spinnerService.show();
    const headers = createAuthorizationHeader();
    return this._http
      .get(url, { headers: headers }).pipe(
        map(response => {
          const temp = <any>response;
          if (temp) {
            temp['returnFlag'] = true;
          }
          return temp;
        }),
        catchError(this._exceptionService.catchBadResponse),
        finalize(() => this._spinnerService.hide()));
  }

  /** **********************************************************
   * send get request
   * @param url
   */
  postWithoutDataset(newEntity, url: string) {
    url = this.modifyUrl(url);
    customDateJson(newEntity);
    const body = JSON.stringify(newEntity);
    const headers = createAuthorizationHeader();

    return this._http
      .post(url, body, { headers: headers }).pipe(
        map(response => {
          const temp = response;
          if (temp) {
            temp['returnFlag'] = true;
          }
          return temp;
        }),
        catchError(this._exceptionService.catchBadResponse),
        finalize(() => this._spinnerService.hide()));
  }
  /** *********************************************************
   * send authentication paramters in header
   * @param newEntity
   * @param url
   */

  /** *********************************************************
   * send post request to add new item
   * @param newEntity
   * @param url
   */
  add<T>(newEntity: T, url: string) {
    url = this.modifyUrl(url);
    customDateJson(newEntity);
    let body = JSON.stringify(newEntity);

    let headers = createAuthorizationHeader();
    this._spinnerService.show();

    return this._http
      .post(`${url}`, body, { headers: headers }).pipe(
        map(response => {
          let temp = <any>response;
          if (temp && temp['msgData']) {
            let returnFlag = this.toastService.HandelDbMessages(temp['msgData']);
            temp['returnFlag'] = returnFlag;
          }
          return temp;
        }),
        catchError(this._exceptionService.catchBadResponse),
        finalize(() => this._spinnerService.hide()));
  }
  getFileByPost<T>(newEntity: T, url: string, responseType?: string) {
    url = this.modifyUrl(url);
    customDateJson(newEntity);
    let body = JSON.stringify(newEntity);

    let headers = createAuthorizationHeader();
    if (responseType) {
      headers['responseType'] = responseType;
    }
    //  this._spinnerService.show();

    return this._http.post(`${url}`, body, {
      headers: headers,
      observe: 'response',
      responseType: 'arraybuffer'
    })
  }
  /** *********************************************************
   * send post request for any case
   * @param post object
   * @param url
   */
  post<T>(newEntity: T, url: string) {
    url = this.modifyUrl(url);
    customDateJson(newEntity);
    let body = JSON.stringify(newEntity);
    let headers = createAuthorizationHeader();

    this._spinnerService.show();

    return this._http
      .post(`${url}`, body, { headers: headers }).pipe(
        map(response => {
          let temp = <any>response;
          if (temp && temp['msgData']) {
            let returnFlag = this.toastService.HandelDbMessages(temp['msgData']);
            temp['returnFlag'] = returnFlag;
          }
          return temp;
        }),
        catchError(this._exceptionService.catchBadResponse),
        finalize(() => this._spinnerService.hide()));
  }
  /** **********************************************************
   * send post request to add new collection items of T object
   * @param newEntity
   * @param url
   */
  addCollection<T>(newEntity: T[], url: string, showSpinner: boolean = true) {
    url = this.modifyUrl(url);
    customDateJson(newEntity);
    let body = JSON.stringify(newEntity);
    let headers = createAuthorizationHeader();

    if (showSpinner)
      this._spinnerService.show();

    return this._http
      .post(`${url}`, body, { headers: headers }).pipe(
        map(response => {
          let temp = <any>response;
          if (temp && temp['msgData']) {
            let returnFlag = this.toastService.HandelDbMessages(temp['msgData']);
            temp['returnFlag'] = returnFlag;
          }

          return temp;
        }),
        catchError(this._exceptionService.catchBadResponse),
        finalize(() => {
          if (showSpinner)
            this._spinnerService.hide()
        }
        )
      );
  }

  /** *********************************************************
   * used to upload image to api
   * @param newEntity
   * @param url
   */
  uploadImage<T>(image: T, url: string, mimeType: string) {
    url = this.modifyUrl(url);
    // let body = JSON.stringify(image);
    let headers = createAuthorizationHeader();
    this._spinnerService.show();
    let file: File = image[0].file;
    let formData: FormData = new FormData();
    formData.append('uploadFile', image[0], file.name);
    return this._http
      .post(`${url}`, formData, { headers: headers }).pipe(
        map(response => response),
        catchError(this._exceptionService.catchBadResponse),
        finalize(() => this._spinnerService.hide()));
  }
  /** ************************************************************
   * send put request to server
   * @param id
   * @param oldEntity
   * @param url
   */
  update<T>(id: any, oldEntity: T, url: string) {
    url = this.modifyUrl(url);
    customDateJson(oldEntity);
    let body = JSON.stringify(oldEntity);
    let headers = createAuthorizationHeader();
    this._spinnerService.show();

    return this._http
      .put(`${url}/${id}`, body, { headers: headers }).pipe(
        map(response => {
          let temp = <any>response;
          if (temp && temp['msgData']) {
            let returnFlag = this.toastService.HandelDbMessages(temp['msgData']);
            temp['returnFlag'] = returnFlag;
          }

          return temp;
        }),
        catchError(this._exceptionService.catchBadResponse),
        finalize(() => this._spinnerService.hide()));
  }
  /** ************************************************************
   * send post search request to server url always is contain search key
   * @param searchObj object parm used to search
   * @param url
   */
  search<T>(searchObj: T, url: string) {
    url = this.modifyUrl(url);
    customDateJson(searchObj);
    let body = JSON.stringify(searchObj);
    let headers = createAuthorizationHeader();
    this._spinnerService.show();

    return this._http
      .post(`${url}/search`, body, { headers: headers }).pipe(
        map(res => {
          let temp = <any>res;
          if (temp && temp['msgData']) {
            let returnFlag = this.toastService.HandelDbMessages(temp['msgData']);
            temp['returnFlag'] = returnFlag;
          }

          return temp;
        }),
        catchError(this._exceptionService.catchBadResponse),
        finalize(() => this._spinnerService.hide()));
  }
  /** ***************************************************************
   * uesd to send delete request to server
   * take id or sreial or code for item o\you want to delete it
   * @param id
   * @param url
   */
  delete<T>(id: T, url: string) {
    url = this.modifyUrl(url);
    let headers = createAuthorizationHeader();
    this._spinnerService.show();
    return this._http
      .delete(`${url}/${id}`, { headers: headers }).pipe(
        map(response => {
          let temp = response;
          if (temp && temp['msgData']) {
            let returnFlag = this.toastService.HandelDbMessages(temp['msgData']);
            temp['returnFlag'] = returnFlag;
          }

          return temp;
        }),
        catchError(this._exceptionService.catchBadResponse),
        finalize(() => this._spinnerService.hide()));
  }

  getNewUrl(url) {
    return this.modifyUrl(url);
  }

  postFile<T>(newEntity: T, url: string) {
    url = this.modifyUrl(url);
    customDateJson(newEntity);
    let body = newEntity;
    let headers = { Authorization: createAuthorizationHeader().Authorization };

    this._spinnerService.show();

    return this._http
      .post(`${url}`, body, { headers: headers, reportProgress: true, observe: 'events' }).pipe(
        map(response => {
          let temp = <any>response;
          if (temp && temp['msgData']) {
            let returnFlag = this.toastService.HandelDbMessages(temp['msgData']);
            temp['returnFlag'] = returnFlag;
          }
          return temp;
        }),
        catchError(this._exceptionService.catchBadResponse),
        finalize(() => this._spinnerService.hide()));
  }
}
