import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
declare var scanner: any;
// import  scanner from 'scanner.js';
@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.scss']
})
export class ScannerComponent implements OnInit {

  _imageBase64: any;
  imagesScanned: any[] = [];
  constructor(@Inject(DOCUMENT) private document: Document) { }
  ngOnInit(): void {

  }


  scanToJpg() {
    scanner.scan(this.displayImagesOnPage.bind(this),
      {
        output_settings: [
          {

            "type": "return-base64",
            "format": "jpg"
          }
        ]

      });
  }


  displayImagesOnPage(successful: boolean, mesg: string, response: any) {
    // var self = this;
    if (!successful) { // On error
      console.error('Failed: ' + mesg);
      return;
    }

    if (successful && mesg != null && mesg.toLowerCase().indexOf('user cancel') >= 0) { // User cancelled.
      console.info('User cancelled');
      return;
    }

    var scannedImages = scanner.getScannedImages(response, true, false);
    // returns an array of ScannedImage
    for (var i = 0; (scannedImages instanceof Array) && i < scannedImages.length; i++) {
      var scannedImage = scannedImages[i];
     
      //  this.processScannedImage(scannedImage);
    }
    console.log(scannedImage);
  }


  /** Processes a ScannedImage */
  // processScannedImage(scannedImage:any) {
  //     this.imagesScanned.push(scannedImage);
  //     var elementImg = scanner.createDomElementFromModel( {
  //         'name': 'img',
  //         'attributes': {
  //             'class': 'scanned',
  //             'style':'height:200px;margin-right: 12px;',
  //             'src': scannedImage.src
  //         }
  //     });
  //     this.document.getElementById('images')?.appendChild(elementImg);
  // }

}
