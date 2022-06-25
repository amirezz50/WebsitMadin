import { FormGroup } from "@angular/forms";


export const TransNames = {

  InPatientReservation: 'InPatient Reservation',
  EmergencyReservation: 'Emergency Reservation',
  NewBorn: 'NewBorn'
}

export class Utility {
  static UiActive: string
  static test: string

}
export enum actionIconOptions {
  FilterWithItemsHaveBalanceOnly = 6596
}
export function customDateJson(obj: any) {
  for (var property in obj) {
    if (obj.hasOwnProperty(property)) {
      if (obj[property] instanceof Date) {
        let _date = <Date>obj[property];
        let _now = new Date();
        if (_date.getHours() == 0 && _date.getMinutes() == 0 && _date["AcceptZeroTime"] == undefined) {
          _date.setHours(_now.getHours());
          _date.setMinutes(_now.getMinutes());
        }
        obj[property] = obj[property].toJSON();
      }
      else if (typeof obj[property] == "object") {
        customDateJson(obj[property]);
      }
    }
  }
}
export function getAuthorizationHeaderForRouting() {
  let currentUser = window.location.pathname.includes('portal/') ? JSON.parse(sessionStorage.getItem('currentPatient')) : JSON.parse(sessionStorage.getItem('currentUser'));
  return btoa('SecloginId' + '/' + (currentUser.secLoginId ? currentUser.secLoginId : currentUser.code) + ',' + 'BranchId' + '/' + currentUser.branchId + ',' + currentUser.accountId)
}
export function createAuthorizationHeader() {
  // private  _userSessionService : UserSessionService
  let currentUser = window.location.pathname.includes('portal/') ? JSON.parse(sessionStorage.getItem('currentPatient')) : JSON.parse(sessionStorage.getItem('currentUser'));
  let forDebug = JSON.parse(sessionStorage.getItem('forDebug'));
  let WorkFlowPath = Utility.UiActive
  let link = JSON.parse(sessionStorage.getItem('LinkObj'));
  let linkId = '0';

  //sayed
  let moduleId = '0';
  if (link) {
    linkId = link.code
    moduleId = link.parentCode
  }
  let hostname = JSON.parse(localStorage.getItem('hostname'));

  if (window.location.pathname.includes('/portal/register')) {
    if (!currentUser) currentUser = <any>{};
    currentUser.secLoginId = 1;
    currentUser.branchId = 1;
    currentUser.accountId = 1;
  }
  let userhost = window.location.host;
  // let headers1 = new HttpHeaders();
  // headers1.append('UserHost', userhost);


  let headers = {
    'Content-Type': 'application/json',
    'UserHost': userhost,
    'Authorization': 'Basic ' + btoaUserData(currentUser, forDebug, WorkFlowPath, linkId, moduleId)
  };
  return headers;
}

export function btoaUserData(currentUser: any, forDebug: string = '', WorkFlowPath: string = '', linkId: string = '', moduleId: string = '') {
  return btoa('SecloginId' + '/' + (currentUser.secLoginId ? currentUser.secLoginId : currentUser.code) + ',' + 'BranchId' + '/' + currentUser.branchId + ',' + 'link' + '/' + linkId + ',' + 'WorkFlowPath' + '/' + WorkFlowPath + ',' + 'ForDebug' + '/' + forDebug + ',' + 'AccountId' + '/' + currentUser.accountId + ',' + 'BranchesArr' + '/' + currentUser.branchesArr + ',' + 'ModuleId' + '/' + moduleId)
}


export function validateAuthorizationHeader(_Outh: string): boolean {
  let currentUser = JSON.parse(localStorage.getItem('currentUser'));

  if (currentUser) {
    let _OuthPlain = atob(_Outh);
    if (_OuthPlain.includes('SecloginId' + '/' + (currentUser.secLoginId ? currentUser.secLoginId : currentUser.code) + ',' + 'BranchId' + '/' + currentUser.branchId)) { return true }
  }


  return false;
}
export function getNewTapAuth() {
  let userdata = JSON.parse(sessionStorage.getItem('currentUser'))
  let _btoa = btoaUserData(userdata);
  _btoa = _btoa.substring(0, _btoa.length - 1);
  let st = Date.now();
  return '?tempOuth=' + _btoa + '&st=' + st;
}
export function openNewTap(componentRoute: string) {

  var url = window.location.host + componentRoute + getNewTapAuth();
  setUserToLocalStorageFromSession()

  window.open(url, "_blank");

}
export function setUserToSessionFromLocalStorage() {
  sessionStorage.setItem('currentUser', localStorage.getItem('currentUser'));
  localStorage.removeItem('currentUser')
}
export function setUserToLocalStorageFromSession() {
  localStorage.setItem('currentUser', sessionStorage.getItem('currentUser'));
}


// example {appCode:1096 , varPropName: 'PatCode' , varPropVal: 435 }
export interface AppCodeVariableKeys {
  appCode: number,
  varPropName: string,
  varPropVal: string,
  defaultPropVal?: number,
  excludedCodes?: string;
}


export class Guid {
  static newGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}

export function toInteger(value: any): number {
  return parseInt(`${value}`, 10);
}

export function dateToString(value: Date): string {
  if (value)
    return value.getFullYear() + '/' + value.getMonth() + '/' + value.getDate() + ' ' + value.getHours() + ':' + value.getMinutes();
  else return ''
}

export function toString(value: any): string {
  return (value !== undefined && value !== null) ? `${value}` : '';
}

export function getValueInRange(value: number, max: number, min = 0): number {
  return Math.max(Math.min(value, max), min);
}

export function isDateString(value: any): boolean {
  return !isNaN(Date.parse(value));
}
export function dateFromString(dateString: string): Date {
  return new Date(dateString);
}

export function dateAsAkey(value: Date): string {
  if (value)
    return '' + value.getFullYear() + value.getMonth() + value.getDate();
  else return ''
}

export function isString(value: any): value is string {
  return typeof value === 'string';
}

export function isNumber(value: any): value is number {
  return !isNaN(toInteger(value));
}

export function isInteger(value: any): value is number {
  return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
}

export function isDefined(value: any): boolean {
  return value !== undefined && value !== null;
}

export function padNumber(value: number) {
  if (isNumber(value)) {
    return `0${value}`.slice(-2);
  } else {
    return '';
  }
}

export function regExpEscape(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

export function moduleSettingHashMap(setting: any[]) {
  let settingHM = {};
  setting.forEach(x => {
    settingHM[x['fieldName']] = x['fieldValue'] == null ? -1 : x['fieldValue'];
  })
  return settingHM;
}

export function getUrlParameter(name: string) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  var results = regex.exec(location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

export function findInvalidControls(_form: FormGroup) {
  let invalid = [];
  let controls = _form.controls;
  for (const name in controls) {
    if (controls[name].invalid) {
      invalid.push(name);
      let _child = <FormGroup>(controls[name])
      if (_child && _child.controls) {
        invalid = invalid.concat(findInvalidControls(_child));

      }
    }
  }
  return invalid;
}


