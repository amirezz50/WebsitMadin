import { HttpGeneralService } from './../../../shared/http-general.service';
import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef
} from '@angular/core';
import { FileUploader } from '../file-uploader.class';
import { DomSanitizer } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { CONFIG } from '../../../shared/config';

@Component({
  selector: 'image-upload',
  templateUrl: 'image-upload.component.html',
  styleUrls: ['image-upload.component.css']
})
export class ImageUploadComponent implements OnInit, OnDestroy {
  public uploader: FileUploader = new FileUploader({});
  destroy$: Subject<boolean> = new Subject<boolean>();
  @Input()
  imgMode = 1;
  @ViewChild('popup', { static: false })
  content: any;
  @ViewChild('photoInput', { static: false })
  photoInput: ElementRef;

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
  @Input()
  set IsUploadFile(value) {
    if (value) {
      this.isUploadFile = true;
      this.uploadFile();
    }
  }
  _imageBase64: any;
  @Input() savePlaceType: number;

  @Output() OutSavePlaceType = new EventEmitter<number>();
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
  @Input() multiple: boolean = false;

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
  constructor(
    private sanitizer: DomSanitizer,
    private hpgs: HttpGeneralService
  ) { }

  ngOnInit() {
    // const apiUrlNew = CONFIG.Urls.apiUrlNew;
    // this.uploader.options.url = `${apiUrlNew}/api/v1/Upload/upload?type=${this.imageType}`;
    // const h = createAuthorizationHeader();
    // this.uploader.authToken = h.Authorization;
    // this.uploader.OnCompelete$()
    //     .takeUntil(this.destroy$)
    //     .subscribe(res => {
    //         if (res && res.response && res.response.result) {
    //             this.compelete.emit(JSON.parse(res.response.result));
    //         } else if (res && res.response) {
    //             this.compelete.emit(JSON.parse(res.response));
    //         }
    //     });
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
    // if (this.isUploadFile) {
    //     if (this.uploader && this.uploader.queue[0]) {
    //         this.uploader.queue[0].upload();
    //         this.uploader.queue = [];
    //     }
    // }
  }

  readFile(event) {
    var FR = new FileReader();
    FR.addEventListener('load', (e: any) => {
      this._imageBase64 = e.target.result;
      this.pathOrBase64 = 1;
      this.uploadFile();
    });

    if (event) {
      FR.readAsDataURL(event.target.files[0]);
    }
  }
  print(acount = 0, ccount = 0, gcount = 0, tcount = 0) {
    console.log(`${acount} ${ccount} ${gcount} ${tcount}`);
  }
  startup() {
    this.video = document.getElementById('video');
    this.canvas = document.getElementById('canvas');
    this.photo = document.getElementById('photo');
    this.startbutton = document.getElementById('startbutton');
    navigator.getUserMedia(
      { video: true, audio: false },
      stream => {
        this.video.srcObject = stream;
        this.video.play();
      },
      err => {
        alert(err);
        console.log('erro');
      }
    );
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
      const url = `${apiUrlNew}/api/v1/Upload/upload/base64?type=${
        this.imageType
        }`;
      const arr = this._imageBase64.split('base64,');
      this.hpgs.post(arr[1], url).subscribe(res => {
        console.log(res);
      });
    } else {
      this.OutBase64.emit(this._imageBase64.split('base64,')[1]);
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
    console.log(base64);
    this._imageBase64 = base64;
    this.uploadBase64();
  }

  ngOnDestroy() {
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.next(false);
    this.destroy$.unsubscribe();
  }
}
