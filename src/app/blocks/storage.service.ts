import { Injectable } from '@angular/core';


export  interface fastSearchInterface {
    key : string ,
    value : any ;
}
@Injectable()
export class StorageService {
    write(key: string, value: any) {
        if (value) {
            value = JSON.stringify(value);
        }
        localStorage.setItem(key, value);
    }
    clear() {
        localStorage.clear();
    }

    removeItem(key: string) {
        localStorage.removeItem(key);
    }

    read<T>(key: string): T {
        let value = localStorage.getItem(key);
        if (value && value != "undefined" && value != "null") {
            const dd = <T>JSON.parse(value);
            return <T>JSON.parse(value);
        }
        return null;
    }
    readRaw(key: string): any {
        return localStorage.getItem(key);
    }
    cachAppCodes(mainKey: string, appCodes: any[], _data: any[]) {
        this.write(mainKey + this.getAppCodeKey(appCodes), _data);
    }
    getAppCodeKey(appCodes: any[]): string {
        appCodes = appCodes || [];
        let currentUser = JSON.parse(sessionStorage.getItem('currentUser') ? sessionStorage.getItem('currentUser') : sessionStorage.getItem('currentPatient'));
        return (currentUser.secLoginId ? currentUser.secLoginId : currentUser.code) + appCodes.join('_');
    }
    getCachedAppCodes(mainKey: string, appCodes: any[]): any[] {
        const _key = this.getAppCodeKey(appCodes);
        const cachedData = <Array<any>>this.read(mainKey + _key);
        return cachedData || [];
    }
}


