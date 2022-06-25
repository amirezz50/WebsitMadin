import {
  Component, ViewEncapsulation,
  Input, Output, OnChanges, ElementRef,
  EventEmitter, AfterViewInit, NgModule, OnInit, ViewChild, OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ExportAsConfig, ExportAsService } from 'ngx-export-as';
@Component({
  selector: 'app-print-page',
  encapsulation: ViewEncapsulation.None,
  template: `
     <section id="{{section}}_abc" [ngStyle]="pgStyle"  class="printpage" size="A4" [style.width.cm]="width" [style.height.cm]="height">
       <button (click)="printDiv()"
          class="btn btn-sm btn-info">
          <i class="fa fa-print"></i>Print</button> 
      <iframe   #printHtml5Iframe style="width:100%;height:100%" ></iframe>
     <div id="printpage">
     </div>
    </section>
    `

})
export class PrintComponent implements OnChanges {

  cssRefs = `<link rel="stylesheet" href="assets/css/gutenberg.css" media="screen,print"> 
  <link type="text/css" rel="stylesheet" href="assets/css/fontawesome-all.min.css">
  <link type="text/css" rel="stylesheet" href="assets/css/vendor/bootstrap/bootstrap.min.js">
  <link rel="stylesheet" href="assets/css/emrgeneralprint.css" > 
  `;
  sectionCss = '';
  @ViewChild('printHtml5Iframe', { static: false }) printHtml5Iframe: ElementRef;
  @Input('section') section: string;
  @Input() pgStyle: string;
  @Input() includefontAwsom: boolean = true
  @Input('excludeCss') excludeCss = false;
  @Input() set autoPrint(value) {
    //&&  this._AutoPrint == 0
    if (value   ) {
      setTimeout(() => {
        this._AutoPrint = 1 ;
        this.PrintView();
        this.printDiv();
      }, 200);
    }
  }
  _AutoPrint:number  = 0 ;
  @Input() printServer: boolean = false;
  _fileName
  @Input() set fileName(name) {
    if (name) {
      this._fileName = name
    }
  };
  @Input() printNo: number = 1;
  @Input() width: number;
  @Input() height: number;

  @Output() sectionChange = new EventEmitter<any>();

  constructor(private ele: ElementRef,
    private _exportAsService: ExportAsService,
    public translate: TranslateService) {
    if (this.section === undefined) {
      this.section = '';
    }
  }

  ngOnChanges(changes) {
    if (changes.section && changes.section.currentValue !== undefined
      && changes.section.currentValue !== '') {

        

    }

  }
  PrintView() {
    // console.log('width: ', this.width, 'height: ', this.height);
    let iframedoc = this.printHtml5Iframe.nativeElement['contentWindow'];
    if (iframedoc && iframedoc.document) {
      iframedoc = this.printHtml5Iframe.nativeElement['contentWindow'].document;
    }
    if (iframedoc && iframedoc.body)
      iframedoc.body.outerHTML = this.getHtmlForView();

  }

  getHtmlForView() {
    const _section = document.getElementById(this.section);
    if (this.excludeCss) {
      this.cssRefs = '';
    }
    let html;
    if (this.translate.currentLang == 'ar') {
      html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8"/>
             ${this.cssRefs}
          </head>
          <body style ="direction : rtl">
              <div class="reward-body body">
                ${_section.innerHTML}
              </div>
          </body>
        </html>`;
    } else if (this.translate.currentLang == 'en') {
      html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8"/>
           ${this.cssRefs}
        </head>
        <body style ="direction : ltr  ">
            <div class="reward-body body">
              ${_section.innerHTML}
            </div>
        </body>
      </html>`;

    }
    return html;
  }
  afterPrint() {

    console.log('after print');
    this.ele.nativeElement.children[0].innerHTML = '';
    this.sectionChange.emit('');
    this.section = '';

  }
  /*
  printDiv() {
  
    if (this.section && this.section !== undefined && this.section !== '') {
      const originalContents = document.body.innerHTML;
  
      if (window) {
        if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
          const popup = window.open('', '_blank',
            `width=600,height=600,scrollbars=no,menubar=no,toolbar=no, location=no,status=no,titlebar=no`);
  
          popup.window.focus();
          popup.document.write(this.getHtmlForPrint());
          popup.onbeforeunload = function (event) {
            popup.close();
            return '.\n';
          };
          popup.onabort = function (event) {
            popup.document.close();
            popup.close();
          };
        } else {
          const popup = window.open('', '_blank', 'width=800,height=600');
          popup.document.open();
  
          popup.document.write(this.getHtmlForPrint());
          popup.document.close();
        }
  
        // popup.document.close();
      }
  
      return true;
    }
  }
  
  getHtmlForPrint() {
    const printContents = document.getElementById(this.section).innerHTML;
    if (this.excludeCss) {
      this.cssRefs = '';
    }
    const html =
      `<!DOCTYPE html>
    <html>
      <head>
         ${this.cssRefs}
      </head>
      <body onload="window.print()"
         ${printContents}
      </body>
    </html>`;
    return html;
  }
  
  */
  @Output() htmlEvent = new EventEmitter<string[]>();
  @Output() isPrintBtnClicked = new EventEmitter<boolean>();
  htmlArr: string[] = [];
  printDiv() {
    this.isPrintBtnClicked.emit(true);
    console.log('print1');
    let cssfontAwsom = '';
    if (true) {
      cssfontAwsom = `<link type="text/css" rel="stylesheet" href="/assets/css/fontawesome-all.min.css">
      <link rel="stylesheet" href="assets/css/emrgeneralprint.css">`
    }
    if (this.section && this.section != undefined && this.section != '') {
      var printContents = document.getElementById(this.section).innerHTML;
      // var originalContents = document.body.innerHTML;

      if (this.printServer) {
        this.htmlArr = [];
        for (let i = 0; i < this.printNo; i++) {
          const el = i;
          if (el == 0) {
            this.htmlArr.push(document.getElementById(this.section).innerHTML);
          } else {
            this.htmlArr.push(document.getElementById(this.section + el).innerHTML);
          }
        }
        console.log(this.htmlArr);
        this.htmlEvent.emit(this.htmlArr)
      } else {
        if (window) {
          if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {


            var popup = window.open('', '_blank',
              'width=600,height=600,scrollbars=no,menubar=no,toolbar=no,'
              + 'location=no,status=no,titlebar=no');

            // popup.window.focus();
            // if (this.excludeCss == true) {
            //   popup.document.write('<!DOCTYPE html><html><head>  '
            //     + 'media="screen,print">'
            //     + cssfontAwsom
            //     //+ '<link rel="stylesheet" href="style.css" media="screen,print">' + this.fetchStylesheets()
            //     + '</head><body onload="window.print()" ng-style ="{ ' + "'direction'" + ': (translate.currentLang == ' + "'ar'" + ')? ' + "'rtl'" + ' : ' + "'ltr'" + ' }">'
            //     + printContents + '</html>');

            //   popup.onbeforeunload = function (event) {
            //     popup.close();
            //     return '.\n';
            //   };
            //   popup.onabort = function (event) {
            //     popup.document.close();
            //     popup.close();
            //   }
            // } else if (this.excludeCss == false) {
            popup.document.write('<!DOCTYPE html><html lang="ar"><head><meta http-equiv="Content-Type" content="text/html;charset=UTF-8"> '
              + (this.excludeCss ? '' : '<link rel="stylesheet" href="/assets/css/gutenberg.css" ' + 'media="screen,print">'
                + cssfontAwsom)
              //+ '<link rel="stylesheet" href="style.css" media="screen,print">' + this.fetchStylesheets()
              + (this.excludeCss ? '</head><body onload="window.print()" style="margin:0 10px;">' : '</head><body onload="window.print()">')
              + printContents + '</html>');

            popup.onbeforeunload = function (event) {
              popup.close();
              return '.\n';
            };
            popup.onabort = function (event) {
              popup.document.close();
              popup.close();
            }
            // }

            // popup.onbeforeunload = function (event) {
            //   popup.close();
            //   return '.\n';
            // };
            // popup.onabort = function (event) {
            //   popup.document.close();
            //   popup.close();
            // }
          } else {
            var popup = window.open('', '_blank', 'width=800,height=600');
            popup.document.open();
            popup.document.write('<html lang="ar"><head><meta http-equiv="Content-Type" content="text/html;charset=UTF-8">' +
              +(this.excludeCss ? '' : '<link rel="stylesheet" href="/assets/css/gutenberg.css" media="all">'
                + cssfontAwsom)
              + (this.excludeCss ? '</head><body onload="window.print()" style="margin:0 10px;">' : '</head><body onload="window.print()">')
              + printContents + '</html>');
            popup.document.close();
            // popup.document.close();
          }

          popup.document.close();
        }
      }

      return true;
    }

  }

  exportAsConfig: ExportAsConfig = {
    type: 'pdf', // the type you want to download
    elementIdOrContent: `${this.section}`, // the id of html/table element
  }


  
  export() {
    // download the file using old school javascript method
    this._exportAsService.save({
      type: 'pdf', // the type you want to download
      elementIdOrContent: `${this.section}`, // the id of html/table element
    }, `${this._fileName}`)
      .subscribe(() => {
        // save started
      });
  }

  fetchStylesheets() {
    var output: string = '';

    for (var i = 0; i < document.styleSheets.length; i++) {
      output = output + ' <link rel="stylesheet" type="text/css" href="' +
        window.document.styleSheets[i].href + '" /> ';
    }
    return output;
  }

  fetchscriptSheets() {
    var output: string = '';
    for (var i = 0; i < document.scripts.length; i++) {
      //output = output +' <script type="text/javascript" src="'+    
      //         window.document.scripts[i].src +'" /> ';
    }
    return output;
  }

}



@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    PrintComponent,
  ],
  providers: [
    ExportAsService,
  ],
  exports: [
    PrintComponent,
    RouterModule
  ]
})

export class PrintComponentModule { }
