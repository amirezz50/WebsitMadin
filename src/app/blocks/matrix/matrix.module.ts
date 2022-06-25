import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlocksModule } from '../blocks.module';
import { SharedModule } from '../../shared/shared.module';
import { PinchZoomModule } from 'ngx-pinch-zoom';
import { FastSearchModule } from '../ui-component/fast-search/fast-search.module';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    BlocksModule,
    SharedModule,
    FastSearchModule, 
    PinchZoomModule
  ],
  exports: [
    
  ],
  providers: [
  ]
})
export class MatrixModule {
}
