import { Component, OnInit, AfterViewInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ModalService } from './modal.service'

const KEY_ESC = 27;

@Component({
  selector: 'modal-confirm',
  templateUrl: 'modal.component.html',
  styleUrls: ['modal.component.css']
})
export class ModalComponent implements OnInit, AfterViewInit {
  private _defaults = {
    title: 'Confirmation',
    message: 'Do you want to cancel your changes?',
    cancelText: 'DISAGREE',
    okText: 'AGREE',
    timingAlert: false
  };
  title: string;
  message: string;
  okText: string;
  cancelText: string;
  timingAlert: boolean;
  negativeOnClick: (e: any) => any;
  positiveOnClick: (e: any) => any;

  private _modalElement: any;
  private _cancelButton: any;
  private _okButton: any;

  constructor(modalService: ModalService) {
    modalService.activate = this.activate.bind(this);
  }

  timeLeft: number = 6;
  interval;

  startTimer() {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        clearInterval(this.interval);
        this._cancelButton.click();
      }
    }, 1000);
  }

  activate(message = this._defaults.message, title = this._defaults.title, timingAlert = this._defaults.timingAlert) {
    this.title = title;
    this.message = message;
    this.timingAlert = timingAlert;
    this.okText = this._defaults.okText;
    this.cancelText = this._defaults.cancelText;

    if (this.timingAlert) {
      this.timeLeft = 6;
      this.startTimer();
    }

    let promise = new Promise<boolean>((resolve, reject) => {
      this.negativeOnClick = (e: any) => resolve(false);
      this.positiveOnClick = (e: any) => resolve(true);
      this._show();
    });

    return promise;
  }

  ngOnInit() {
    this._modalElement = document.getElementById('confirmationModal');

  }
  ngAfterViewInit() {
    this._cancelButton = document.getElementById('cancelButton');
    this._okButton = document.getElementById('okButton');

  }

  private _show() {
    document.onkeyup = null;

    if (!this._modalElement || !this._cancelButton || !this._okButton) return;

    this._modalElement.style.opacity = 0;
    this._modalElement.style.zIndex = 9999;
    this._modalElement.style.display = "block";

    this._cancelButton.onclick = ((e: any) => {
      e.preventDefault();
      if (!this.negativeOnClick(e)) this._hideDialog()
    });

    this._okButton.onclick = ((e: any) => {
      e.preventDefault();
      if (!this.positiveOnClick(e)) this._hideDialog()
    });

    this._modalElement.onclick = () => {
      this._hideDialog();
      return this.negativeOnClick(null);
    };

    document.onkeyup = (e: any) => {
      if (e.which == KEY_ESC) {
        this._hideDialog();
        return this.negativeOnClick(null);
      }
    };

    this._modalElement.style.opacity = 1;
  }

  private _hideDialog() {
    document.onkeyup = null;
    this._modalElement.style.opacity = 0;
    this._modalElement.style.display = "none";
    if (this.interval) clearInterval(this.interval);
    window.setTimeout(() => this._modalElement.style.zIndex = 0, 400);
  }
}
