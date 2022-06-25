import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SanabelTooltipComponent } from './sanabel-tooltip.component';
import { SanabelTooltipDirective } from './sanabel-tooltip.directive';

@NgModule({
  declarations: [
    SanabelTooltipComponent,
    SanabelTooltipDirective
  ],
  exports: [
    SanabelTooltipComponent,
    SanabelTooltipDirective
  ],
  entryComponents: [
    SanabelTooltipComponent
  ],
  imports: [
    CommonModule
  ]
})
export class SanabelTooltipModule { }
