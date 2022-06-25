import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.css']
})
export class DeleteModalComponent implements OnInit {


  @Output() action = new EventEmitter<boolean>();
  constructor() { }

  ngOnInit() {
  }

  emitAction(action: boolean) {
    this.action.emit(action);
  }
}
