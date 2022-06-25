import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModuleComponent } from './module.component';
import { ModuleListComponent } from './module-list.component';


const routes: Routes = [
    {  path: 'modules', component: ModuleListComponent, pathMatch: 'full'},
    {  path: 'modules/:id', component: ModuleComponent},    
    {  path: 'modules/:id/:parentId', component: ModuleComponent}
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class ModulesRoutingModule { }

export const routedComponents = [ModuleListComponent, ModuleComponent];  
