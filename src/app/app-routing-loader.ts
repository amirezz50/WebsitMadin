// import { PreloadingStrategy, Route } from '@angular/router';

// import { Observable } from 'rxjs/Observable';
// import { of } from 'rxjs/observable/of';
// // used to allow preload feature for current user
// export class AppCustomPreloader implements PreloadingStrategy {
//     // .. contain user modules names
//     private userRoutes = [];
//     preload(route: Route, load: Function): Observable<any> {
//         if (this.userRoutes.find(item => item.toString() === route.path.toString())) {
//             return load();
//             // return route.data && route.data.preload ? load() : of(null);
//         } else {
//             of(null);
//         }
//     }
// }
