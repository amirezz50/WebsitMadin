
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CONFIG } from '../../shared/config';
import { customDateJson, createAuthorizationHeader, dateAsAkey, dateFromString, isDateString } from '../../shared/utility';
import { isInteger } from '../../ng-bootstrap/util/util';
import { StorageService } from '../storage.service';
import { HttpGeneralService } from '../../shared/shared';
import { of } from 'rxjs';

export interface FastSearch {
  AppCode: number;
  UserId?: number;
  BranchId?: number;

  SecLoginId?: number;

  // extra params
  Level?: number;
  SpecialityId?: number;

  SearchData: string;

  jsonObject: string;
  FromRow: number;
  ToRow: number;
  objDynamic: Object;

}
@Injectable()
export class SelectizeService {
  fastSearchUrl: string;
  redaTest?: number;
  appCode: number;
  cachedAppCodes: number[] = [1289];
  constructor(private _http: HttpClient,
    private _SS: StorageService,
    private httpGeneralService: HttpGeneralService
    //,private _USS: UserSessionService
  ) {

    this.fastSearchUrl = `${CONFIG.Urls.apiUrlNew}/api/v1/FastSearch`;
  }

  filter(data: string, props: Array<string>, originalList: Array<any>, searchExact: boolean) {
    data = String(data);
    let filteredList: any[];
    if (data && props && originalList) {
      data = data.toLowerCase();
      let filtered = originalList.filter(item => {
        let match = false;
        for (let prop of props) {
          if (searchExact) {
            if (item[prop] && item[prop].toString() == data) {
              match = true;
              break;
            }
          }
          else {
            if (item[prop] && item[prop].toString().toLowerCase().indexOf(data) > -1) {
              match = true;
              break;
            }
          }
        };
        return match;
      });
      filteredList = filtered;
    }
    else {
      filteredList = originalList;
    }

    return filteredList;
  }
  addtionalFilter(searchKeys: any, keysMapping: any[], originalList: Array<any>): any[] {
    Object.keys(searchKeys).forEach(key => {
      if (searchKeys[key]) {
        const dataKey = keysMapping.find(km => km.searchKey == key);
        if (dataKey) {
          let list: Array<string> = [dataKey['dataKey']];
          originalList = this.filter(searchKeys[key], list, originalList, true);
        };
      }

    });
    return originalList;
  }
  mergeNewItems(newData: Array<any>, originalList: Array<any>) {
    if (newData.length > 0) {
      if (originalList == undefined || originalList.length == 0) {
        originalList = newData
        return originalList;
      } else {
        originalList = originalList.concat(newData);
        return this.toUnique(originalList, 0, 0);
      }
    }
  }
  toUnique(a: Array<any>, b: number, c: number) { //array,placeholder,placeholder
    var flags = [], output = [], l = a.length, i;
    for (i = 0; i < l; i++) {
      if (flags[a[i]['code']]) continue;
      flags[a[i]['code']] = true;
      output.push(a[i]);
    }

    //b = a.length;
    //while (c = --b)
    //    while (c--) a[b] !== a[c] || a.splice(c, 1);
    // return a // not needed ;)
    return output;
  }

  fastSearch(c: FastSearch) {
    // this.appCode == c.AppCode;
    customDateJson(c);
    c.jsonObject = JSON.stringify(c.objDynamic);
    let body = JSON.stringify(c);
    let headers = createAuthorizationHeader();
    return this._http
      .post(`${this.fastSearchUrl}`, body, { headers: headers }).pipe(
        map(res => {
          let temp = res;
          if (temp && temp['msgData'] && temp['msgData'].length > 0) {
            // alert(temp['msgData'][0].msgBodyEn);
            console.error(temp['msgData'][0].msgBodyEn);
          }
          this.appCode = c.AppCode;
          this.cachSearchData(res, c);
          return temp;
        }));

  }
  cachSearchData(res: any, c: FastSearch) {
    // return ;
    if (this.cachedAppCodes.includes(this.appCode)) {
      if (res) {
        this.cachNewAppCode(c);
        const _key = this.getCachKey(c);
        let cachedData = this.getCachedKey(_key);
        let items = <Array<any>>res.data;
        if (items) {
          items.forEach(item => {
            cachedData[_key][item['code']] = item;
          });
        }
        this._SS.write('FastSearchCached', cachedData);
      }
    }
    else {
      return;
    }
  };
  findInCach(_key: string, code: string) {
    if (this.cachedAppCodes.includes(this.appCode)) {
      let cachedData = this.getCachedKey(_key);
      if (cachedData[_key] && cachedData[_key][code]) {
        return cachedData[_key][code];
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  cachNewAppCode(c: FastSearch) {
    const _key = this.getCachKey(c);
    let cachedData = this.getCachedKey(_key);
    return cachedData;
  }

  getCachKey(c: FastSearch): string {
    let dynamicKeys = Object.keys(c.objDynamic || {});
    let _key = '';
    dynamicKeys.forEach(el => {
      if (el != 'writeValueSearch') {
        if (c.objDynamic[el] instanceof Date) {
          _key = _key + el + dateAsAkey(c.objDynamic[el]);
        } else if (isInteger(c.objDynamic[el])) {
          _key = _key + el + c.objDynamic[el];
        } else if (isDateString(c.objDynamic[el])) {
          _key = _key + el + dateAsAkey(dateFromString(c.objDynamic[el]));
        } else {
          _key = _key + el + c.objDynamic[el];
        }
      }
    })
    return _key = c.AppCode + _key;
  }
  getCachedKey(_key: string) {
    // return {};
    if (this.cachedAppCodes.includes(this.appCode)) {
      let cachedData = this._SS.read('FastSearchCached');
      cachedData = cachedData || {};
      cachedData[_key] = cachedData[_key] || {};
      this._SS.write('FastSearchCached', cachedData);
      return cachedData;
    } else {
      return {};
    }
  };

  getCachedResult(_key: string) {
    let cachedData = this.getCachedKey(_key);
    if (cachedData[_key]) {
      let dataMap = cachedData[_key];
      let data = [];
      Object.keys(dataMap).forEach(element => {
        data.push(dataMap[String(element)]);
      });
      return data;
    } else {
      return [];
    }
  }

  combineApiRequests() { }

  saveNewItem(data: any) {
    return this.httpGeneralService.post<any>(data, `${this.fastSearchUrl}/saveNewItemToSelectize`);
  }

  cachPreferredPageSize(appcode: number, _rows: number) {
    if (_rows > 0 && appcode > 0) {
      const xx = { 'appcode': appcode, 'pageSize': _rows };
      this._SS.write('Selectize' + appcode + 'PageSize', xx);
    }

  }
  getPreferredPageSize(appcode: number): number {
    const xx = this._SS.read('Selectize' + appcode + 'PageSize');
    if (xx && xx['pageSize']) {
      return xx['pageSize'];
    }
    else {

      return 10;
    }
  }

  //////////////////////////////////////////////////
  //   getRxMasterTemplate(emrlookup:any){
  //     return this.httpGeneralService.add(emrlookup,`${this.fastSearchUrl}/LoadRxMasterTemplate`)

  // }
  firstInit = 0;
  EmrCachedData: any;
   getEmrLookupData(lookupCode: number) {

    let cached = this.getEmrCachedData;
    if (cached && Object.keys(cached).length > 0) {
      return of(cached).pipe(map(res => {
        return res[lookupCode];
      }));
    } else {
      return of([]).pipe(map(res => {
        return res[lookupCode];
      }));
      //return this.getEmrLookupDataApi(lookupCode);
    }

  }
  get getEmrCachedData(): any {
    if (this.EmrCachedData)
      return this.EmrCachedData;
    else {
      let obj = localStorage.getItem('emr_lookup');
      this.EmrCachedData = obj && obj.length > 0 ? JSON.parse(obj) : {}
      return obj && obj.length > 0 ? JSON.parse(obj) : {};
    }
  }

  getEmrLookupDataApi(lookupCode: number) {
    return this.httpGeneralService.getWith(`${this.fastSearchUrl}/getEmrLookupData`)
      .pipe(
        map((res: any) => {
          console.log(res)
          if (res) return this.cacheEmrLookupData(res.data, lookupCode);
        })
      );
  }

  cacheEmrLookupData(res: any[], lookupCode: number): any[] {
    let hashMap: any = <any>{};
    if (res && res.length > 0) {
      let groupedData = groupByParentId(res, el => el.parentId);
      let parents: number[] = res.map(el => el.parentId);
      let uniqueIds = parents.filter((el, i, self) => self.indexOf(el) === i);
      uniqueIds.forEach(id => {
        hashMap[id] = groupedData.get(id);
      });
      localStorage.setItem('emr_lookup', JSON.stringify(hashMap));
      return groupedData.get(lookupCode);
    }
  }
}

/// gerneral method to group array with unique id
const groupByParentId = (list, keyGetter) => {
  const map = new Map();
  list.forEach((item) => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
}