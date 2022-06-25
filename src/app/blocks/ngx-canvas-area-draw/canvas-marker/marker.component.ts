import { Component, ViewChild, OnInit, OnDestroy, ElementRef } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { CanvasAreaDraw } from "../ngx-canvas-area-draw.directive";
import { TranslateService } from "@ngx-translate/core";
import { UserSessionService } from "../../../app-user-session.service";
import { EmrParms } from "../../../shared/search-params";
import { Legend, SHAPES } from "../ngx-canvas-area-draw.interfaces";
import { fromEvent, Subject } from "rxjs";
import { takeUntil } from 'rxjs/operators';
import { EmrGraphicsMaster, EmrGraphicsDetails } from './emr-graphics.interface';
import { ModalContainerComponent } from "../../ui-component/modal-container/modal-container.component";

import * as teeth from './teeth.json';
import { EmrSpecialtyMarkersService } from "../../../portalServicesUsed/emr-specialty-markers.service";

export interface EmrSpecialtiesImages {
  serial?: number;
  specialityId?: number;
  imagePath?: string;
  base64: string;

  masterSerial?: number;
  svgView?: string;
}
export interface EmrSpecialtyMarkers {
  serial?: number;
  specialtyId?: number;
  nameAr?: string;
  nameEn?: string;
  strokeColor?: string;
  active?: number;
  shapeType?: string;
  shapeAsText?: string;
  shapeWidth?: number;
  dataStatus?: number;
}


@Component({
  selector: 'canvas-draw',
  templateUrl: './marker.component.html',
  styleUrls: ['./marker.component.css']
})
export class CanvasMarkerComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
  @ViewChild('areaDraw', { static: false }) areaDraw: CanvasAreaDraw;
  @ViewChild('area2Draw', { static: false }) area2Draw: CanvasAreaDraw;

  private image: EmrSpecialtiesImages;
  imageUrl: string;
  image2Url: string;
  strokeColor: string;
  fillColor: string;
  activeLegend: Legend;
  legendArr: Legend[] = [];
  canvasLegends: Legend[] = [];
  restoreConvasLegend: Legend;
  handleFillColor: string;
  handleStrokeColor: string;
  updateWhileMoving: boolean;
  isRefreshCanvas = false;
  defaults: Array<Array<Array<number>>>;
  private ngUnsubscribe = new Subject<void>();
  isRefreshSelectedLegends = false;

  toothNotes: string = '';
  teethData: any = teeth.default;

  constructor(
    private emrSpecMarkerSer: EmrSpecialtyMarkersService,
    private usersession: UserSessionService,
    public translate: TranslateService,
  ) {
    // this.imageUrl = '../assets/images/adult_teeth.png';
    // this.image2Url = '../assets/images/adult_teeth.png';
    this.strokeColor = 'rgba(255, 0, 0, 0.9)';
    this.fillColor = 'rgba(41, 128, 185, 1))';
    this.handleFillColor = 'rgba(41, 128, 185, 1)';
    this.handleStrokeColor = 'rgba(41, 128, 185, 1)';
    this.updateWhileMoving = false;
    this.defaults = [];

  }

  ngOnInit() {
    this.EmrPatient$();
  }

  EmrPatient$() {
    this.usersession
      .subscribeToKey$('EmrPatient')
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((keys: any) => {
        if (keys && keys.value) {
          const emrParms = <EmrParms>(
            this.usersession.getSessionKey('EmrSearchParms')
          );
          if (emrParms) {
            this.resetLegend();
            this.getSpecialtyMarkers({ specialtyId: emrParms.specialityId });
            this.emrGraphicsSearch();
          }
        }
      });
  }

  getSpecialtyMarkers(entity: EmrSpecialtyMarkers) {
    this.emrSpecMarkerSer
      .medicalSpeciatiesMarkersSearch(entity)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        if (res && res.returnFlag) {
          this.legendArr = res.data.length ? res.data : [];
          this.legendArr.map(item => {
            if (item.shapeWidth)
              return item = this.convertShapeWidthFromNumberToArray(item);
          });
          if (this.legendArr.length) this.onLegendChange(this.legendArr[0]);
        }
      });
  }
  convertShapeWidthFromNumberToArray(item) {
    /********************** */
    let arr = item.shapeWidth
      .toString()
      .replace(/\D/g, '0')
      .split('')
      .map(Number);
    item.shapeWidth = [];
    arr = [...arr];
    const c = arr.join('');
    // tslint:disable-next-line:radix
    const n = parseInt(c);
    item.shapeWidth.push(n);

    return item;
  }
  onmoveFn(data) {

    // console.log(data);
  }

  onAddShape() {

    alert('A new shape has been added.');
  }

  onRemoveShape(event: number) {
    alert(`The shape in position ${event} has been removed.`);
  }

  clean(): void {
    this._setImage2Url('');
  }
  reset() {
  }

  sceneChange(event: number): void {

    if (typeof event === 'number') {
      const url = this.areaDraw.getImageIn();
      if (url && url !== this.image2Url) {
        this._setImage2Url(url);
      }
    }
  }

  private _setImage2Url(url: string): void {
    // this.image2Url = url;
    // this.areaDraw.imageUrl = url;
  }

  onLegendChange(item: Legend) {
    this.fillColor = item.strokeColor;
    this.strokeColor = item.strokeColor;
    this.handleFillColor = item.strokeColor;
    this.handleStrokeColor = item.strokeColor;
    this.activeLegend = Object.assign(item);
  }

  removeDrawedLegendFromCanvas(item: Legend) {
    this.restoreConvasLegend = JSON.parse(JSON.stringify(item));
  }
  svgView: string;
  onCarouselVeiwerImageUrl(image: EmrSpecialtiesImages) {
    if (image) {
      this.isRefreshCanvas = true;
      // setTimeout(() => {
      //   this.isRefreshCanvas = false;
      // }, 100);
      if (image && image.svgView) {
        this.drawSvg = true;
        setTimeout(() => {
          this.handleSvgViewInScreen(image.svgView);
        }, 200);
      }
      else {
        if (document.getElementById('svgViewScreen'))
          document.getElementById('svgViewScreen').innerHTML = '';
        this.drawSvg = false;
        this.imageUrl = image.imagePath;
      }
      this.image = image;
      const master = this.emrGraphicMasters.find(el => el.imageSerial == this.image.serial);
      if (master && master.masterSerial > 0) {
        this.image.masterSerial = master.masterSerial;
        const filteredData = this.emrGraphicDetails.filter(el => el.masterSerial == master.masterSerial)
        this.canvasLegends = filteredData.length > 0 ? filteredData.map(item => {
          item.shapeProp = item.shapeProp;
          item.stateNumber = item.serial;
          item = this.convertShapeWidthFromNumberToArray(item);
          return item;
        }) : [];
      } else {
        this.canvasLegends = [];
      }
      setTimeout(() => {
        this.drawSvgCircles(this.canvasLegends);
      }, 300);
    }
  }
  drawSvgCircles(canvasLegends: Legend[]) {
    if (this.drawSvg && canvasLegends.length > 0) {
      let mainSpots = document.querySelectorAll('g[id="mt_spots"]')[1] as SVGGElement;
      if (mainSpots) {
        for (var i = 0; i < canvasLegends.length; i++) {
          const element = canvasLegends[i];
          let shape = `<circle 
                        cx="${element.shapeProp.x < 0 ? element.shapeProp.x * -1 : element.shapeProp.x}" 
                        cy="${element.shapeProp.y < 0 ? element.shapeProp.y * -1 : element.shapeProp.y}" 
                        r="${element.shapeProp.radius}" 
                        fill="${element.strokeColor}" 
                        fill-opacity="0.6" 
                        stroke="${element.strokeColor}" 
                        stroke-opacity="0.6" 
                        id="${element.shapeProp.elementId}" 
                        cursor="pointer"
                        style="fill: ${element.strokeColor}; 
                        fill-opacity: 0.6; stroke: ${element.strokeColor}; 
                        stroke-opacity: 0.6;">
                        <title>${element.shapeProp.text}</title>
                      </circle>`;
          if (element.shapeTypeTag == SHAPES.REC)
            shape = `<rect x="${element.shapeProp.x}" y="${element.shapeProp.y}" width="50" height="50" id="${element.shapeProp.elementId}" 
                    fill="${element.strokeColor}" stroke-width="3" stroke="${element.strokeColor}">
                    <title>${element.shapeProp.text}</title>
                    </rect>`;
          mainSpots.innerHTML += shape;
        }
        // set click event for circles
        let circles = mainSpots.getElementsByTagName('circle');
        let rects = mainSpots.getElementsByTagName('rect');
        for (let n = 0; n < circles.length; n++) {
          const crl = circles[n];
          crl.addEventListener('click', () => { this.removeSpot(mainSpots, crl, 'circle') })
        }
        for (let c = 0; c < rects.length; c++) {
          const rct = rects[c];
          rct.addEventListener('click', () => { this.removeSpot(mainSpots, rct, 'rectangle') })
        }
      }
    }
  }

  removeSpot(mainSpots: SVGGElement, crl: SVGCircleElement | SVGRectElement, type: string) {
    if (confirm(`Are you wanna delete ${type} ? `)) {
      mainSpots.removeChild(document.getElementById(crl.id));
      this.canvasLegends.forEach(el => {
        if (el.shapeProp.elementId == crl.id) el.shapeProp.state = 2;
      })
    }
  }
  addSpot(e: any, id: number) {
    let mainSpots = document.querySelectorAll('g[id="mt_spots"]')[1] as SVGGElement;
    let bound = this._getPointLocation(e);
    let cx = bound.x;
    let cy = bound.y;
    if (this.activeLegend.shapeTypeTag == SHAPES.ARC)
      mainSpots.innerHTML += `<circle cx="${cx}" cy="${cy}" r="30" id="mt_spots_${id}" 
                fill="${this.fillColor}" stroke="${this.strokeColor}" 
                fill-opacity="0.6" stroke-opacity="0.6" cursor="pointer"></circle>`;
    else if (this.activeLegend.shapeTypeTag == SHAPES.REC)
      mainSpots.innerHTML += `<rect x="${cx}" y="${cy}" width="50" height="50" id="mt_spots_${id}"  
                fill="${this.fillColor}" stroke-width="3" stroke="${this.strokeColor}" />`;
    else
      mainSpots.innerHTML += `<circle cx="${cx}" cy="${cy}" r="30" id="mt_spots_${id}" 
                fill="${this.fillColor}" stroke="${this.strokeColor}" 
                fill-opacity="0.6" stroke-opacity="0.6" cursor="pointer"></circle>`;
    this.canvasLegends.push({
      serial:this.activeLegend.serial,
      emrMarkersSerial: this.activeLegend.serial,
      nameAr: this.activeLegend.nameAr,
      nameEn: this.activeLegend.nameEn,
      shapeType: this.activeLegend.shapeType,
      shapeTypeTag: this.activeLegend.shapeTypeTag,
      stateNumber: (this.canvasLegends.length + 1) * -1,
      shapeProp: { x: cx, y: cy, radius: 30, elementId: `mt_spots_${id}` }
    });

    // set click event for circles
    let circles = mainSpots.getElementsByTagName('circle');
    let rects = mainSpots.getElementsByTagName('rect');
    for (let c = 0; c < circles.length; c++) {
      const crl = circles[c];
      crl.addEventListener('click', (e) => { this.removeSpot(mainSpots, crl, 'circle') });
    }
    for (let r = 0; r < rects.length; r++) {
      const rct = rects[r];
      rct.addEventListener('click', (e) => { this.removeSpot(mainSpots, rct, 'rectangle') });
    }
  }

  private _getPointLocation(e): { x: number, y: number } {
    let cont = document.getElementById('svgViewScreen') as HTMLDivElement;
    let svg = cont.querySelector('svg');
    let pt = svg.createSVGPoint();
    let loc = this._cursorPoint(e, pt, svg);
    return { x: loc.x, y: loc.y };
  }

  private _cursorPoint(evt, pt, svg) {
    pt.x = evt.clientX; pt.y = evt.clientY;
    return pt.matrixTransform(svg.getScreenCTM().inverse());
  }


  drawSvg: boolean = false;
  modalNo: string;
  @ViewChild('tooltip', { static: false }) tooltip: ElementRef;
  @ViewChild('popup', { static: false }) content: ModalContainerComponent;
  handleSvgViewInScreen(svgView: string) {
    if (document.getElementById('svgViewScreen')) {
      let svgDiv = document.getElementById('svgViewScreen') as HTMLDivElement;
      if (!svgDiv.querySelector('svg')) {
        let tempDiv = document.createElement('div');
        tempDiv.innerHTML = svgView;
        let item = tempDiv.getElementsByTagName('svg')[0];
        item.style.width = "698px";
        item.style.height = "499px";
        svgDiv.innerHTML = item.outerHTML;
      }

      for (let i = 1; i <= 32; i++) {
        let pathElem = document.querySelectorAll(`path[id='d${i}'`)[1] as HTMLElement;
        let tooltip = document.getElementById('organs-tip') as HTMLSpanElement;
        let tipImg = document.getElementById('tip_img') as HTMLImageElement;
        let tipTitle = document.getElementById('tip_title');
        let tipDesc = document.getElementById('tip_desc');
        pathElem.addEventListener('mouseover', (e) => {
          tooltip.style.display = 'block';
          tooltip.style.top = `${e.clientY}px`;
          tooltip.style.left = `${e.clientX}px`;
          // set data to tip
          tipImg.src = `assets/images/teeth/${(i > 9 ? '' : '0') + i}.png`;
          tipTitle.innerHTML = this.teethData['d' + i].title;
          tipDesc.innerHTML = this.teethData['d' + i].desc;
          pathElem.style.fillOpacity = '0.3';
        });
        fromEvent<any>(pathElem, 'mouseleave').subscribe(() => {
          tooltip.style.display = 'none';
          pathElem.style.fillOpacity = '0';
        });
        fromEvent<any>(pathElem, 'click').subscribe((e) => {
          this.addSpot(e, i);
          this.modalNo = `tooth${i}`;
          this.toothNotes = '';
          this.content.openModal('tooth' + i, 'params', { modalName: `tooth${i}` }, 'sm');
          (document.getElementsByClassName('modal-body')[0] as HTMLDivElement).style.height = '100%';
        });
      }
    }
  }

  GetCanvasLegends(legends) {
    this.canvasLegends = Object.assign(legends);
    // this.isRefreshSelectedLegends = true;
    // setTimeout(() => {
    //   this.isRefreshSelectedLegends = false;
    // }, 0);
  }
  emrGraphicMasters: EmrGraphicsMaster[] = [];
  emrGraphicDetails: EmrGraphicsDetails[] = [];
  emrGraphicsSearch() {
    const parm = <EmrParms>this.usersession.getSessionKey('EmrSearchParms');
    const visitSerial = parm ? parm.visitSerial : undefined;
    this.emrSpecMarkerSer
      .emrGraphicsSearch({ visitSerial })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        if (res && res.returnFlag) {
          this.emrGraphicMasters = [];
          this.emrGraphicDetails = [];
          this.canvasLegends = [];
          //master
          if (res.data && res.data.length > 0) {
            this.emrGraphicMasters = res.data;
            const master = <EmrGraphicsMaster>res.data.length > 0 ? res.data[0] : {};
            master.imagePath = master && master.imagePath != 'No Path' ? master.imagePath : `data: image/png;base64, ${master.base64}`;
            this.imageUrl = master.imagePath;
            this.image = master;
            this.image.serial = master.imageSerial;
          }
          //details
          if (res.data1 && res.data1.length > 0) {
            const details = <EmrGraphicsDetails[]>res.data1;
            this.emrGraphicDetails = details;
            const firstImgLegands = details.filter(el => this.image.masterSerial == el.masterSerial);
            this.canvasLegends = firstImgLegands.length > 0 ? firstImgLegands.map(item => {
              item.shapeProp = JSON.parse(item.shapeProp.toString());
              item.stateNumber = item.serial;
              item = this.convertShapeWidthFromNumberToArray(item);
              return item;
            }) : [];
          }
        }
      });
  }

  saveEmrGraphics() {

    const parm = <EmrParms>this.usersession.getSessionKey('EmrSearchParms');
    const graphicMaster = <EmrGraphicsMaster>{
      serial: this.image.masterSerial > 0 ? this.image.masterSerial : -1,
      dataStatus: this.image.masterSerial > 0 ? 2 : 1,
      emrSpecImageSerial: this.image ? this.image.serial : undefined,
      visitSerial: parm ? parm.visitSerial : undefined,
      graphicsDetails: []
    };

    this.canvasLegends.map(item => {
      const detail = <EmrGraphicsDetails>{
        serial: item.stateNumber,
        shapeProp: JSON.stringify({ ...item.shapeProp, text: this.toothNotes }),
        emrMarkersSerial: item.emrMarkersSerial ? item.emrMarkersSerial: item.serial ,//this.drawSvg ? item.serial : 11,
        masterSerial: graphicMaster.serial,
        dataStatus: this.drawSvg ? (item.stateNumber > 0 ? 2 : 1) : 1
      };
      detail.dataStatus = item.shapeProp.state == 2 ? 3 : detail.dataStatus;
      graphicMaster.graphicsDetails.push(detail);
    });

    if (this.drawSvg)
      graphicMaster.graphicsDetails = graphicMaster.graphicsDetails.filter(el => el.dataStatus == 1 || el.dataStatus == 3);

    this.emrSpecMarkerSer.emrGraphicsSave(graphicMaster)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        if (res && res.returnFlag)
          // this.resetLegend();
          this.emrGraphicsSearch();
      });
  }


  resetImage(): void {
    this.imageUrl = '';
    this.image = undefined;
  }

  resetLegend() {
    this.canvasLegends = [];
    this.legendArr = [];
    this.activeLegend = undefined;
    this.isRefreshCanvas = true;
    setTimeout(() => {
      this.isRefreshCanvas = false;
    }, 100);
  }

  resetAll() {
    this.resetImage();
    this.resetLegend();
  }

  //////////////////////////// section tooth data \\\\\\\\\\\\\\\\\\\\\\\\\\\\
  onpopupClose(ev: any) {
    if (ev && ev.output == "Cross click") {
      this.removeShapeTooth(this.canvasLegends.pop(), true);
    }
  }
  removeShapeTooth(item: Legend, fromList?: boolean) {
    if (fromList) {
      let shape = this.canvasLegends.find(el => el.serial == item.serial);
      if (shape && shape) {
        if (shape.stateNumber > 0) this.canvasLegends.splice(this.canvasLegends.indexOf(shape), 1);
        else this.canvasLegends.find(el => el.serial == item.serial).shapeProp.state = 2;
      }
    }
    let mainSpots = document.querySelectorAll('g[id="mt_spots"]')[1] as HTMLElement;
    mainSpots.removeChild(document.getElementById(item.shapeProp.elementId));
  }


  saveToothData() {
    this.saveEmrGraphics();
    this.usersession.closeModalKey(this.modalNo, {});
  }

  getTeethData(tooth: number = 0) {
    if (this.tooltip)
      return this.tooltip.nativeElement.innerHTML;
    else
      return 'hello world';
  }

}
