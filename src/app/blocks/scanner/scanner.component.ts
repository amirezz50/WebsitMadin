// import { Component, OnInit, EventEmitter, Output } from '@angular/core';
// /** Images scanned so far. */

// @Component({
//     selector: 'scanner-viewer',
//     templateUrl: 'scanner.component.html',
//     styles: ['./scanner.component.css']

// })
// export class ScannerComponent implements OnInit {
//     @Output() ScanResult: EventEmitter<string> = new EventEmitter<string>();
//     interval;
//     waitingSec = 0 ; 
//     constructor() {
//     }

//     ngOnInit() {
     
//     }
//     newScan(){
//         this.startTimer();
//     }

//     startTimer() {
//         this.interval = setInterval(() => {
//            console.log(' timer tick ');
//            this.waitingSec = this.waitingSec +   2 ; 
//             if( eval('imagesScannedInCurrentScan.length') > 0  || this.waitingSec > 50  ){
//                 this.pauseTimer();
//             }
//         },2000);
//     }
    
//     pauseTimer() {
//         console.log(' timer close ');
//         this.waitingSec = 0  ;
//         let   base64 = eval('imagesScannedInCurrentScan[0].src')  ;
//         eval('imagesScannedInCurrentScan = []')  ; 
//         this.ScanResult.emit(base64);
//         clearInterval(this.interval);
//     }
// }


