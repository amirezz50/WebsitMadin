import { Injectable } from '@angular/core';
import { Module } from './module';
import { ComponentType } from './component-type';

import { HttpGeneralService } from '../shared/http-general.service';
import { CONFIG } from '../shared/config';
let moduleUrl = CONFIG.baseUrls.modules;
let branchUrl = CONFIG.baseUrls.branches;
let newSecLoginsUrl = CONFIG.baseUrls.auth;

@Injectable()
export class ModuleService {
    constructor(private httpGeneralService: HttpGeneralService) { }


    // return all modules without filteration
    getModulesdata() {

        return this.httpGeneralService.getWith(`${moduleUrl}/all`);
    }


    // return all modules without paging or filteration

    getAllComponents() {

        return this.httpGeneralService.getWith(`${moduleUrl}/notPaged`);

    }

    // search in modules by name or code
    searchModules(k?: string) {
        let keyword = k || " ";

        return this.httpGeneralService.getWith(`${moduleUrl}/search/${keyword}`);

    }
    //loadPreviliges(k?: string) {
        // let keyword = k || " ";
    loadPreviliges(id?: number) {
        return this.httpGeneralService.getWith(`${moduleUrl}/previliges/${id}`);
    }


    searchSubModulesObj(module: Module) {

        return this.httpGeneralService.add(module, `${moduleUrl}/search`);

    }

    // only parent modules
    getParentModules() {

        return this.httpGeneralService.getWith(moduleUrl);

    }


    // only submodules
    getSubModules(id: number) {

        return this.httpGeneralService.getWith(`${moduleUrl}/${id}/modules`);
    }

    // only modules of specific type
    getSubModulesTypes(id: number, type: ComponentType) {

        return this.httpGeneralService.getWith(`${moduleUrl}/${id}/${type}`);
    }



    // get all modules under sepecfic branch
    getBranchModules(id: number) {

        return this.httpGeneralService.getWith(`${branchUrl}/${id}/modules`);
    }



    addModule(module: Module) {
        return this.httpGeneralService.add(module, `${moduleUrl}`);


    }


    // get single module
    getModule(id: number) {

        return this.httpGeneralService.getWith(`${moduleUrl}/${id}`);
    }


    updateModule(module: Module) {
        return this.httpGeneralService.update(module.code, module, `${moduleUrl}`);


    }

    deleteModule(module: Module) {
        return this.httpGeneralService.delete(module.code, `${moduleUrl}`);

    }

}
