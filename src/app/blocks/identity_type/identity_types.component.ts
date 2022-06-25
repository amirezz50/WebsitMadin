import { Component, NgModule } from '@angular/core';
import { IdentityTypeComponent } from './identity_type.component';
import { SharedModule } from '../../shared/shared.module';
import { IdentityTypeService } from './identity_type.service';

//services


@NgModule({
    imports: [SharedModule],
    declarations: [IdentityTypeComponent],
    exports:[IdentityTypeComponent]
})
export class IdentityTypesComponent { }
