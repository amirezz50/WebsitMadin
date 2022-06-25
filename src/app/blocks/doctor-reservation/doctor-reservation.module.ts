import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SharedModule } from "../../shared";
import { BlocksModule } from "../blocks.module";
import { TimeSlotPickerModule } from "../timeSlotPicker/TimeSlotPicker.module";
import { FastSearchModule } from "../ui-component/fast-search/fast-search.module";
import { DoctorReservationComponent } from "./doctor-reservation.component";

@NgModule({
    declarations: [
        DoctorReservationComponent
    ],
    imports: [
      CommonModule,
      BlocksModule,
      SharedModule,
      FastSearchModule,
      TimeSlotPickerModule
        ],
    exports: [
    
    ],
    providers: [
    
    ],entryComponents: [
        DoctorReservationComponent
      ]
  })

export class DoctorReservation {
}
