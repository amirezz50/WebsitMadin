import { Component, Input, OnInit, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { CanDeactivate, Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';

//shared libs

//services
import { ComponentType} from './component-type';
import { Module } from './module';
import { Options } from '../blocks/selectize/options';
import { ControlsParams } from '../common/controls/controls-params';
import { SelectizeComponent } from '../blocks/selectize/selectize.component';
import { ModuleService } from './module.service';
import { EntityService } from '../blocks/entity.service';
import { ModalService } from '../blocks/modal/modal.service';
import { ToastService } from '../blocks/toast/toast.service';
import { AppCodeGroup } from '../common/controls/appcode-group';



@Component({
    selector: 'sanabel-module',
    templateUrl: './module.component.html',
    encapsulation: ViewEncapsulation.None
})

export class ModuleComponent implements OnInit {

    // public moduleForm: FormGroup; // our model driven form
    @Input() module: Module;
    editModule: Module = <Module>{};
    selectizeOptions: Options;
    moduleList: Module[];
    currentParent: Module;
    controlsParams: ControlsParams;
    moduleForm: FormGroup;
    @ViewChild(SelectizeComponent, {static: false}) selectize: SelectizeComponent;

    constructor(
        private _moduleService: ModuleService,
        private _entityService: EntityService,
        private _modalService: ModalService,
        private _router: Router,
        private _route: ActivatedRoute,
        private _location: Location,
        private _fb: FormBuilder,
        private _toastService: ToastService) {
        this.controlsParams = new ControlsParams(3120, AppCodeGroup.Buttons, true);


    }

    onClicked(e: number): void {
        switch (e) {
            case 1: //save code
                this.save();
                break;
            case 3:
                this.delete();
                break;
            default:
                this.cancel();

        }
    }

    ngOnInit() {
        this._getModule();
    }
    ngAfterViewInit() {
    }
    //#region Crud operations

    private _getModule() {
        let id = +this._route.snapshot.params['id'];

        let defaultParent = 0;
        if (this.isAddMode()) {

            if (this.haveParent()) {
                defaultParent = +this._route.snapshot.params['parentId'];
            }

            this.module = <Module>{
                nameEn: '', nameAr: '',
                code: 0, branchId: 1,
                parentCode: defaultParent,
                levelNo: 1, compType: ComponentType.Setup,
                iconName: '', active: true,
                routePath: '', lastModifyAdminId: 1
            };

            this.editModule = this._entityService.clone(this.module);
            this.initlizeControls();
        } else {
            this._moduleService.getModule(id)
                .subscribe(
                module => this._setEditModule(module),
                error => console.log("error loading modules"),
                () => this.initlizeControls());
        }


    }

    save() {

        let module = this.module = this._entityService.merge(this.module, this.editModule);


        if (module.code == 0 || module.code == null) {
            module.parentCode = this.selectizeOptions.selected.code;
            this._moduleService.addModule(module)
                .subscribe(mod => {
                    this._setEditModule(mod);
                    this._toastService.activate(`Successfully added ${mod.nameEn}`);
                    this._goBack();
                });
            return;
        }else{
        this._moduleService.updateModule(module)
            .subscribe(() => this._toastService.activate(`Successfully saved ${module.nameEn}`));
        }
    }

    cancel(showToast = true) {
        this.editModule = this._entityService.clone(this.module);
        this._goBack();
    }

    delete() {
        let msg = `Do you want to delete ${this.module.nameEn}?`;
        this._modalService.activate(msg).then(responseOK => {
            if (responseOK) {
                this.cancel(false);
                this._moduleService.deleteModule(this.module)
                    .subscribe(() => {
                        this._toastService.activate(`Deleted ${this.module.nameEn}`);
                        this._goBack();
                    });
            }
        });
    }

    initlizeControls() {
        this.moduleForm = this._fb.group({
            nameEn: [this.module.nameEn, Validators.required],
            nameAr: [this.module.nameAr, Validators.required],
            code: this.module.code,
            branchId: this.module.branchId,
            parentCode: this.module.parentCode,
            levelNo: [this.module.levelNo, Validators.required],
            compType: [this.module.compType, Validators.required],
            iconName: [this.module.iconName, Validators.required],
            active: this.module.active,
            routePath: [this.module.routePath, Validators.required],
            lastModifyAdminId: this.module.lastModifyAdminId
        });
    }
    //#endregion 


    //#region helpers

    private _handleServiceError(op: string, err: any) {
        console.error(`${op} error: ${err.message || err}`);
    }

    private _isDirty() {
        return this._entityService.propertiesDiffer(this.module, this.editModule);
    }

    private _setEditModule(module: Module) {
        if (module) {
            this.module = module;
            this.editModule = this._entityService.clone(this.module);
        } else {
            this._goBack();
        }
    }

    canDeactivate(): Promise<boolean> | boolean {
        return !this.module ||
            !this._isDirty() ||
            this._modalService.activate();
    }


    getModuleList(k?: string): Observable<Module[]> {
        return this._moduleService.searchModules(k);
    }


    

    isAddMode() {
        let id = +this._route.snapshot.params['id'];
        return isNaN(id) || id == 0;
    }

    haveParent() {
        let parentId = +this._route.snapshot.params['parentId'];
        return !isNaN(parentId) && parentId != 0;
    }

    _goBack(): void {
        //this._location.back();
        this._router.navigate(['modules']);
    }
    //#endregion 
}
