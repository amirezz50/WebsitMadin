/// <reference path="../../../ng-bootstrap/index.ts" />
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FastSearchComponent } from './fast-search.component';

import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { SelectizeModule } from '../../selectize/selectize.component';
import { NgbDatepickerModule} from '../../../ng-bootstrap/index';
import { ObjListFilterPipeModule } from "../../pipes/obj-list-filter.pipe";
import { ModalContainerModule } from '../modal-container/modal-container.module';
import { LabSearchModule } from '../../lab-search/lab-search.module';
import { SanabelTooltipModule } from '../../sanabel-tooltip/sanabel-tooltip.module';

@NgModule({
    imports: [
        CommonModule,
        SelectizeModule,
        LabSearchModule,
        ReactiveFormsModule,
        NgbDatepickerModule,
        ModalContainerModule,
        ObjListFilterPipeModule,
        TranslateModule.forChild(),
        SanabelTooltipModule
    ],
    declarations: [FastSearchComponent],
    exports: [FastSearchComponent]
})
export class FastSearchModule {
    static forRoot(): ModuleWithProviders { return { ngModule: FastSearchModule }; }
}
