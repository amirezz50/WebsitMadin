import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'html-viewer',
  templateUrl: './html-viewer.component.html',
  styles: []

})
export class HtmlViewerComponent implements OnInit {

  @Input() url: string;
  @Input() reportClassName: string;
  @Input() reportName: string;
  @Input()  appCodes: number[] = [];
  isSended: boolean = false;

  trustedUrl: SafeResourceUrl;

  _arguments = {};

  @Input() get arguments() {
    return this._arguments;
  }

  set arguments(val) {
    //if (!this._arguments['reportClassName'])
    //{
    //this._arguments = val;
    //}
    this._arguments = val;
    // if(val&&val['reportClassName']){
    //   if(!this.reportName){
    //     this.reportName=val['reportClassName']
    //   }
    // }
    let querystring = '';
    if (this.arguments) {
      if (this.arguments['reportClassName']) {
        this.reportClassName = this.arguments['reportClassName'];
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
        .bypassSecurityTrustResourceUrl(`${this.url}/?name=${this.reportClassName}${querystring}`);
      //this.trustedUrl = this.sanitizer
      //    .bypassSecurityTrustResourceUrl(`${this.url}?name=${this.reportClassName}`);


      //this.post(`${this.url}?name=${this.reportClassName}`, val, 'post');
    }
  }

  post(path, params, method) {
    method = method || "post"; // Set method to post by default if not specified.

    // The rest of this code assumes you are not using a library.
    // It can be made less wordy if you use one.
    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", path);
    form.setAttribute("target", 'my-iframe');

    for (var key in params) {
      if (params.hasOwnProperty(key)) {
        var hiddenField = document.createElement("input");
        hiddenField.setAttribute("type", "hidden");
        hiddenField.setAttribute("name", key);
        hiddenField.setAttribute("value", params[key]);

        form.appendChild(hiddenField);
      }
    }

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);

  }

  constructor(private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    //this.trustedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);

  }

}


