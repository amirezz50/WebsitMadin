import { FileUploader } from './../../blocks/file-upload/file-uploader.class';
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { HttpGeneralService } from "../../shared/http-general.service";
import { CONFIG } from "../../shared/config";
import { imageUploadNewService } from "./image-upload-new.service";
import { DocManagementTrans } from "../image-upload-new";
import { timeStamp } from 'console';
declare var scanner: any;
@Component({
  selector: 'image-upload-new',
  templateUrl: 'image-upload-new.component.html',
  styleUrls: ['image-upload.component.css']
})
export class ImageUploadNewComponent implements OnInit, OnDestroy {
  scanImageBase64: any;
  imagesScanned: any[] = [];
  
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public uploader: FileUploader = new FileUploader({});
  destroy$: Subject<boolean> = new Subject<boolean>();
  @Input()
  imgMode = 1;

  @Input()
  documentLookupCode: number;

  @Input()
  regPatServiceSerial: number;

  @Input() BankTranferSerial : number 
  
  @Input()
  transSerial: number;
  @Input()
  docFolderLookupSerial: number;
  @ViewChild('popup', { static: false })
  content: any;
  @ViewChild('photoInput', { static: false })
  photoInput: ElementRef;
  @Input() autoUpdate: boolean;



  // *************************************************
  @Input()
  width = 500; // We will scale the photo width to this
  @Input()
  height = 450; // This will be computed based on the input stream
  streaming = false;
  video = null;
  canvas = null;
  photo = null;
  startbutton = null;
  // *********************************************
  fileEvent;
  @Input()
  imageContent = 'png';
  @Input()
  imageType: number;
  @Input()
  class: string;
  @Output()
  compelete: any = new EventEmitter();
  @Output()
  OutBase64 = new EventEmitter<string>();
  pathOrBase64: 1 | 2;
  isUploadFile = false;
  DocManagementTrans: DocManagementTrans = <DocManagementTrans>{};
  @Input()
  set IsUploadFile(value) {
    if (value) {
      this.isUploadFile = true;
      this.uploadFile();
    }
  }
  _imageBase64: any;
  _imageBase64Copy: any;
  @Input() savePlaceType: number;

  @Output() OutSavePlaceType = new EventEmitter<number>();
  @Output() imageObj = new EventEmitter<DocManagementTrans>();
  @Input()
  get imageBase64() {
    return this._imageBase64;
  }
  set imageBase64(val: string) {
    if (val != undefined && val != null && val != '') {
      this.pathOrBase64 = 1;
      if (this.savePlaceType == 4 || this.savePlaceType == 1) {
        this._imageBase64 = this.sanitizer.bypassSecurityTrustResourceUrl(val);
      }
      else {
        this._imageBase64 = this.sanitizer.bypassSecurityTrustResourceUrl(
          `data: image/${this.imageContent};base64, ${val}`
        );
        this.OutBase64.emit(val);
      }
    } else {
      this._imageBase64 = '';
      // this._imageBase64 = this.sanitizer.bypassSecurityTrustResourceUrl('');
    }

  }
  _SavedId: number;
  @Input()
  get SavedId() {
    return this._SavedId;
   
  }
  set SavedId(val: number) {
    if (val > 0) {
      this._SavedId = val;
      this.getData()
    }
  }

  _docPath: any;
  @Input()
  get docPath() {
    return this._docPath;
  }
  set docPath(val: string) {
    if (val != undefined && val != null && val != '') {
      this.pathOrBase64 = 2;
      this._docPath = this.sanitizer.bypassSecurityTrustResourceUrl(val);
    } else {
      this._docPath = this.sanitizer.bypassSecurityTrustResourceUrl('');
    }
  }

  @Input() saveImage: boolean;
  constructor(
    private sanitizer: DomSanitizer,
    private hpgs: HttpGeneralService,
    private _imageUploadNewService: imageUploadNewService
  ) { }
  

  ngOnInit() {
    
  }

  setEvent(event) {
    this.savePlaceType = 0;
    this.OutSavePlaceType.emit(this.savePlaceType);
    this.fileEvent = event;
    this.readFile(event);
  }

  uploadFile() {
    if (this._imageBase64) {
      this.uploadBase64();
    }
    
  }

  readFile(event) {
    var FR = new FileReader();
    FR.addEventListener('load', (e: any) => {
      this._imageBase64 = e.target.result;
      this.pathOrBase64 = 1;
      this.uploadFile();
      this.save()

    });

    if (event) {
      FR.readAsDataURL(event.target.files[0]);
    }
  }
  print(acount = 0, ccount = 0, gcount = 0, tcount = 0) {
    // console.log(`${acount} ${ccount} ${gcount} ${tcount}`);
  }
  startup() {
    this.video = document.getElementById('video');
    this.canvas = document.getElementById('canvas');
    this.photo = document.getElementById('photo');
    this.startbutton = document.getElementById('startbutton');
    // navigator.getUserMedia(
    //   { video: true, audio: false },
    //   stream => {
    //     this.video.srcObject = stream;
    //     this.video.play();
    //   },
    //   err => {
    //     alert(err);
    //     // console.log('erro');
    //   }
    // );
    this.clearphoto();
  }

  openCamera() {
    this.content.openContent().result.then(result => { }, reason => { });
    this.startup();
  }

  canPlay(ev) {
    if (!this.streaming) {
      this.height =
        this.video.videoHeight / (this.video.videoWidth / this.width);

      this.video.setAttribute('width', this.width);
      this.video.setAttribute('height', this.height);
      this.canvas.setAttribute('width', this.width);
      this.canvas.setAttribute('height', this.height);
      this.streaming = true;
    }
  }

  clearphoto() {
    var context = this.canvas.getContext('2d');
    context.fillStyle = '#AAA';
    context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.setBase64ToPhoto();
  }

  takepicture(event) {
    var context = this.canvas.getContext('2d');
    if (this.width && this.height) {
      this.canvas.width = this.width;
      this.canvas.height = this.height;
      context.drawImage(this.video, 0, 0, this.width, this.height);

      this.setBase64ToPhoto();
      // this.uploader.queue[0] = this._imageBase64;
    } else {
      this.clearphoto();
    }
    event.preventDefault();
  }

  afterPopupClosed(event) {
    if (this.uploader && this.uploader.queue[0]) {
      var FR = new FileReader();
      FR.addEventListener('load', (e: any) => {
        this._imageBase64 = e.target.result;
        this.uploadFile();
        // this.uploader.queue[this.uploader.queue.length - 1].upload();
      });

      if (event) {
        FR.readAsDataURL(event.target.files[0]);
      }
    }
  }

  setBase64ToPhoto() {
    var data = this.canvas.toDataURL('image/png');
    this._imageBase64 = data;
    this.photo.setAttribute('src', data);
  }

  uploadBase64() {
    if (this.isUploadFile) {
      const apiUrlNew = CONFIG.Urls.apiUrlNew;
      const url = `${apiUrlNew}/api/v1/Upload/upload/base64?type=${this.imageType
        }`;
      const arr = this._imageBase64.split('base64,');
      this.hpgs.post(arr[1], url).subscribe(res => {
        // console.log(res);
      });
    } else {
      this.OutBase64.emit(this._imageBase64.split('base64,')[1]);
      this._imageBase64Copy = this._imageBase64
    }
    // var fr = new FileReader();
    // fr.onload = function (oFREvent) {
    //     var v = oFREvent.target.result.split(',')[1]; // encoding is messed up here, so we fix it
    //     v = atob(v);
    //     var good_b64 = btoa(decodeURIComponent(escape(v)));
    //     document.getElementById("uploadPreview").src = "data:image/png;base64," + good_b64;
    // };
    // fr.readAsDataURL(the_file);
  }
  ScanResultBase64(base64: string) {
    // console.log(base64);
    this._imageBase64 = base64;
    this.uploadBase64();
  }

  ngOnDestroy() {
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.next(false);
    this.destroy$.unsubscribe();
  }

  getImgsFolderPath() {
    let folderPath = ''
    this._imageUploadNewService.GetImagePth(this.DocManagementTrans)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(data => {
        if (data && data.length > 0) {
          // console.log(data)
        }
      }
      )
  }

  getData() {
    this._imageBase64 = ''
    this.DocManagementTrans = <DocManagementTrans>{};
    this.DocManagementTrans.tableRowId = this._SavedId
    this.DocManagementTrans.documentLookupCode = this.docFolderLookupSerial //SnDocumentType.EmployeeImage = 6
    this.DocManagementTrans.docManagementSerial = this.documentLookupCode
    this.DocManagementTrans.regPatServiceSerial = this.regPatServiceSerial

    this.DocManagementTrans.docFolderLookupSerial = this.docFolderLookupSerial
    this.pathOrBase64 = 1
    this._imageBase64 = this._imageUploadNewService.GetImage(this.DocManagementTrans)
    
  }

  save() {
    this.DocManagementTrans = <DocManagementTrans>{};
    this.DocManagementTrans.base64 = this._imageBase64Copy ? this._imageBase64Copy.split('base64,')[1] : this._imageBase64.split('base64,')[1]? this._imageBase64.split('base64,') :this.scanImageBase64;
    this.DocManagementTrans.tableRowId = this.SavedId;
    this.DocManagementTrans.transSerial = this.transSerial;
    this.DocManagementTrans.regPatServiceSerial = this.regPatServiceSerial

    this.DocManagementTrans.documentLookupCode = this.docFolderLookupSerial //SnDocumentType.EmployeeImage = 6
    this.DocManagementTrans.docManagementSerial = this.documentLookupCode
    this.DocManagementTrans.docFolderLookupSerial = this.docFolderLookupSerial
    this.DocManagementTrans.docPath = this.docPath;
    //this.DocManagementTrans.fileEvent = this.fileEvent

    if (this.autoUpdate)
      this._imageUploadNewService.saveImage(this.DocManagementTrans)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(
          employment =>
            this.imageObj.emit(this.DocManagementTrans)
          //this._setEditEmployment(employment.data[0])
        );

  }


  showSelectedImage: boolean = false;
  slectImage() {
    this.showSelectedImage = true
    document.querySelector('body').classList.add('position-fixed');
  }
  smallScreenSelectedImage() {
    if (this._imageBase64 && this._imageBase64 != null) {
      this.showSelectedImage = true;
      document.querySelector('body').classList.add('position-fixed')
    }
  }
  hideSelectedImage() {
    this.showSelectedImage = false
    document.querySelector('body').classList.remove('position-fixed')
  }

  scanToJpg() {
    scanner.scan(this.displayImagesOnPage.bind(this),
      {
        output_settings: [
          {

            "type": "return-base64",
            "format": "jpg"
          }
        ]

      });
  }

showScanImage :boolean =false; 
  displayImagesOnPage(successful: boolean, mesg: string, response: any) {
    // var self = this;
    if (!successful) { // On error
      console.error('Failed: ' + mesg);
      return;
    }

    if (successful && mesg != null && mesg.toLowerCase().indexOf('user cancel') >= 0) { // User cancelled.
      console.info('User cancelled');
      return;
    }

    var scannedImages = scanner.getScannedImages(response, true, false);
    // returns an array of ScannedImage
    for (var i = 0; (scannedImages instanceof Array) && i < scannedImages.length; i++) {
      var scannedImage = scannedImages[i];
     this.scanImageBase64=scannedImages[i]['src'].split(',')[1];;
      //  this.processScannedImage(scannedImage);
    }
  //  this.autoUpdate=true;
    console.log(scannedImage);
  }

}
