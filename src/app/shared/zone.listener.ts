import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class ZoneListener {
    constructor(private ngZone: NgZone, private router: Router) {
        //    this.ngZone.onStable.subscribe(this.onZoneStable);
        //    this.ngZone.onUnstable.subscribe(this.onZoneUnstable);
        this.ngZone.onError.subscribe(this.onZoneError);
    }

    //  onZoneStable() {
    //    console.log('ZoneListener: We are stable');
    //  }

    //  onZoneUnstable() {
    //    console.log('ZoneListener: We are unstable');
    //  }

    onZoneError(error) {
        this.ngZone.run(() => this.router.navigate(['/error']));
        console.error('ZoneListener: Error', error instanceof Error ? error.message : error.toString());
    }
}
