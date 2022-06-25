import { Directive, Input, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Directive({
  selector: '[tabindex]',
  host: {
    '(keydown)': 'onKeyUp($event)'
  }
})
export class TabindexDirective {

  @Input() tabindex: number;
  @Input() itemsLength: number;
  @Input() idName: string;
  constructor(@Inject(DOCUMENT) private document: Document) { }
  onKeyUp(event: any) {
    var el: any;
    if (event.keyCode == 40 && this.tabindex < this.itemsLength) {
      el = this.document.getElementById(this.idName + (this.tabindex + 1));
    } else if (event.keyCode == 38 && this.tabindex >= 0) {
      el = this.document.getElementById(this.idName + (this.tabindex - 1));
    }

    if (el) {
      el.focus();
      el.select();
    }
  }
}
