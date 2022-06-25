import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { DocManagementTrans } from './../image-upload-new';
import { DomSanitizer } from '@angular/platform-browser';
import { FileUploader } from './../../blocks/file-upload/file-uploader.class';
import { Component, OnInit, Renderer2, ElementRef, ViewChild, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { imageUploadAllService } from "./image-upload-all.service";

@Component({
  selector: 'imageUploadAll',
  templateUrl: './image-upload-all.component.html',
  styleUrls: ['./image-upload-all.component.css']
})
export class imageUploadAllComponent implements OnInit {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  imageForm: FormGroup;
  error: string;
  uploadError: string;
  fileEvent;
  _imageBase64: any;
  _imageBase641: any;
  _imageBase64Copy: any[] = [];
  alldata: any[] = []
  url: any
  public uploader: FileUploader = new FileUploader({});
  @ViewChild('image', { static: false }) private image: ElementRef;
  DocManagementTrans: DocManagementTrans = <DocManagementTrans>{}
  @Output() close = new EventEmitter();

  deleteurl: any

  constructor(
    private sanitizer: DomSanitizer,
    private _router: Router,
    private fb: FormBuilder,
    private _imageUploadAllService: imageUploadAllService,
    private renderer: Renderer2
  ) { }

  ngOnInit() {
    this.imageForm = this.fb.group({
      productName: [''],
      price: [''],
      sku: ['']
    });
    this.getAllImages()
  }
  setEvent(event) {
    this.fileEvent = event;
    this.readFile(event);
  }


  readFile(event) {
    var FR = new FileReader();
    FR.addEventListener('load', (e: any) => {
      this._imageBase64 = e.target.result;

      this.uploadFile();
    });
    if (event) {
      FR.readAsDataURL(event.target.files[0]);
    }
  }

  uploadFile() {
    if (this._imageBase64) {
      this.uploadBase64();
    }

  }
  uploadBase64() {
    this._imageBase641 = this._imageBase64.split('base64,')[1]
    this._imageBase64Copy.push(this._imageBase641)
    this.uploadError = '';

    this.createImageBitmap(this._imageBase64);

  }


  deleteProductImage(filename, a) {
    // this._router.snapshot.paramMap.get("animal")

    // this._router.snapshot.paramMap.get("animal")
    this.DocManagementTrans = <DocManagementTrans>{};
    this.DocManagementTrans.docPath = filename
    this._imageUploadAllService.deleteImage(this.DocManagementTrans.serial)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        // res => {
        //     this.alldata = res.data
        //     this.alldata.forEach(x =>{
        //       this.url= this._imageUploadAllService.getImagebyName(x)
        //        this.createImageBitmap( this.url)
        //     }

        //    )
        // }
        //   ,
        // err => this.error = err

      );
    a.parentElement.remove();
    // const formData = new FormData();
    // formData.append('filename', filename);
    // this._imageUploadAllService.deleteImage(formData).subscribe(
    //   res => {
    //     a.parentElement.remove();
    //   },
    //   err => this.error = err
    // );
  }

  getAllImages() {
    this.DocManagementTrans = <DocManagementTrans>{};
    this.DocManagementTrans.base64Arr = this._imageBase64Copy
    this.DocManagementTrans.tableRowId = 8
    this.DocManagementTrans.documentLookupCode = 12 //SnDocumentType.EmployeeImage = 6
    this.DocManagementTrans.docManagementSerial = 12
    this.DocManagementTrans.docFolderLookupSerial = 2

    this._imageUploadAllService.getAllImage(this.DocManagementTrans)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        res => {
          this.alldata = res.data
          this.alldata.forEach(x => {
            this.url = this._imageUploadAllService.getImagebyName(x)
            this.createImageBitmap(this.url)
          }
          )
        },
        err => this.error = err
      );
  }

  onSubmit() {
    this.DocManagementTrans = <DocManagementTrans>{};
    this.DocManagementTrans.base64Arr = this._imageBase64Copy
    this.DocManagementTrans.tableRowId = 8
    this.DocManagementTrans.documentLookupCode = 12 //SnDocumentType.EmployeeImage = 6
    this.DocManagementTrans.docManagementSerial = 12
    this.DocManagementTrans.docFolderLookupSerial = 2

    this._imageUploadAllService.saveAllImage(this.DocManagementTrans).subscribe(
      res => {
        if (res.msgData[0].msgID == 5) {
          this._imageBase64Copy = []

        }
      },
      err => this.error = err
    );
  }

  onClose(data: any) {
    this.close.emit(data);
  }

  createImageBitmap(src) {

    const li: HTMLLIElement = this.renderer.createElement('li');

    const img: HTMLImageElement = this.renderer.createElement('img');
    img.src = src
    this.renderer.addClass(img, 'product-image');

    const a: HTMLAnchorElement = this.renderer.createElement('a');
    a.innerText = 'Delete';
    this.renderer.addClass(a, 'delete-btn');
    a.addEventListener('click', this.deleteProductImage.bind(this, img.src, a));

    this.renderer.appendChild(this.image.nativeElement, li);
    this.renderer.appendChild(li, img);
    this.renderer.appendChild(li, a);
  }
}