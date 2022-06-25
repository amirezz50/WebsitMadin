import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { mergeMap } from 'rxjs/operators';
import { TimeSlotPickerService } from '../../blocks/timeSlotPicker/timeSlotPicker.service';
import { getNgBsObj, OutpatientParms, SharedDateService } from '../../shared';
import { formatDate } from '../portal-new-reservation/portal-new-reservation.component';
import { IDoctorsCards, IReservationFastSerachObj, PortalNewReservationService } from '../portal-new-reservation/portal-new-reservation.service';

@Component({
  selector: 'portal-new-order',
  templateUrl: './portal-new-order.component.html',
  styleUrls: ['./portal-new-order.component.css']
})
export class PortalNewOrderComponent implements OnInit {
  viewOrderAdd: boolean = false;
  regPatVisitVM: any = {};
  resourceType: number = 3;
  selectedSpeciality: any = <any>{};
  specialCode: number;
  selectedDay: FormControl = new FormControl();
  allAvailableDoctors: IDoctorsCards[] = [];
  resoucesTimes: any[] = [];
  doctorsData: IDoctorsCards[] = [];



  constructor(private _dateService: SharedDateService,
    private _timeSlot: TimeSlotPickerService,
    private _newReservation: PortalNewReservationService,

  ) { }

  ngOnInit() {
    this.selectedDay.setValue(getNgBsObj(new Date()));

  }
  specialityClicked(item: any) {
    this.selectedSpeciality = item ? item : <any>{};
    this.specialCode = item ? item.code : null;
    if (item && item.code && !item['AutoEmited']) {
      let objData: IReservationFastSerachObj = {
        specialityId: item.code,
        reservationDate: this._dateService.convertFromNgBsToDate(this.selectedDay.value),
        entityType: 3,
        resourceType: 100
      }
      this.getAvailableDoctors(objData);
    }

  }
  getAvailableDoctors(data: IReservationFastSerachObj) {
    if (data) {
      this._newReservation.getSpecialityDoctors(data)
        .pipe(mergeMap(c => this.getTimesForDoctors(c.data)))
        .subscribe(
          res => {

            if (res && res.data) {
              this.allAvailableDoctors = [];
              this.resoucesTimes = res.data;

              this.doctorsData.forEach(el => {
                el._date = formatDate(new Date(el.reservationDate))
                if (this.resoucesTimes.length > 0) {
                  el.timesAvailable = this.resoucesTimes.filter(t => t.resourceId == el.code);
                  el.shortTimes = this.resoucesTimes.filter((t, i) => t.resourceId == el.code && i <= 4);
                  el.timeFound = el.timesAvailable.length > 0 ? true : false;
                  el.timeNotAvailableMsg = el.timesAvailable.length > 0 ? '' : 'غير متاح اليوم';
                } else {
                  el.timeFound = false;
                  el.timeNotAvailableMsg = 'غير متاح اليوم';
                }
                // if (el.code != this.doctorsData[0].code) {
                //   el.timeFound = false;
                //   el.timeNotAvailableMsg = 'غير متاح اليوم';
                // }
              });

              if (this.doctorsData.length > 0) {
                this.allAvailableDoctors = this.doctorsData;
              }
            }
          })
    }
  }

  getTimesForDoctors(availableDoctors: any[]) {
    if (availableDoctors) {
      this.doctorsData = availableDoctors;
      let outpatient: OutpatientParms = <OutpatientParms>{
        ResourceType: 100,
        entityType: 3,
        DocCode: availableDoctors[0].code,
        ReservationDate: this._dateService.convertFromNgBsToDate(this.selectedDay.value),
        specialityId: this.specialCode,
        resources: availableDoctors.map(d => { return d.code }).toString()
      };
      return this._timeSlot.GetTimeSlots(outpatient);
    }
  }
  doctorClicked(e: any) {

  }
  clinicClicked(e: any) {

  }


  orderAddFinished(e) {
    console.log('order finished => ', e);
  }
  bookCheckUp() {
    this.regPatVisitVM.startDateNgb = this._dateService.convertFromNgBsToDate(this.regPatVisitVM.startDateNgb);
    this._newReservation.addBookCheckUp(this.regPatVisitVM)
  }

}
