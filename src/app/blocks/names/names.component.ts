import { Component, NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';

import { NameComponent } from './name.component';

//services


@NgModule({  
    imports: [SharedModule],
    declarations: [NameComponent],
    exports: [NameComponent]
})
export class NamesComponent { }


