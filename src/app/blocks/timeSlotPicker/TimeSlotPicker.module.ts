import { NgModule } from "@angular/core";
import { BlocksModule } from "../blocks.module";
import { SharedModule } from "../../shared";
import { TimeSlotPickerComponent } from "./timeSlotPicker.component";
import { MonthlyResourcesSlotViewComponent } from "../monthly-resources-slot-view/monthly-resources-slot-view.component";
import { TimeSlotPickerService } from "./timeSlotPicker.service";

@NgModule({
  imports: [
    BlocksModule,
    SharedModule
  ],
  declarations: [
    TimeSlotPickerComponent,
    MonthlyResourcesSlotViewComponent
  ],
  exports: [
    TimeSlotPickerComponent,
    MonthlyResourcesSlotViewComponent
  ],
  providers: [
    TimeSlotPickerService
  ],
  entryComponents: [TimeSlotPickerComponent]
})

export class TimeSlotPickerModule { }