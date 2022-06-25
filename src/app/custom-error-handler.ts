import { Component, NgModule, ErrorHandler, Injectable, Injector, NgZone } from '@angular/core';
import { Router, RouteReuseStrategy, ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';


let hasRouterError = false;

@Injectable()
export class CustomErrorHandler implements ErrorHandler {
  constructor(
    // private inj: Injector
   private zone: NgZone
    // , private router: Router
  ) { }

  handleError(error: any): void {
    console.error('CustomErrorHandler: ' + error);
    this.zone.run(() => console.log(''));
    // if (hasRouterError) {
    //   let router = this.inj.get(Router);
    //   router.navigated = false;
    // }

  }
}

// export function MyRouterErrorHandler(error: any) {
//   console.log('RouterErrorHandler: ' + error);
//   hasRouterError = true;
//   throw error;
// }

// export class PreventErrorRouteReuseStrategy implements RouteReuseStrategy {
//   shouldDetach(route: ActivatedRouteSnapshot): boolean { return false; }
//   store(route: ActivatedRouteSnapshot, detachedTree: DetachedRouteHandle): void { }
//   shouldAttach(route: ActivatedRouteSnapshot): boolean { return false; }
//   retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null { return null; }
//   shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
//     if (hasRouterError) {
//       hasRouterError = false;
//       return false;
//     }
//     return future.routeConfig === curr.routeConfig;
//   }
// }
