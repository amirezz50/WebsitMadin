import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'dev-express-viewer',
  template: `
         <iframe *ngIf="isSended" [src]="trustedUrl" name="my-iframe" style="width:100%;" height="750" >
            <p>Your browser does not support iframes.</p>
         </iframe>
    `,
  styles: []


})
export class DevExpressViewerComponent implements OnInit {

  @Input() url: string;
  @Input() reportClassName: string;
  @Input() reportActionName: string;
  @Input() reportControllerName: string;
  @Input() appCodes: number[] = [];

  isSended: boolean = false;

  trustedUrl: SafeResourceUrl;

  _arguments = {};

  @Input() get arguments() {
    return this._arguments;
  }

  set arguments(val) {

    this._arguments = val;
    console.log(this._arguments);
    let querystring = '';
    if (this.arguments) {
      if (this.arguments['reportClassName']) {
        this.reportClassName = this.arguments['reportClassName'];
        this.reportControllerName = this.arguments['reportControllerName'];
        this.reportActionName = this.arguments['reportActionName'];
        delete this.arguments['reportClassName'];
      }

      for (var key in this._arguments) {
        if (this._arguments.hasOwnProperty(key)) {
          if (!(this._arguments[key] instanceof Date) && this._arguments[key] != undefined) {
            querystring = `${querystring}&${key}=${this._arguments[key]}`;
          }

        }
      }
      if (this.appCodes.length > 0) {
        querystring = `${querystring}&appCodes=${this.appCodes.join(',')}`;
      }
      this.isSended = true;


      this.trustedUrl = this.sanitizer
        .bypassSecurityTrustResourceUrl(`${this.url}/${this.reportControllerName}/${this.reportActionName}/?name=${this.reportClassName}${querystring}`);



    }
  }



  constructor(private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    
    //this.trustedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);

  }

}


