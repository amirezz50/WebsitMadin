import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabSearchComponent } from './lab-search.component';
import { LabSearchService } from './lab-search.service';
import { SharedModule } from '../../shared';
import { BlocksModule } from '../blocks.module';

@NgModule({
  declarations: [
    LabSearchComponent
  ],
  entryComponents: [
    LabSearchComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    BlocksModule
  ],
  exports: [
    LabSearchComponent
  ],
  providers: [
    LabSearchService
  ]
})
export class LabSearchModule { }
