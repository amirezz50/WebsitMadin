
import {finalize, catchError, map} from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpResponseBase, HttpHeaders } from '@angular/common/http';
import { Observable, ReplaySubject, Subject } from 'rxjs';

import { ExceptionService } from '../../exception.service';
import { SpinnerService } from '../../spinner';
import { createAuthorizationHeader } from '../../../shared/utility';

import { CONFIG } from '../../../shared/config';
import { StorageService } from '../../storage.service';

let appCodesUrl = CONFIG.baseUrls.appCodes;
export interface AppCodes {
  code: number;
  nameEn: string;
  nameAr: string;
  iconName: string;
  cssClasses: string;
  serial: number;
  iconeFlagTogglerValue:boolean;
  isDone?: boolean;
  isActive?: boolean;
  isValid?: boolean;
  isFirstTime?: boolean;
  IsIconClicked?:boolean;
}

interface AppCodeHttpResult {
  appCodes: string;
  httpResult: any;
}

@Injectable()
export class ActionIconService {

  cachedAppCodes: string[] = [];
  cachedAppCodesResult: AppCodeHttpResult[] = [];

  getControls$: Subject<any>;
  loadedAppCode$ = new Subject();

  constructor(private _http: HttpClient,
    private _exceptionService: ExceptionService,
    private _SS: StorageService,
    private _spinnerService: SpinnerService) {
    appCodesUrl = appCodesUrl.replace(CONFIG.Urls.apiUrlOld, CONFIG.Urls.apiUrlNew);
  }

  fetch(appCodes: string) {
    if (this.cachedAppCodes.indexOf(appCodes) === -1) {
      this._spinnerService.show();
      let appCodeSubject = new ReplaySubject<HttpResponseBase>(2);
      let headers = createAuthorizationHeader();
      this._http.get(`${appCodesUrl}/${appCodes}`, { headers: headers }).pipe(
        map(response => response),
        catchError(this._exceptionService.catchBadResponse),
        finalize(() => this._spinnerService.hide()),)
        .subscribe(res => appCodeSubject.next(res));

      this.cachedAppCodes.push(appCodes);
      this.cachedAppCodesResult.push({
        appCodes: appCodes,
        httpResult: appCodeSubject
      })
    }

  }

  getControls(appCodes: string) {
    this.fetch(appCodes);
    return this.cachedAppCodesResult.find(cache => cache.appCodes == appCodes).httpResult.asObservable();

  }
  getCachedAppCodes(_key: string, appCodes: any[]) {
    const _cached = this._SS.getCachedAppCodes(_key, appCodes);
    return _cached || [];
  }
  cachAppCodes(_key: string, appCodes: any[], data: any[]) {
    this._SS.cachAppCodes(_key, appCodes, data);

  }
  setAppControls$(): Subject<any> {

    if (!this.getControls$) {
      this.getControls$ = new Subject();
    }
    return this.getControls$;
  }
  setAppCodes(appCodes) {
    return this.loadedAppCode$.next(appCodes);
  }

  getAppCodes() {
    return this.loadedAppCode$.asObservable();
  }

}




