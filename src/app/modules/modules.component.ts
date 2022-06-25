import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { routedComponents, ModulesRoutingModule } from './modules.routing';
import { ModuleService } from './module.service';

/*
 ===========================================================================================
    Our modules feature's component want to use the shared features like mateial design
      **Modules do no inherit each other, so even though
        the ModulesModule is going to be imported by the AppModule
        (which imports the SharedModule already)
       the ModulesModule cannot access the shared features ... unless we import SharedModule.
 =============================================================================================
*/

import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [ModulesRoutingModule, SharedModule, CommonModule],
  declarations: [routedComponents]
})
export class ModulesComponent { }
