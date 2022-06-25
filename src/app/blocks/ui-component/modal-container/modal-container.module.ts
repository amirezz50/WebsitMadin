import { DeleteModalComponent } from './../delete-modal/delete-modal.component';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModalContainerComponent } from './modal-container.component';
import { loadedComponent } from './modal-container.component';

import { ReactiveFormsModule,FormsModule } from '@angular/forms';



@NgModule({
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule
    ],
    declarations: [
        ModalContainerComponent,
        loadedComponent,
        DeleteModalComponent
    ],
    exports: [
        ModalContainerComponent,
        loadedComponent,
        DeleteModalComponent
    ]
})
export class ModalContainerModule {
}
