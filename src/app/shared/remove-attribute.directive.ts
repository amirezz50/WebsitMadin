import { Directive, Renderer2, ElementRef, OnInit } from '@angular/core';

@Directive({
    selector: '[removeAttribute]'
})

export class RemoveAttributeDirective implements OnInit {

    constructor(
        private renderer: Renderer2,
        private elmRef: ElementRef
    ) { }

    ngOnInit() {
       
        this.renderer.removeAttribute(this.elmRef.nativeElement, this.elmRef.nativeElement.attributes[0].name);
        
        console.log(this.elmRef.nativeElement.attributes[0]);
    }

}