import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal, NgbModalOptions } from '../../ng-bootstrap/index';


@Injectable()
export class ModalService {
  deletedMessage: string;
  attention: string;

  constructor(public translate: TranslateService,
    private _ngbModalService: NgbModal) { };

  activate: (message?: string, title?: string, timingALert?: boolean) => Promise<boolean>;

  activateTimeAlert(msgAr?: any, msgEn?: any, titleObj?: ITitleTiming, timingAlert?: boolean) {
    this.attention = `${this.translate.currentLang == 'ar' ? 'بيانات مطلوبة: ' + titleObj.titleAr : 'Required Data: ' + titleObj.titleEn}`
    let msg = `${this.translate.currentLang == 'ar' ?
      msgAr : msgEn}`;
    return (this.activate(msg, this.attention, timingAlert));
  }

  activeDelMes(nameAr?: string, nameEn?: string) {
    this.translate.get('DeletedMessage').subscribe(
      (res: string) => this.deletedMessage = res);
    this.translate.get('Attention').subscribe(
      (res: string) => this.attention = res);
    let msg = `${this.deletedMessage} ${this.translate.currentLang == 'ar' ?
      nameAr : nameEn} ${this.translate.currentLang == 'ar' ? '؟' : '?'}`;
    return (this.activate(msg, this.attention));
  }


  activeCancelReceipeMes(nameAr?: string, nameEn?: string) {
    this.translate.get('CANCELMESSAGE').subscribe(
      (res: string) => this.deletedMessage = res);
    this.translate.get('Attention').subscribe(
      (res: string) => this.attention = res);
    let msg = `${this.deletedMessage} ${this.translate.currentLang == 'ar' ?
      nameAr : nameEn} ${this.translate.currentLang == 'ar' ? '؟' : '?'}`;
    return (this.activate(msg, this.attention));
  }

  activeMes(msgAr?: any, msgEn?: any) {
    this.translate.get('Attention').subscribe(
      (res: string) => this.attention = res);
    let msg = `${this.translate.currentLang == 'ar' ?
      msgAr : msgEn} ${this.translate.currentLang == 'ar' ? '؟' : '?'}`;
    return (this.activate(msg, this.attention));
  }
  activeTranslatedMesg(UImsg: string) {
    this.translate.get('Attention').subscribe(
      (res: string) => this.attention = res);
    this.translate.get(UImsg).subscribe(
      (res: string) => UImsg = res);
    let msg = `${UImsg} ${this.translate.currentLang == 'ar' ? '؟' : '?'}`;
    return (this.activate(msg, this.attention));
  }


  open(componentObject: any) {
    this._ngbModalService.open(componentObject, {
      size: "lg", windowClass: `
    .dark-modal .modal-content {
      background-color: #292b2c;
      width:1000ox;
      color: white;
    }
    .dark-modal .close {
      color: white;   
    }
  `});
  }

  openContent(componentObject: any, options?: NgbModalOptions) {
    return this._ngbModalService.open(componentObject, options).result

  }

}


interface ITitleTiming {
  titleAr: string;
  titleEn: string;
}