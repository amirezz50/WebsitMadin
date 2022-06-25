import {
  Directive,
  OnInit,
  HostListener,
  ElementRef,
  Renderer,
  Renderer2,
  Input,

  HostBinding
} from '@angular/core';
import { NgModule } from '@angular/core';
@Directive({ selector: '[numbersOnly]' })
export class NumberDirective {
  @HostListener('keydown', ['$event'])
  handleKeyboardEvent($event: KeyboardEvent) {

    let text = $event.key;
    if (
      $event.ctrlKey &&
      (text == 'c' || text == 'v' || text == 'x' || text == 'a' || text == 'z')
    ) {
      return;
    } else if (
      text == 'Backspace' ||
      text == 'Tab' ||
      text == 'Delete' ||
      text == 'ArrowLeft' ||
      text == 'ArrowRight' ||
      text == 'Shift' ||
      text == 'Alt'
    ) {
      return;
    } else {
      if (!isNaN(+text) || text == '.') {
        return;
      } else $event.preventDefault();
    }
  }

  @HostBinding('class')
  elementClass = 'form-control number-control';
}

@Directive({ selector: '[textEnOnly]' })
export class EnStringDirective {
  @HostListener('keydown', ['$event'])
  handleKeyboardEvent($event: KeyboardEvent) {
    let text = $event.key;
    if (
      $event.ctrlKey &&
      (text == 'c' || text == 'v' || text == 'x' || text == 'a' || text == 'z')
    ) {
      return;
    } else if (
      text == 'Backspace' ||
      text == 'Tab' ||
      text == 'Delete' ||
      text == 'ArrowLeft' ||
      text == 'ArrowRight' ||
      text == ' ' ||
      text == 'Shift' ||
      text == 'Alt'
    ) {
      return;
    } else {
      if (text.match(/[A-Za-z]/i)) {
        return;
      } else $event.preventDefault();
    }
  }
}

@Directive({ selector: '[textArOnly]' })
export class ArStringDirective {
  @HostListener('keydown', ['$event'])
  handleKeyboardEvent($event: KeyboardEvent) {
    let text = $event.key;
    if (
      $event.ctrlKey &&
      (text == 'c' || text == 'v' || text == 'x' || text == 'a' || text == 'z')
    ) {
      return;
    } else if (
      text == 'Backspace' ||
      text == 'Tab' ||
      text == 'Delete' ||
      text == 'ArrowLeft' ||
      text == 'ArrowRight' ||
      text == ' ' ||
      text == 'Shift' ||
      text == 'Alt'
    ) {
      return;
    } else {
      if (text.match(/[\u0600-\u065F\u066A-\u06EF\u06FA-\u06FF]/)) {
        return;
      } else $event.preventDefault();
    }
  }
}

@Directive({ selector: '[identity]' })
export class IdentityDirective {
  @Input('identity')
  myIdentityType: number;
  constructor(el: ElementRef, renderer: Renderer) {
    if (this.myIdentityType == 1)
      renderer.setElementAttribute(el.nativeElement, 'maxlength', '14');
    else if (this.myIdentityType == 3)
      renderer.setElementAttribute(el.nativeElement, 'maxlength', '10');
  }

  @HostListener('keydown', ['$event'])
  handleKeyboardEvent($event?: KeyboardEvent) {
    let text = $event.key;
    if (
      $event.ctrlKey &&
      (text == 'c' || text == 'v' || text == 'x' || text == 'a' || text == 'z')
    ) {
      return;
    } else if (
      text == 'Backspace' ||
      text == 'Tab' ||
      text == 'Delete' ||
      text == 'ArrowLeft' ||
      text == 'ArrowRight'
    ) {
      return;
    } else {
      if (this.myIdentityType == 1 || this.myIdentityType == 3) {
        if (!isNaN(+text)) {
          return;
        } else $event.preventDefault();
      }
    }
  }
}

@Directive({ selector: 'input' })
export class InputFoucsDirective {
  input: HTMLInputElement;
  constructor(public renderer2: Renderer2, public el: ElementRef) {
    this.input = this.el.nativeElement;
  }

  @HostListener('focus')
  onMouseEnter() {
    if (
      this.input.previousElementSibling &&
      this.input.previousElementSibling.tagName == 'LABEL'
    ) {
      this.input.previousElementSibling.classList.add('focused');
      // this.renderer2.addClass(this.elementRef, 'active_class');
    }
  }

  @HostListener('blur')
  onMouseLeave() {
    if (
      this.input.previousElementSibling &&
      this.input.previousElementSibling.tagName == 'LABEL'
    ) {
      this.input.previousElementSibling.classList.remove('focused');
    }
    // this.renderer2.removeClass(this.elementRef, 'active_class');
  }
}

@Directive({ selector: 'input:disabled' })
export class InputDisabledDirective implements OnInit {
  input: HTMLInputElement;
  constructor(public renderer2: Renderer2, public el: ElementRef) {
    this.input = this.el.nativeElement;
  }

  ngOnInit() {}
}

@NgModule({
  declarations: [
    NumberDirective,
    EnStringDirective,
    ArStringDirective,
    IdentityDirective,
    InputFoucsDirective,
    InputDisabledDirective
  ],
  exports: [
    NumberDirective,
    ArStringDirective,
    EnStringDirective,
    IdentityDirective,
    InputFoucsDirective,
    InputDisabledDirective
  ]
})
export class InputsMaskModule {}
