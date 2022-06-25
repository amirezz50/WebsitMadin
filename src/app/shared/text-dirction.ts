import { Directive, ElementRef, Input, Renderer } from '@angular/core';

@Directive({ selector: '[textDirection]' })
export class TextDirectionDirective {

    constructor(public el: ElementRef, public renderer: Renderer) {}

    @Input() textDirection: 'ltr' | 'rtl';

    ngOnInit(){
        // Use renderer to render the emelemt with direction attribute
        console.log(this.textDirection)
        if(this.textDirection) {
            console.log('direction of text English!');
            this.renderer.setElementAttribute(this.el.nativeElement, 'dir', this.textDirection);
        }
    }
}