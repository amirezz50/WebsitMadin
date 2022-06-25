import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Medical, PortalReservationsHistoryService } from '../portal-reservations-history/portal-reservations-history.service';

@Component({
  selector: 'portal-unique-doctors',
  templateUrl: './portal-unique-doctors.component.html',
  styleUrls: ['./portal-unique-doctors.component.css']
})
export class PortalUniqueDoctorsComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  uniqueDoctors: any[] = [];

  constructor(private _medicalService: PortalReservationsHistoryService) { }

  ngOnInit() {
    this.getUiqueDoctors();
  }

  async getUiqueDoctors() {
    await this._medicalService.getUniquePortalDoctors(<Medical>{})
      .then(
        (res) => {
          if (res && res.returnFlag) this.uniqueDoctors = res.data;
          this.uniqueDoctors.forEach(el => {
            el.genderEn = el.genderEn ? (el.genderEn as string).toLowerCase() : 'avatar';
          })
        },
        (err) => console.error(err));
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
