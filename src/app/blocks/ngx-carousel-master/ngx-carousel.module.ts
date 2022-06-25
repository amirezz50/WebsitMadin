import { NgxCarouselItemDirective, NgxCarouselNextDirective, NgxCarouselPrevDirective } from './ngx-carousel/ngx-carousel.directive';
//import { HammerGesture HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgxCarouselComponent } from './ngx-carousel/ngx-carousel.component';
import { NgxItemComponent } from './ngx-item/ngx-item.component';
import { NgxTileComponent } from './ngx-tile/ngx-tile.component';
import { CarouselViewerComponent } from './carousel-viewer/carousel-viewer.component';

//export class MyHammerConfig extends HammerGestureConfig {
//  overrides = <any>{
//    'swipe': { velocity: 0.4, threshold: 20 }, // override default settings
//    'pan': { velocity: 0.4, threshold: 20 }
//  };
//}

@NgModule({
  imports: [CommonModule],
  exports: [
    NgxCarouselComponent,
    NgxItemComponent,
    NgxTileComponent,
    CarouselViewerComponent ,
    NgxCarouselItemDirective,
    NgxCarouselNextDirective,
    NgxCarouselPrevDirective
  ],
  declarations: [
    NgxCarouselComponent,
    NgxItemComponent,
    NgxTileComponent,
    NgxCarouselItemDirective,
    NgxCarouselNextDirective,
    NgxCarouselPrevDirective,
    CarouselViewerComponent
  ],
  providers: [
    //{ provide: HAMMER_GESTURE_ useClass: MyHammerConfig }
  ],
})
export class NgxCarouselModule { }
