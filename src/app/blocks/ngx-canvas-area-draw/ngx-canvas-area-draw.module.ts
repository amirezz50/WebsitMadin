import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxCarouselModule } from '../ngx-carousel-master/ngx-carousel.module';
import { FormsModule } from '@angular/forms';
import { CanvasAreaDraw } from './ngx-canvas-area-draw.directive';
import { CanvasMarkerComponent } from './canvas-marker/marker.component';
import { ControlsModule } from '../controls/controls.module';
import { ModalContainerModule } from '../ui-component/modal-container/modal-container.module';
import { SanabelTooltipModule } from '../sanabel-tooltip/sanabel-tooltip.module';

@NgModule({
  declarations: [
    CanvasMarkerComponent,
    CanvasAreaDraw
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgxCarouselModule,
    ControlsModule,
    ModalContainerModule,
    SanabelTooltipModule
  ],
  exports: [
    CanvasMarkerComponent,
    CanvasAreaDraw
  ]
})
export class NgxCanvasModule {
}
