
import { of as observableOf, Observable, Observer } from 'rxjs';

import { share, map } from 'rxjs/operators';
import { Injectable, EventEmitter, Optional } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import "rxjs/add/observable/of";
import "rxjs/add/operator/share";
import "rxjs/add/operator/map";
import "rxjs/add/operator/merge";
import "rxjs/add/operator/toArray";

import { Parser } from "./loader.parser";


declare interface Window {
    navigator: any;
}
declare var window: Window;

export abstract class MissingSettingHandler {
    abstract handle(key: string): any;
}

export abstract class Loader {
    abstract getSetting(fileName: string, prefix: string): Observable<any>;
}

export class StaticLoader implements Loader {
    constructor(private http: HttpClient, private prefix: string = "setting", private suffix: string = ".json") {
    }

    /**
     * Gets the settings from the server
     * @param fileName
     * @returns {any}
     */
    public getSetting(fileName: string, prefix: string = 'setting'): Observable<any> {
        var date = new Date();
        var timestamp = date.getTime();
        return this.http.get(`${prefix}/${fileName}${this.suffix}?timestamp=${timestamp}`).pipe(
            map((res) => res));
    }
}

@Injectable()
export class LoaderService {

    private pending: any;
    private settings: any = {};
    private files: Array<string> = [];
    private parser: Parser = new Parser();

    /**
     *
     * @param http The Angular 2 http provider
     * @param currentLoader An instance of the loader currently used
     */
    constructor(public currentLoader: Loader) {
    }

    /**
     * Gets an object of settings for a given filename with the current loader
     * @param lang
     * @returns {Observable<*>}
     */
    public getSettings(fileName: string, prefix: string): Observable<any> {
        //---get url.json  or  any  setting file
        this.pending = this.currentLoader.getSetting(fileName, prefix).pipe(share());
        this.pending.subscribe((res: Object) => {
            this.settings[fileName] = res;
        }, (err: any) => {
            throw err;
        }, () => {
            this.pending = undefined;
        });

        return this.pending;
    }




    /**
     * Returns the parsed result of the settings
     * @param settings
     * @param key
     * @param interpolateParams
     * @returns {any}
     */
    private getParsedResult(settings: any, key: any, interpolateParams?: Object): any {
        let res: string | Observable<string>;

        if (key instanceof Array) {
            let result: any = {},
                observables: boolean = false;
            for (let k of key) {
                result[k] = this.getParsedResult(settings, k, interpolateParams);
                if (typeof result[k].subscribe === "function") {
                    observables = true;
                }
            }
            if (observables) {
                let mergedObs: any;
                for (let k of key) {
                    let obs = typeof result[k].subscribe === "function" ? result[k] : observableOf(result[k]);
                    if (typeof mergedObs === "undefined") {
                        mergedObs = obs;
                    } else {
                        mergedObs = mergedObs.merge(obs);
                    }
                }
                return mergedObs.toArray().map((arr: Array<string>) => {
                    let obj: any = {};
                    arr.forEach((value: string, index: number) => {
                        obj[key[index]] = value;
                    });
                    return obj;
                });
            }
            return result;
        }

        if (settings) {
            res = this.parser.interpolate(this.parser.getValue(settings, key), interpolateParams);
        }


        return res !== undefined ? res : key;
    }

    /**
     * Gets the setting value of a key (or an array of keys)
     * @param key
     * @param interpolateParams
     * @returns {any} the setting key, or an object of setting keys
     */
    public get(key: string | Array<string>, interpolateParams?: Object): Observable<string | any> {
        if (!key) {
            throw new Error(`Parameter "key" required`);
        }

        // check if we are loading a new setting to use
        return Observable.create((observer: Observer<string>) => {
            let onComplete = (res: string) => {
                observer.next(res);
                observer.complete();
            };
            this.pending.subscribe((res: any) => {
                res = this.getParsedResult(res, key, interpolateParams);
                if (typeof res.subscribe === "function") {
                    res.subscribe(onComplete);
                } else {
                    onComplete(res);
                }
            });
        });
    }
}