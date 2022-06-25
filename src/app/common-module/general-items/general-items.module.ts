import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemDataPipe } from './item-data-pipes.pipe';
@NgModule({
  declarations: [
    ItemDataPipe
  ],
  imports: [
    CommonModule
  ],
})
export class GeneralItemsModule { }
