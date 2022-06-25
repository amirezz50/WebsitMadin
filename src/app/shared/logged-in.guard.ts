import {of as observableOf,  Observable } from 'rxjs';
import { Injectable } from '@angular/core';

import {
    CanActivate, Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';

import { AuthService } from './auth.service';

@Injectable()
export class LoggedInGuard implements CanActivate {

    constructor(private _authService: AuthService, private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        let url: string = state.url;
        return observableOf(this.checkLogin(url));
    }

    checkLogin(url: string): boolean {
        if (url != 'login') {
            if (this._authService.checkIfLogged()) {
                return (this.CheckUrlAuthroze(url) !== undefined);
            } else {
                // Navigate to the login page with extras
                this.router.navigateByUrl('/login');
                return false;
            }
        }
        return false;
        // Store the attempted URL for redirecting
        //this.authService.redirectUrl = url;
    }

    CheckUrlAuthroze(url: string) {
        return this._authService.userLinksCheck(url);
    }


}