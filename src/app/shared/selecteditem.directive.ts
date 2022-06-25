import { Directive , HostBinding ,HostListener } from '@angular/core';


@Directive({
    selector: '[selected]'
})

export class SelectedDirective {
    private color: string;
    @HostBinding('class.select') get selected() {
        return this.isSelected,this.color;
    }
    @HostListener('click') select() {
        this.isSelected = true;
        this.color = 'blue';
    }
    @HostListener('click') unSelect() {
        this.isSelected = false;
        this.color = '';
    }
    private isSelected = false;
}