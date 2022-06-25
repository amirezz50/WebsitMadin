import { Component, OnInit, OnDestroy, Output, EventEmitter, Input, ChangeDetectorRef } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { NgxCarousel } from '../ngx-carousel/ngx-carousel.interface';
import { UserSessionService } from '../../../app-user-session.service';
import { EmrParms } from '../../../shared/search-params';
import { DomSanitizer } from '@angular/platform-browser';
import { EmrSpecialtyImagesService } from '../../../portalServicesUsed/emr-specialty-images.service';

export interface EmrSpecialtyImages {
  serial?: number;
  specialtyId?: number;
  imagePath?: string;
  imageName?: string;
  base64?: string;
  dataStatus?: number;
  placetype?: string;

  santizerImagePath?: any;
  svgView?: string;
}
@Component({
  selector: 'carousel-veiwer',
  templateUrl: './carousel-viewer.component.html',
  styleUrls: ['./carousel-veiwer.component.css']
})
export class CarouselViewerComponent implements OnInit, OnDestroy {
  imgags: string[] = [];
  specialityImages: EmrSpecialtyImages[] = [];
  @Output() onImageUrl = new EventEmitter<EmrSpecialtyImages>();

  @Input() fromMarker: boolean;
  public carouselBannerItems: Array<any> = [];
  public carouselBanner: NgxCarousel;

  public carouselTileItems: Array<any> = [];
  public carouselTile: NgxCarousel;

  public carouselTileOneItems: Array<any> = [];
  public carouselTileOne: NgxCarousel;

  public carouselTileTwoItems: Array<any> = [];
  public carouselTileTwo: NgxCarousel;
  private ngUnsubscribe = new Subject<void>();
  constructor(
    private emrSpecImagSer: EmrSpecialtyImagesService,
    private sanitizer: DomSanitizer,
    private usersession: UserSessionService
  ) { }

  ngOnInit() {
    this.carouselBanner = {
      grid: { xs: 1, sm: 1, md: 1, lg: 1, all: 0 },
      slide: 4,
      speed: 500,
      interval: 5000,
      point: {
        visible: true,
        pointStyles: `
          .ngxcarouselPoint {
            list-style-type: none;
            text-align: center;
            padding: 12px;
            margin: 0;
            white-space: nowrap;
            overflow: auto;
            position: absolute;
            width: 100%;
            bottom: 20px;
            left: 0;
            box-sizing: border-box;
          }
          .ngxcarouselPoint li {
            display: inline-block;
            border-radius: 999px;
            background: rgba(255, 255, 255, 0.55);
            padding: 5px;
            margin: 0 3px;
            transition: .4s ease all;
          }
          .ngxcarouselPoint li.active {
              background: white;
              width: 10px;
          }
        `
      },
      load: 2,
      custom: 'banner',
      touch: false,
      loop: false,
      easing: 'cubic-bezier(0, 0, 0.2, 1)'
    };

    this.carouselTile = {
      grid: { xs: 2, sm: 3, md: 3, lg: 4, all: 0 },
      speed: 600,
      interval: 3000,
      point: {
        visible: true,
        pointStyles: `
          .ngxcarouselPoint {
            list-style-type: none;
            text-align: center;
            padding: 12px;
            margin: 0;
            white-space: nowrap;
            overflow: auto;
            box-sizing: border-box;
          }
          .ngxcarouselPoint li {
            display: inline-block;
            border-radius: 50%;
            border: 2px solid rgba(0, 0, 0, 0.55);
            padding: 4px;
            margin: 0 3px;
            transition-timing-function: cubic-bezier(.17, .67, .83, .67);
            transition: .4s;
          }
          .ngxcarouselPoint li.active {
              background: #6b6b6b;
              transform: scale(1.2);
          }
        `
      },
      load: 2,
      touch: true
    };

    this.carouselTileOne = {
      grid: { xs: 2, sm: 3, md: 4, lg: 6, all: 0 },
      speed: 600,
      interval: 3000,
      point: {
        visible: true,
        pointStyles: `
          .ngxcarouselPoint {
            list-style-type: none;
            text-align: center;
            padding: 12px;
            margin: 0;
            white-space: nowrap;
            overflow: auto;
            box-sizing: border-box;
          }
          .ngxcarouselPoint li {
            display: inline-block;
            border-radius: 50%;
            background: #6b6b6b;
            padding: 5px;
            margin: 0 3px;
            transition: .4s;
          }
          .ngxcarouselPoint li.active {
              border: 2px solid rgba(0, 0, 0, 0.55);
              transform: scale(1.2);
              background: transparent;
            }
        `
      },
      load: 2,
      loop: true,
      touch: true,
      easing: 'ease',
      animation: 'lazy'
    };

    this.carouselTileTwo = {
      grid: { xs: 1, sm: 3, md: 4, lg: 6, all: 230 },
      speed: 600,
      interval: 3000,
      point: {
        visible: true
      },
      load: 2,
      touch: false
    };

    this.EmrPatient$();
  }

  EmrPatient$() {
    this.usersession.subscribeToKey$('EmrPatient')
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((keys: any) => {
        if (keys.value) {
          this.carouselTileTwoItems = [];
          this.imgags = [];
          this.specialityImages = [];
          this.getSpecialtyImages();
        }
      });
  }

  getPatWithSearchParms(): EmrSpecialtyImages {
    const entity = <EmrSpecialtyImages>{};
    const emrParms = <EmrParms>this.usersession.getSessionKey('EmrSearchParms');
    if (emrParms) {
      entity.specialtyId = emrParms.specialityId;
    }
    return entity;
  }
  onmoveFn(data) {
    // console.log(data);
  }
  customImgArr: any[] = [];
  getSpecialtyImages() {
    this.emrSpecImagSer
      .MedicalSpeciatiesImagesSearch(this.getPatWithSearchParms())
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        if (res.returnFlag) {
          const specImages: EmrSpecialtyImages[] = res.data;
          this.specialityImages = specImages;
          let copyImgs = Object.assign([], specImages)
          this.customImgArr = [];
          let count = +(this.specialityImages.length / 4).toFixed();

          this.specialityImages.forEach(el => {
            el.imagePath = (el.base64 == '' || el.base64 == null) ? el.imagePath : `data: image/png;base64, ${el.base64}`;
            el['santizerImagePath'] = this.sanitizer.bypassSecurityTrustResourceUrl(el.imagePath);
          });

          this.onImageUrl.emit(this.specialityImages[0]);

          for (let i = 0; i < count; i++) {
            this.customImgArr.push({ images: [...copyImgs.filter((el, indx) => indx < 4)] });
            copyImgs.splice(0, 4);
          }

          // for (const iterator of specImages) {
          //   this.imgags.push(iterator.imagePath);
          // }
          // this.carouselTileTwoLoad();
        }
      });
  }

  public carouselTileTwoLoad() {
    // const len = this.carouselTileTwoItems.length;
    // const imgLen = this.imgags.length;
    // for (let i = 0; i < this.imgags.length; i++) {
    //   this.carouselTileTwoItems.push(this.imgags[i]);
    // }
  }


  afterSelectImage(image: EmrSpecialtyImages) {
    this.onImageUrl.emit(image);
  }


  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  getHtmlView(img: EmrSpecialtyImages) {
    setTimeout(() => {
      if (document.getElementById('svgView')) {
        let svgDiv = document.getElementById('svgView') as HTMLDivElement;
        if (!svgDiv.getElementsByTagName('svg')[0]) {
          let tempDiv = document.createElement('div');
          if (tempDiv && tempDiv.innerHTML.length == 0) {
            tempDiv.innerHTML = img ? img.svgView : '';
            let item = tempDiv.getElementsByTagName('svg')[0];
            item.style.width = "198.5px";
            item.style.height = "225px";
            svgDiv.appendChild(item);
          }
        }
        return img.serial || '';
      }
      return '';
    }, 0);
  }

}
