
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'filter-text',
    templateUrl: './filter-text.component.html'
})
export class FilterTextComponent {
  @Output() changed: EventEmitter<string>;
  filter: string;

  constructor() {
      this.changed = new EventEmitter<string>();
  }

  clear() {
    this.filter = '';
  }

  filterChanged(event: any) {
    event.preventDefault();
    this.changed.emit(this.filter);
  }
}