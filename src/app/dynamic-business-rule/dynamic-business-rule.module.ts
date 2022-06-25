
import { NgModule } from '@angular/core';
//my component
import { DbrTapsComponent } from './dbr-taps-dev';
import { DbrTapsUserComponent } from './dbr-taps-user';
import {DprSetupComponent } from './dpr-setup';
import { DbrParmsComponent } from './dbr-parms';
import { DbrParmsUserComponent } from './dbr-parms-user';
import { DbrSetupUserComponent } from './dbr-setup-user';
import { DbrOutputsComponent } from './dbr-outputs';


//my services
import { DbrSetup,DprSetupService } from './dpr-setup/dpr-setup-component.service';
import { DbrParms, DbrParmsService } from './dbr-parms/dbr-parms.component.service';
import { DbrOutput, DbrOutputsService } from './dbr-outputs/dbr-outputs-component.service';


import { DbrParmsUserService , DbrParmsUser} from './dbr-parms-user/dbr-parms-user.component.service';
import {DbrSetupUserService ,DbrSetupUser } from './dbr-setup-user/dbr-setup-user.component.service';
// shared modle 
import { SharedModule } from '../shared/shared.module';
import { BlocksModule } from '../blocks/blocks.module';
import { FastSearchModule } from '../blocks/ui-component/fast-search/fast-search.module';
// modules 
import { DynamicBusinessRuleRoutingModule } from './dynamic-business-rule-route.module';

// ************************  Components & Services  ********************************
// dynamic business rule

@NgModule({
    imports: [
        BlocksModule,
        SharedModule,
        FastSearchModule,
        DynamicBusinessRuleRoutingModule
    ],
    providers: [
      DprSetupService,
      DbrParmsService,
      DbrOutputsService,
      DbrParmsUserService,
      DbrSetupUserService
    ],
    declarations: [
      DbrTapsComponent,
      DprSetupComponent,
      DbrParmsComponent,
      DbrOutputsComponent,
      DbrSetupUserComponent,
      DbrParmsUserComponent,
      DbrTapsUserComponent
    ]
})

export class DynamicBusinessRuleModule { }