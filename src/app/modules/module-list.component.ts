import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ModuleService } from './module.service';
import {Module} from './module';
import { ComponentType } from './component-type';

import { ModalService, ToastService } from '../blocks';

@Component({
    selector: 'sanabel-modules',
    templateUrl: './module-list.component.html',
    styleUrls: ['./module-list.component.css']
})
export class ModuleListComponent implements OnInit {
    modules: Module[];
    currentMode: string;
   
    componentType = ComponentType;

    constructor(
        private _moduleService: ModuleService,
        public translate: TranslateService,
        private _modalService: ModalService,
        private _route: ActivatedRoute,
        private _toastService: ToastService) { }



    getModules() {
        this.modules = [];
        this._moduleService.getModulesdata()
            .subscribe(
            modules => { this.modules = modules},
            error => console.log(error),
            () => {null
            });
    }
    

    ngOnInit() {
        this.getModules();

        this._route.params.forEach((params: Params) => {
            this.currentMode = params['mode']; 
        });
    }

    delete(module: Module) {
        this._modalService.activeDelMes(module.nameAr, module.nameEn).then(responseOK => {
            if (responseOK) {
                this._moduleService.deleteModule(module)
                    .subscribe(m => {
                        this._toastService.activate(`Deleted ${module.nameEn}`);
                    }, error => console.log(error),
                    () => this.getModules());
            }
        });
    }
}
