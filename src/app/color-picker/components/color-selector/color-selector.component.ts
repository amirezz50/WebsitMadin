import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { IColor } from '../../interfaces/color';
import { PaletteDirection } from '../../interfaces/palette-direction';
import { BytelabsColorSelectorService } from '../../services/color-selector.service';
import { IColorSelectorConfig } from '../../color-selector-config';

@Component({
    selector: 'bytelabs-color-selector',
    templateUrl: 'color-selector.component.html',
    styleUrls: ['./color-selector.component.css'],
    providers: [BytelabsColorSelectorService],
    host: {
        '[style.height.px]': 'height',
        '[style.width.px]': 'width'
    }
})
export class BytelabsColorSelectorComponent implements OnInit {
    colorName: any;
    public paletteDirection = PaletteDirection;

    private _color: IColor;
    @Input()
    set color(color: IColor) {
      this.colorSelectorService.currentColor = color;
      this.colorName = color.hex;
    }

    get color() {
        return this._color;
    }

    @Output() colorChange = new EventEmitter<IColor>();

    @Input() options: IColorSelectorConfig;

    public showPalette: boolean = false;

    public height: number;
    public width: number;

    constructor(private elementRef: ElementRef, private colorSelectorService: BytelabsColorSelectorService) {

        this.colorSelectorService.currentColor$.subscribe((color: IColor) => {
            
            this._color = color;
            this.colorChange.next(color);
            this.showPalette = false;
        });

        this.height = this.colorSelectorService.config.itemSize.height;
        //this.width = this.colorSelectorService.config.itemSize.width;
      this.width = 80;
    }

    ngOnInit() {

        if (this.options) {
            this.colorSelectorService.config = this.options;
        }
    }

    @HostListener('document:click', ['$event'])
    clickOff() {
        if (!this.showPalette) {
            return;
        }

        if (!this.elementRef.nativeElement.contains(event.target)) {
            this.showPalette = false;
        }
    }

    public togglePalette() {
        this.showPalette = !this.showPalette;
    }



}
