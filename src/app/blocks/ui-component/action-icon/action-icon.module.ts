import { NgModule } from '@angular/core';
import { IconActionComponent } from './action-icon.component';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material';
import { MatButtonModule } from '@angular/material/button';
import { DomHandler } from '../../../primeng/dom/domhandler';


@NgModule({
    imports: [
        CommonModule,
        MatMenuModule,
        MatButtonModule
        
    ],
    providers:[
      DomHandler
    ],
    declarations: [
        IconActionComponent
    ], 
    exports: [
        IconActionComponent
    ]
})
export class IconActionModule { } 
