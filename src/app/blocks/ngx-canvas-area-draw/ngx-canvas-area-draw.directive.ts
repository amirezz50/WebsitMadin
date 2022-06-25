import {
    Directive, ElementRef, Input, Renderer2, NgZone, Output, EventEmitter, AfterViewInit, OnDestroy
} from '@angular/core';
import { Shape } from './ngx-canvas-area-draw.shape';
import { Pencil } from './ngx-canvas-area-draw.pencil';
import { SubscriptionLike as ISubscription } from 'rxjs';
import { Legend, SHAPES } from './ngx-canvas-area-draw.interfaces';
@Directive({
    // tslint:disable-next-line:directive-selector
    selector: '[canvasAreaDraw]',
    exportAs: 'canvasAreaDraw'
})
export class CanvasAreaDraw implements AfterViewInit, OnDestroy {
    isAddingLegend = true;
    @Output('activeShapeChangeEvent') activeShapeChangeEvent: EventEmitter<any> = new EventEmitter();
    @Output('addShapeEvent') addShapeEvent: EventEmitter<any> = new EventEmitter();
    @Output('removeShapeEvent') removeShapeEvent: EventEmitter<number> = new EventEmitter();
    @Output() GetCanvasLegends = new EventEmitter<Legend[]>();

    @Input('defaultShapes') defaultShapes: Array<Array<Array<number>>>;
    @Input('eventWhileMoving') eventWhileMoving: boolean;
    private activeLegend: Legend;
    @Input('activeLegend') set setActiveLegend(legend) {
        if (legend) {
            this.activeLegend = legend;
            const tmp_canvas = document.querySelector('#tmp_canvas');
            if (tmp_canvas) {
                tmp_canvas.parentNode.removeChild(tmp_canvas);
            }
            if (this.activeLegend.shapeTypeTag == SHAPES.PEN) {
                this.drawLine();
            }
        }
    }

    @Input('canvasAreaDraw')
    set imageUrl(url: string) {
        if (this.isReady) {
            this.isReady = false;
            this.isDrawing = false;
            this.isAddingLegend = true;
            this.height = null;
            this.width = null;

            this._MousedownListen();
            this._MouseupListen();
            this._MouseLeaveListen();
            this._MousemoveListen();
            this._ContextmenuListen();
            this._deleteAllShapesSubscriptions();

            if (this._baseCanvas) {
                this.renderer.removeChild(this.element.nativeElement, this._baseCanvas);
            }
            if (this._pencil) {
                this.renderer.removeChild(this.element.nativeElement, this._pencil.canvas);
            }
            for (let i = 0; i < this.shapes.length; ++i) {
                this.renderer.removeChild(this.element.nativeElement, this.shapes[i].canvas);
            }
            this._baseCanvas = null;
            this._pencil = null;
            this.shapes = [];
            this._activeShapePos = null;
            this._imageUrl = url;

            if (url) {
                this.ngZone.runOutsideAngular(() => this._paint());
            } else {
                this._ImageLoadListen();
                if (this._baseImage) {
                    this.renderer.removeChild(this.element.nativeElement, this._baseImage);
                }
                this.isReady = true;
                this._baseImage = null;
            }
        } else if (url) {
            this._imageUrl = url;
        }
    }

    get imageUrl() {
        return this._imageUrl;
    }

    @Input('strokeColor')
    set strokeColor(color: string) {
        if (color && this._strokeColor) {
            // for (let i = 0; i < this.shapes.length; ++i) {
            //    this.shapes[i].setColors(color, null, null, null)
            // }
            if (this._pencil) {
                this._pencil.setColors(color, null, null);
            }
        }
        this._strokeColor = color;
    }

    get strokeColor() {
        return this._strokeColor;
    }

    @Input('fillColor')
    set fillColor(color: string) {
        if (color && this._fillColor) {
            // for (let i = 0; i < this.shapes.length; ++i) {
            //    this.shapes[i].setColors(null, color, null, null)
            // }
        }
        this._fillColor = color;
    }
    get fillColor() {
        return this._fillColor;
    }

    @Input('handleStrokeColor')
    set handleStrokeColor(color: string) {
        if (color && this._handleStrokeColor) {
            // for (let i = 0; i < this.shapes.length; ++i) {
            //    this.shapes[i].setColors(null, null, null, color)
            // }
            if (this._pencil) {
                this._pencil.setColors(null, null, color);
            }
        }
        this._handleStrokeColor = color;
    }

    get handleStrokeColor() {
        return this._handleStrokeColor;
    }
    @Input('handleFillColor')
    set handleFillColor(color: string) {
        if (color && this._handleFillColor) {
            // for (let i = 0; i < this.shapes.length; ++i) {
            //    this.shapes[i].setColors(null, null, color, null)
            // }
            if (this._pencil) {
                this._pencil.setColors(null, color, null);
            }
        }
        this._handleFillColor = color;
    }
    get handleFillColor() {
        return this._handleFillColor;
    }

    @Input('canvasLegends')
    set setCanvasLegends(value) {
        if (value) {
            this.canvasLegends = value;
        }
    }
    // get setCanvasLegends() {
    //     return this.canvasLegends;
    // }

    shapes: Array<Shape>;
    height: string;
    width: string;
    isReady: boolean;
    isDrawing: boolean;


    private _pencil: Pencil;
    private _activeShapePos: number;
    private _baseCanvas: HTMLCanvasElement;
    private _baseImage: any;
    private _imageUrl: string;
    private _strokeColor: string;
    private _fillColor: string;
    private _handleFillColor: string;
    private _handleStrokeColor: string;
    private _pencilSubscription: ISubscription;
    private _shapesSubscription: Array<Array<ISubscription>>;
    private currenctStateNumber = undefined;
    private canvasLegends: Legend[] = [];

    @Input() set restoreConvasState(legend: Legend) {
        if (legend) {
            this.restoreCanvasState(legend);
        }
    }

    constructor(private element: ElementRef,
        private renderer: Renderer2,
        private ngZone: NgZone) {
        this.shapes = [];
        this._shapesSubscription = [];
        this.defaultShapes = [];
        this.isReady = false;
        this.strokeColor = 'rgba(255, 255, 255, 0.7)';
        this.fillColor = 'rgba(41, 128, 185, 1)';
        this.handleFillColor = 'rgba(255, 255, 255, 1)';
        this.handleStrokeColor = 'rgba(255, 255, 255, 1)';

        this.renderer.setStyle(this.element.nativeElement, 'position', 'relative');
    }

    ngAfterViewInit() {
        this.ngZone.runOutsideAngular(() => this._paint());
        setTimeout(() => {
            this.redrawOldLegend();
        }, 100);
    }

    ngOnDestroy() {
        this._MousedownListen();
        this._MouseupListen();
        this._MouseLeaveListen();
        this._MousemoveListen();
        this._ContextmenuListen();
        this._ImageLoadListen();
        this._ImageErrorListen();

        this._deleteAllShapesSubscriptions();
        if (this._pencilSubscription) {
            this._pencilSubscription.unsubscribe();
        }
    }

    private _paint(): void {
        this._baseCanvas = this.renderer.createElement('canvas');

        if (!this._baseImage) {
            this._baseImage = this.renderer.createElement('img');
            //this.renderer.setAttribute(this._baseImage, 'crossOrigin', 'Anonymous');
            this._setStyle(this._baseImage, '1');

            this._ImageLoadListen = this.renderer.listen(this._baseImage, 'load', (event: any) => {
                this.height = this._baseImage.height.toString();
                this.width = this._baseImage.width.toString();

                this._pencil = new Pencil(this.renderer, this.element, this.strokeColor, this.handleFillColor, this.handleStrokeColor);
                this._setStyle(this._pencil.canvas, '0');
                this._setStyle(this._baseCanvas, '3');

                if (this.defaultShapes.length > 0) {
                    for (const shape of this.defaultShapes) {
                        this.addShape(shape, false, false);
                    }
                    this.defaultShapes = [];
                }

                this.isReady = true;
            });

            this._ImageErrorListen = this.renderer.listen(this._baseImage, 'error', (event: any) => {
                this.isReady = true;
            });

            this.renderer.appendChild(this.element.nativeElement, this._baseImage);
        }
        this.renderer.setAttribute(this._baseImage, 'src', this.imageUrl);
        this.renderer.appendChild(this.element.nativeElement, this._baseCanvas);

        this._MouseLeaveListen = this.renderer.listen(this._baseCanvas, 'mouseleave', this._onMouseleave.bind(this));
        this._MousedownListen = this.renderer.listen(this._baseCanvas, 'mousedown', this._onMousedown.bind(this));
        this._MouseupListen = this.renderer.listen(this._baseCanvas, 'mouseup', this._onMouseup.bind(this));
        this._ContextmenuListen = this.renderer.listen(this._baseCanvas, 'contextmenu', this._onContextmenu.bind(this));
    }

    getImageIn(pos: number = null): string {
        if (typeof (pos) !== 'number') {
            pos = this._activeShapePos;
        }
        if (typeof (pos) === 'number' && this.shapes.length > pos) {
            const canvas = this.renderer.createElement('canvas');
            const context = canvas.getContext('2d');

            let minX = 1000000;
            let maxX = 0;
            let minY = 1000000;
            let maxY = 0;

            const shape = this.shapes[pos];
            for (let i = 0; i < shape.points.length; ++i) {
                if (minX > shape.points[i][0]) {
                    minX = shape.points[i][0];
                }
                if (minY > shape.points[i][1]) {
                    minY = shape.points[i][1];
                }
                if (maxX < shape.points[i][0]) {
                    maxX = shape.points[i][0];
                }
                if (maxY < shape.points[i][1]) {
                    maxY = shape.points[i][1];
                }
            }

            canvas.width = maxX - minX;
            canvas.height = maxY - minY;
            for (let i = 0; i < shape.points.length; ++i) {
                if (shape.points[i]) {
                    context.lineTo(shape.points[i][0] - minX, shape.points[i][1] - minY);
                }
            }
            context.closePath();
            context.clip();
            context.drawImage(this._baseImage, -minX, -minY, this.width, this.height);
            return canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
        }
        return null;
    }

    startPaint(): void {
        if (this.isReady && !this.isDrawing) {
            if (typeof (this._activeShapePos) === 'number') {
                this.shapes[this._activeShapePos].setActive(false);
                this.setActiveShapePos(null);
            }
            this.isDrawing = true;
            this.renderer.setStyle(this._pencil.canvas, 'display', 'block');
            this.renderer.setStyle(this._pencil.canvas, 'z-index', this.shapes.length + 2);
            this.renderer.setStyle(this._baseCanvas, 'z-index', this.shapes.length + 3);
            this.renderer.setStyle(this._baseCanvas, 'cursor', 'copy');

            this._pencilSubscription = this._pencil.onCompleted().subscribe(() => {
                this._stopPaint();
            });
            this._MousemoveListen = this.renderer.listen(this._baseCanvas, 'mousemove', this._onMovePoint.bind(this));
        }
    }

    addShape(points: Array<Array<any>> = [], emit: boolean = true, isCircle: boolean): void {
        const shape = new Shape(
            this.renderer, this.element, points, this.strokeColor, this.fillColor, this.handleFillColor, this.handleStrokeColor, isCircle);
        this._setStyle(shape.canvas, (this.shapes.length + 2).toString());
        this.renderer.setStyle(this._baseCanvas, 'z-index', this.shapes.length + 3);

        const subscription1 = shape.activeMovePoint().subscribe(() => {
            this._MousemoveListen = this.renderer.listen(this._baseCanvas, 'mousemove', this._onMovePoint.bind(this));
        });
        const subscription2 = shape.activeMoveShape().subscribe(() => {
            this._MousemoveListen = this.renderer.listen(this._baseCanvas, 'mousemove', this._onMoveShape.bind(this));
        });

        for (let p = 0; p < this.shapes.length; ++p) {
            if (this.shapes[p].isActive) {
                this.shapes[p].setActive(false);
            }
        }

        this.shapes.push(shape);
        this._shapesSubscription.push([subscription1, subscription2]);
        if (emit) {
            this.addShapeEvent.emit();
        }
        this.setActiveShapePos(this.shapes.length - 1);
        shape.setActive();
    }

    addLegend(points: Array<number>[]) {
        const x = points[0][0];
        const y = points[0][1];
        const wid = this.activeLegend.shapeWidth[0];

        const context: CanvasRenderingContext2D = this._baseCanvas.getContext('2d');
        context.globalCompositeOperation = 'destination-over';
        context.lineWidth = 1;
        context.fillStyle = this.fillColor;
        context.strokeStyle = this.strokeColor;
        context.beginPath();
        this.activeLegend.shapeProp = undefined;
        /* ************************************************************************************************** */
        // tslint:disable-next-line:triple-equals
        if (this.activeLegend.shapeTypeTag == SHAPES.ARC) {
            context.arc(x, y, wid, 0, 2 * Math.PI);

            this.activeLegend.shapeProp = {
                x: x,
                y: y,
                radius: wid,
                startAngle: 0,
                EndAngle: 2 * Math.PI
            };
            /* ************************************************************************************************** */
            // tslint:disable-next-line:triple-equals
        } else if (this.activeLegend.shapeTypeTag == SHAPES.REC) {
            context.fillRect(x, y, wid, wid);

            this.activeLegend.shapeProp = {
                x: x,
                y: y,
                width: wid,
                height: wid
            };
            /* ************************************************************************************************** */
            // tslint:disable-next-line:triple-equals
        } else if (this.activeLegend.shapeTypeTag == SHAPES.TRI) {
            context.moveTo(x, y);
            context.lineTo(x + wid, y + wid);
            context.lineTo(x + (wid * 2), y);

            this.activeLegend.shapeProp = {
                x: x,
                y: y,
                width: wid,
                points: [
                    [x + wid, y],
                    [x + (wid * 2), y]
                ]
            };
            /* ************************************************************************************************** */
            // tslint:disable-next-line:triple-equals
        } else if (this.activeLegend.shapeTypeTag == SHAPES.TEXT) {
            context.font = `italic ${wid * 2}pt Calibri`;
            context.fillText(this.activeLegend.shapeAsText, x + wid, y + wid);
            this.activeLegend.shapeProp = {
                text: this.activeLegend.shapeAsText,
                x: x,
                y: y,
                width: wid
            };
            /* ************************************************************************************************** */
            // tslint:disable-next-line:triple-equals
        } else if (this.activeLegend.shapeTypeTag == SHAPES.PEN) {
            this.drawLine();
            return;
        }
        context.closePath();
        context.stroke();
        context.fill();
        if (this.activeLegend.shapeProp) {
            this.saveLegendToArray();
        }
    }

    private drawLine() {

        const ctx: CanvasRenderingContext2D = this._baseCanvas.getContext('2d');

        const self = this;
        // Creating a tmp canvas
        const tmp_canvas = <HTMLCanvasElement>document.createElement('canvas');
        tmp_canvas.id = 'tmp_canvas';
        tmp_canvas.width = this._baseCanvas.width;
        tmp_canvas.height = this._baseCanvas.height;
        this.renderer.appendChild(this.element.nativeElement, tmp_canvas);
        this._setStyle(tmp_canvas, '4');
        this.renderer.setStyle(tmp_canvas, 'cursor', 'crosshair');
        const tmp_ctx = tmp_canvas.getContext('2d');

        const mouse = { x: 0, y: 0 };
        const last_mouse = { x: 0, y: 0 };
        let drawflag = false;
        // Pencil Points
        let ppts: Array<Array<number>> = [];

        /* Mouse Capturing Work */
        tmp_canvas.addEventListener('mousemove', function (e:any) {
            mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
            mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;
        }, false);

        const onPaintLine = function () {
            if (!drawflag) {
                return;
            }
            // Saving all the points in an array
            ppts.push([mouse.x, mouse.y]);

            if (ppts.length < 3) {
                const b = ppts[0];
                tmp_ctx.beginPath();
                // ctx.moveTo(b.x, b.y);
                // ctx.lineTo(b.x+50, b.y+50);
                tmp_ctx.arc(b[0], b[1], tmp_ctx.lineWidth / 2, 0, Math.PI * 2, !0);
                tmp_ctx.fill();
                tmp_ctx.closePath();

                return;
            }

            // Tmp canvas is always cleared up before drawing.
            // tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);

            tmp_ctx.beginPath();
            tmp_ctx.moveTo(ppts[0][0], ppts[0][1]);
            let i = 1;
            for (i = 1; i < ppts.length - 2; i++) {
                const c = (ppts[i][0] + ppts[i + 1][0]) / 2;
                const d = (ppts[i][1] + ppts[i + 1][1]) / 2;

                tmp_ctx.quadraticCurveTo(ppts[i][0], ppts[i][1], c, d);
            }

            // For the last 2 points
            tmp_ctx.quadraticCurveTo(
                ppts[i][0],
                ppts[i][1],
                ppts[i + 1][0],
                ppts[i + 1][1]
            );
            tmp_ctx.stroke();

        };

        /* Drawing on Paint App */
        const wid = this.activeLegend.shapeWidth[0];
        tmp_ctx.lineWidth = wid;
        tmp_ctx.lineJoin = 'round';
        tmp_ctx.lineCap = 'round';
        tmp_ctx.strokeStyle = this.activeLegend.strokeColor;
        tmp_ctx.fillStyle = this.activeLegend.strokeColor;
        tmp_canvas.addEventListener('mousemove', onPaintLine, false);

        tmp_canvas.addEventListener('mousedown', function (e: any) {
            drawflag = true;
            mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
            mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;
            ppts.push([mouse.x, mouse.y]);
            onPaintLine();
        }, false);
        tmp_canvas.addEventListener('mouseup', function () {

            drawflag = false;
            if (ppts.length > 0) {
                self.activeLegend.shapeProp = {
                    x: ppts[0][0],
                    y: ppts[0][1],
                    points: ppts,
                    width: wid
                };
                self.saveLegendToArray();
                // Writing down to real canvas now
                ctx.drawImage(tmp_canvas, 0, 0);
                // Clearing tmp canvas
                tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);
                // Emptying up Pencil Points
                ppts = [];
                // remove temp canvas
                tmp_canvas.parentNode.removeChild(tmp_canvas);
                self.drawLine();
            }
        }, false);

    }

    setActiveShapePos(value: any): void {
        this._activeShapePos = value;
        this.activeShapeChangeEvent.emit(value);
    }

    private saveLegendToArray(): void {
        if (!this.currenctStateNumber) {
            this.currenctStateNumber = -1;
            if (this.canvasLegends.length > 0) {
                this.currenctStateNumber = this.canvasLegends.length * -1;
            }
        }
        // const ctx: CanvasRenderingContext2D = this._baseCanvas.getContext('2d');
        this.activeLegend.stateNumber = this.currenctStateNumber--;

        this.canvasLegends.push(JSON.parse(JSON.stringify(this.activeLegend)));
        this.GetCanvasLegends.emit(Object.assign(this.canvasLegends));
    }

    /* ********************************************************* */
    private restoreCanvasState(legend: Legend): void {
        // const ctx: CanvasRenderingContext2D = this._baseCanvas.getContext('2d');

        // tslint:disable-next-line:triple-equals
        const stateIndex = this.canvasLegends.findIndex(item => item.stateNumber == legend.stateNumber);
        // tslint:disable-next-line:triple-equals
        if (stateIndex != -1) {
            //     const props = legend.shapeProp;
            //     /* ************************************************************************************************** */
            //     // tslint:disable-next-line:triple-equals
            //     if (legend.shapeTypeTag == 'ARC') {
            //         ctx.beginPath();
            //         ctx.clearRect(props.x - props.radius - 1, props.y - props.radius - 1,
            //             props.radius * 2 + 2, props.radius * 2 + 2);
            //         ctx.closePath();
            //         /* *************************************************************************************************** */
            //         // tslint:disable-next-line:triple-equals
            //     } else if (legend.shapeTypeTag == 'REC') {
            //         ctx.clearRect(props.x, props.y, props.width, props.height);
            //         /* ************************************************************************************************** */
            //         // tslint:disable-next-line:triple-equals
            //     } else if (legend.shapeTypeTag == 'TRI') {
            //         ctx.beginPath();
            //         ctx.moveTo(props.x, props.y);
            //         ctx.clearRect(props.x, props.y, props.x + props.width, props.y + props.width);
            //         ctx.clearRect(props.x, props.y, props.x + (props.width * 2), props.y);
            //         ctx.closePath();
            //         // ctx.moveTo(x, y);
            //         // ctx.lineTo(x + wid, y + wid);
            //         // ctx.lineTo(x + (wid * 2), y);

            //         // activeLegend.shapeProp = {
            //         //     points: [
            //         //         { x: x, y: y },
            //         //         { x: x + wid, y: y + wid },
            //         //         { x: x + (wid * 2), y: y }
            //         //     ]
            //         // };

            //         /* ************************************************************************************************** */
            //         // tslint:disable-next-line:triple-equals
            //     } else if (legend.shapeTypeTag == 'TEXT') {
            //         ctx.clearRect(props.x, props.y, props.x + props.width, props.y + props.width);
            //     }
            this.canvasLegends.splice(stateIndex, 1);
            this.clearCanvasImage();
            this.redrawOldLegend();
        }
    }
    /* ********************************************************* */
    private redrawOldLegend() {
        // const ctx: CanvasRenderingContext2D = this._baseCanvas.getContext('2d');
        // ctx.drawImage(this._baseCanvas, 0, 0);
        // const imageData = ctx.getImageData(0, 0, this._baseCanvas.width, this._baseCanvas.height);
        this.canvasLegends.forEach(item => {
            this.addLegendToCanvasManually([[item.shapeProp.x, item.shapeProp.y]], item, item.strokeColor, item.strokeColor);
        });
        this.GetCanvasLegends.emit(Object.assign(this.canvasLegends));

    }

    addLegendToCanvasManually(points: Array<number>[], legend: Legend, fillColor, strokeColor) {
        const x = points[0][0];
        const y = points[0][1];
        const wid = legend.shapeProp.width;
        const radius = legend.shapeProp.radius;

        const context: CanvasRenderingContext2D = this._baseCanvas.getContext('2d');
        context.globalCompositeOperation = 'destination-over';
        context.lineWidth = 1;
        context.fillStyle = fillColor;
        context.strokeStyle = strokeColor;
        context.beginPath();
        /* ************************************************************************************************** */
        // tslint:disable-next-line:triple-equals
        if (legend.shapeTypeTag == SHAPES.ARC) {
            context.arc(x, y, radius, 0, 2 * Math.PI);
            /* ************************************************************************************************** */
            // tslint:disable-next-line:triple-equals
        } else if (legend.shapeTypeTag == SHAPES.REC) {
            context.fillRect(x, y, wid, wid);
            /* ************************************************************************************************** */
            // tslint:disable-next-line:triple-equals
        } else if (legend.shapeTypeTag == SHAPES.TRI) {
            context.moveTo(x, y);
            context.lineTo(x + wid, y + wid);
            context.lineTo(x + (wid * 2), y);
            /* ************************************************************************************************** */
            // tslint:disable-next-line:triple-equals
        } else if (legend.shapeTypeTag == SHAPES.TEXT) {
            context.font = `italic ${wid * 2}pt Calibri`;
            context.fillText(legend.shapeAsText, x + wid, y + wid);
            /* ************************************************************************************************** */
            // tslint:disable-next-line:triple-equals
        } else if (legend.shapeTypeTag == SHAPES.PEN) {

            const ppts: Array<Array<number>> = legend.shapeProp ? legend.shapeProp.points : [];
            const mouse = ppts.length > 0 ? { x: ppts[0][0], y: ppts[0][1], } : { x: 0, y: 0 };
            this.reDrawOldLine(ppts, mouse, legend);
            return;
        }
        context.closePath();
        context.stroke();
        context.fill();
    }

    reDrawOldLine(ppts: Array<Array<number>>, mouse, legend: Legend) {

        const tmp_ctx: CanvasRenderingContext2D = this._baseCanvas.getContext('2d');
        tmp_ctx.lineWidth = legend.shapeProp.width;
        tmp_ctx.lineJoin = 'round';
        tmp_ctx.lineCap = 'round';
        tmp_ctx.strokeStyle = legend.strokeColor;
        tmp_ctx.fillStyle = legend.strokeColor;

        // Saving all the points in an array
        // ppts.push({ x: mouse.x, y: mouse.y });

        if (ppts.length < 3) {
            const b = ppts[0];
            tmp_ctx.beginPath();
            // ctx.moveTo(b.x, b.y);
            // ctx.lineTo(b.x+50, b.y+50);
            tmp_ctx.arc(b[0], b[1], tmp_ctx.lineWidth / 2, 0, Math.PI * 2, !0);
            tmp_ctx.fill();
            tmp_ctx.closePath();

            return;
        }

        tmp_ctx.beginPath();
        tmp_ctx.moveTo(ppts[0][0], ppts[0][1]);
        let i = 1;
        for (i = 1; i < ppts.length - 2; i++) {
            const c = (ppts[i][0] + ppts[i + 1][0]) / 2;
            const d = (ppts[i][1] + ppts[i + 1][1]) / 2;

            tmp_ctx.quadraticCurveTo(ppts[i][0], ppts[i][1], c, d);
        }

        // For the last 2 points
        tmp_ctx.quadraticCurveTo(
            ppts[i][0],
            ppts[i][1],
            ppts[i + 1][0],
            ppts[i + 1][1]
        );
        tmp_ctx.stroke();

    };


    private clearCanvasImage() {
        const ctx: CanvasRenderingContext2D = this._baseCanvas.getContext('2d');
        ctx.clearRect(0, 0, this._baseCanvas.width, this._baseCanvas.height);
    }





    // // private drawLine() {

    //     //     const ctx: CanvasRenderingContext2D = this._baseCanvas.getContext('2d');
    //     //     this.tmp_canvas = document.querySelector('#tmp_canvas');
    //     //     // this.tmp_canvas = this._baseCanvas;
    //     //     this.tmp_ctx = this.tmp_canvas ? this.tmp_canvas.getContext('2d') : undefined;
    //     //     this.mouse = { x: 0, y: 0 };
    //     //     const last_mouse = { x: 0, y: 0 };

    //     //     // Pencil Points
    //     //     this.ppts = [];   // Creating a tmp canvas
    //     //     if (!this.tmp_canvas) {

    //     //         this.tmp_canvas = document.createElement('canvas');
    //     //         this.tmp_canvas.id = 'tmp_canvas';

    //     //         this.tmp_canvas.style.position = 'absolute';
    //     //         this.tmp_canvas.style.left = '0px';
    //     //         this.tmp_canvas.style.right = '0px';
    //     //         this.tmp_canvas.style.bottom = '0px';
    //     //         this.tmp_canvas.style.top = '0px';
    //     //         this.tmp_canvas.style.cursor = 'crosshair';

    //     //         this.tmp_canvas.width = this._baseCanvas.width;
    //     //         this.tmp_canvas.height = this._baseCanvas.height;

    //     //         this.renderer.appendChild(this.element.nativeElement, this.tmp_canvas);
    //     //         this._setStyle(this.tmp_canvas, '4');
    //     //     }
    //     //     if (!this.tmp_ctx) {
    //     //         this.tmp_ctx = this.tmp_canvas.getContext('2d');

    //     //         /* Drawing on Paint App */
    //     //         this.tmp_ctx.lineWidth = 5;
    //     //         this.tmp_ctx.lineJoin = 'round';
    //     //         this.tmp_ctx.lineCap = 'round';
    //     //         this.tmp_ctx.strokeStyle = 'blue';
    //     //         this.tmp_ctx.fillStyle = 'blue';


    //     //         // this.renderer.listen(tmp_canvas, 'mousemove', this.tmp_canvasMouseMove.bind(this, event, mouse));
    //     //         // this.tmp_canvas.addEventListener('mousemove', this.tmp_canvasMouseMove.bind(this, event), false);
    //     //         /* Mouse Capturing Work */
    //     //         const move = e => {
    //     //             this.mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
    //     //             this.mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;
    //     //         };
    //     //         this.tmp_canvas.addEventListener('mousemove', move.bind(this, event), false);
    //     //         // this.renderer.listen(tmp_canvas, 'mousedown',
    //     //         // this.tmp_canvasmousedown.bind(this, event, mouse, tmp_canvas, tmp_ctx, ppts));
    //     //         // this.tmp_canvas.addEventListener('mousedown',
    //     //         //     this.tmp_canvasmousedown.bind(this, event), false);
    //     //         const down = e => {
    //     //             this.tmp_canvas.addEventListener('mousemove', this.onPaint.bind(this), false);

    //     //             this.mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
    //     //             this.mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;

    //     //             this.ppts.push({ x: this.mouse.x, y: this.mouse.y });

    //     //             this.onPaint();
    //     //         };
    //     //         this.tmp_canvas.addEventListener('mousedown', down.bind(this, event), false);
    //     //         // this.renderer.listen(tmp_canvas, 'mouseup',
    //     //         // this.tmp_canvasmouseup.bind(this, event, mouse, tmp_canvas, tmp_ctx, ppts, ctx));
    //     //         // this.tmp_canvas.addEventListener('mouseup',
    //     //         //     this.tmp_canvasmouseup.bind(this, event), false);
    //     //         const up = e => {
    //     //             this.tmp_canvas.removeEventListener('mousemove', this.onPaint.bind(this), false);

    //     //             // Writing down to real canvas now
    //     //             ctx.drawImage(this.tmp_canvas, 0, 0);
    //     //             // Clearing tmp canvas
    //     //             this.tmp_ctx.clearRect(0, 0, this.tmp_canvas.width, this.tmp_canvas.height);

    //     //             // Emptying up Pencil Points
    //     //             this.ppts = [];
    //     //         };
    //     //         this.tmp_canvas.addEventListener('mouseup', up.bind(this), false);
    //     //     }
    //     //     // tmp_canvas.style.zIndex = '4';
    //     // }

    //     // private tmp_canvasMouseMove(e) {
    //     //     this.mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
    //     //     this.mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;
    //     // }

    //     // private tmp_canvasmousedown(e) {
    //     //     // this.renderer.listen(tmp_canvas, 'mousemove', this.onPaint.bind(this, mouse, tmp_canvas, tmp_ctx, ppts));
    //     //     this.tmp_canvas.addEventListener('mousemove', this.onPaint.bind(this), false);

    //     //     this.mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
    //     //     this.mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;

    //     //     this.ppts.push({ x: this.mouse.x, y: this.mouse.y });

    //     //     this.onPaint();
    //     // }

    //     // private tmp_canvasmouseup() {
    //     //     // this.renderer.listen(tmp_canvas, 'mousemove', this.onPaint.bind(this, mouse, tmp_canvas, tmp_ctx, ppts));
    //     //     this.tmp_canvas.removeEventListener('mousemove', this.onPaint.bind(this), false);
    //     //     // Writing down to real canvas now
    //     //     const ctx: CanvasRenderingContext2D = this._baseCanvas.getContext('2d');
    //     //     ctx.drawImage(this.tmp_canvas, 0, 0);
    //     //     // Clearing tmp canvas
    //     //     this.tmp_ctx.clearRect(0, 0, this.tmp_canvas.width, this.tmp_canvas.height);
    //     //     // tmp_canvas.style.zIndex = '-1';

    //     //     // Emptying up Pencil Points
    //     //     this.ppts = [];
    //     // }


    //     // onPaint() {

    //     //     // Saving all the points in an array
    //     //     this.ppts.push({ x: this.mouse.x, y: this.mouse.y });

    //     //     if (this.ppts.length < 3) {
    //     //         const b = this.ppts[0];
    //     //         this.tmp_ctx.beginPath();
    //     //         // ctx.moveTo(b.x, b.y);
    //     //         // ctx.lineTo(b.x+50, b.y+50);
    //     //         this.tmp_ctx.arc(b.x, b.y, this.tmp_ctx.lineWidth / 2, 0, Math.PI * 2, !0);
    //     //         this.tmp_ctx.fill();
    //     //         this.tmp_ctx.closePath();

    //     //         return;
    //     //     }

    //     //     // Tmp canvas is always cleared up before drawing.
    //     //     this.tmp_ctx.clearRect(0, 0, this.tmp_canvas.width, this.tmp_canvas.height);

    //     //     this.tmp_ctx.beginPath();
    //     //     this.tmp_ctx.moveTo(this.ppts[0].x, this.ppts[0].y);
    //     //     let i = 0;
    //     //     for (i = 1; i < this.ppts.length - 2; i++) {
    //     //         const c = (this.ppts[i].x + this.ppts[i + 1].x) / 2;
    //     //         const d = (this.ppts[i].y + this.ppts[i + 1].y) / 2;

    //     //         this.tmp_ctx.quadraticCurveTo(this.ppts[i].x, this.ppts[i].y, c, d);
    //     //     }

    //     //     // For the last 2 points
    //     //     this.tmp_ctx.quadraticCurveTo(
    //     //         this.ppts[i].x,
    //     //         this.ppts[i].y,
    //     //         this.ppts[i + 1].x,
    //     //         this.ppts[i + 1].y
    //     //     );
    //     //     this.tmp_ctx.stroke();
    //     //     // this._setStyle(tmp_canvas, '0');

    //     // }

    //     private drawLine2() {

    //         let ctx: CanvasRenderingContext2D = this._baseCanvas.getContext('2d');

    //         // Creating a tmp canvas
    //         const tmp_canvas = this._baseCanvas;
    //         const self = this;
    //         // const savearr = this.saveLegendToArray;
    //         // tmp_canvas.id = 'tmp_canvas';
    //         // tmp_canvas.width = this._baseCanvas.width;
    //         // tmp_canvas.height = this._baseCanvas.height;

    //         // this.renderer.appendChild(this.element.nativeElement, tmp_canvas);
    //         // this._setStyle(tmp_canvas, '4');
    //         // this.renderer.setStyle(tmp_canvas, 'cursor', 'crosshair');
    //         const mouse = { x: 0, y: 0 };
    //         const last_mouse = { x: 0, y: 0 };

    //         // Pencil Points
    //         let ppts = [];

    //         /* Mouse Capturing Work */
    //         tmp_canvas.addEventListener('mousemove', function (e) {
    //             mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
    //             mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;
    //         }, false);


    //         /* Drawing on Paint App */
    //         ctx.lineWidth = this.activeLegend.shapeWidth[0];
    //         ctx.lineJoin = 'round';
    //         ctx.lineCap = 'round';
    //         ctx.strokeStyle = this.activeLegend.strokeColor;
    //         ctx.fillStyle = this.activeLegend.strokeColor;

    //         tmp_canvas.addEventListener('mousedown', function (e) {
    //             tmp_canvas.addEventListener('mousemove', onPaint.bind(self), false);

    //             mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
    //             mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;

    //             ppts.push({ x: mouse.x, y: mouse.y });

    //             onPaint.call(self);
    //         }, false);

    //         tmp_canvas.addEventListener('mouseup', function () {
    //             tmp_canvas.removeEventListener('mousemove', onPaint.bind(self), false);

    //             // Writing down to real canvas now
    //             // ctx.drawImage(tmp_canvas, 0, 0);
    //             // Clearing tmp canvas
    //             // ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);
    //             self.saveLegendToArray();
    //             // Emptying up Pencil Points
    //             ppts = [];
    //         }, false);

    //         const onPaint = function () {

    //             ctx = this._baseCanvas.getContext('2d');
    //             // Saving all the points in an array
    //             ppts.push({ x: mouse.x, y: mouse.y });

    //             if (ppts.length < 3) {
    //                 const b = ppts[0];
    //                 ctx.beginPath();
    //                 // ctx.moveTo(b.x, b.y);
    //                 // ctx.lineTo(b.x+50, b.y+50);
    //                 ctx.arc(b.x, b.y, ctx.lineWidth / 2, 0, Math.PI * 2, !0);
    //                 ctx.fill();
    //                 ctx.closePath();
    //                 this.activeLegend.shapeProp = {
    //                     x: ppts[0].x,
    //                     y: ppts[0].y,
    //                     points: ppts
    //                 };
    //                 return;
    //             }

    //             // Tmp canvas is always cleared up before drawing.
    //             // ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);

    //             ctx.beginPath();
    //             ctx.moveTo(ppts[0].x, ppts[0].y);
    //             let i = 1;
    //             for (i = 1; i < ppts.length - 2; i++) {
    //                 const c = (ppts[i].x + ppts[i + 1].x) / 2;
    //                 const d = (ppts[i].y + ppts[i + 1].y) / 2;

    //                 ctx.quadraticCurveTo(ppts[i].x, ppts[i].y, c, d);
    //             }

    //             // For the last 2 points
    //             ctx.quadraticCurveTo(
    //                 ppts[i].x,
    //                 ppts[i].y,
    //                 ppts[i + 1].x,
    //                 ppts[i + 1].y
    //             );
    //             ctx.stroke();
    //             ctx.closePath();
    //             this.activeLegend.shapeProp = {
    //                 x: ppts[0].x,
    //                 y: ppts[0].y,
    //                 points: ppts
    //             };

    //         };


    //     }

    //     private drawLine3() {

    //         const ctx: CanvasRenderingContext2D = this._baseCanvas.getContext('2d');
    //         const self = this;

    //         let tmp_canvas: HTMLCanvasElement = document.querySelector('#tmp_canvas');
    //         let tmp_ctx = tmp_canvas ? tmp_canvas.getContext('2d') : undefined;
    //         // Creating a tmp canvas
    //         if (!tmp_canvas) {
    //             tmp_canvas = document.createElement('canvas');
    //             tmp_ctx = tmp_canvas.getContext('2d');
    //             tmp_canvas.id = 'tmp_canvas';
    //             tmp_canvas.width = this._baseCanvas.width;
    //             tmp_canvas.height = this._baseCanvas.height;

    //             this._setStyle(tmp_canvas, '4');
    //             tmp_canvas.style.position = 'absolute';
    //             tmp_canvas.style.left = '0px';
    //             tmp_canvas.style.right = '0px';
    //             tmp_canvas.style.bottom = '0px';
    //             tmp_canvas.style.top = '0px';
    //             tmp_canvas.style.cursor = 'crosshair';

    //             this.renderer.appendChild(this.element.nativeElement, tmp_canvas);
    //         }
    //         const mouse = { x: 0, y: 0 };
    //         const last_mouse = { x: 0, y: 0 };

    //         // Pencil Points
    //         let ppts = [];

    //         /* Mouse Capturing Work */
    //         tmp_canvas.addEventListener('mousemove', function (e) {
    //             mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
    //             mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;
    //         }, false);


    //         /* Drawing on Paint App */
    //         tmp_ctx.lineWidth = 5;
    //         tmp_ctx.lineJoin = 'round';
    //         tmp_ctx.lineCap = 'round';
    //         tmp_ctx.strokeStyle = 'blue';
    //         tmp_ctx.fillStyle = 'blue';

    //         tmp_canvas.addEventListener('mousedown', function (e) {
    //             tmp_canvas.addEventListener('mousemove', onPaint.bind(self), false);

    //             mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
    //             mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;

    //             ppts.push({ x: mouse.x, y: mouse.y });

    //             onPaint.call(self);
    //         }, false);

    //         tmp_canvas.addEventListener('mouseup', function () {
    //             tmp_canvas.removeEventListener('mousemove', onPaint.bind(self), false);

    //             // Writing down to real canvas now
    //             ctx.drawImage(tmp_canvas, 0, 0);
    //             // Clearing tmp canvas
    //             tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);

    //             // Emptying up Pencil Points
    //             ppts = [];
    //         }, false);

    //         const onPaint = function () {

    //             // Saving all the points in an array
    //             ppts.push({ x: mouse.x, y: mouse.y });

    //             if (ppts.length < 3) {
    //                 const b = ppts[0];
    //                 tmp_ctx.beginPath();
    //                 // ctx.moveTo(b.x, b.y);
    //                 // ctx.lineTo(b.x+50, b.y+50);
    //                 tmp_ctx.arc(b.x, b.y, tmp_ctx.lineWidth / 2, 0, Math.PI * 2, !0);
    //                 tmp_ctx.fill();
    //                 tmp_ctx.closePath();

    //                 return;
    //             }

    //             // Tmp canvas is always cleared up before drawing.
    //             tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);

    //             tmp_ctx.beginPath();
    //             tmp_ctx.moveTo(ppts[0].x, ppts[0].y);
    //             let i = 1;
    //             for (i = 1; i < ppts.length - 2; i++) {
    //                 const c = (ppts[i].x + ppts[i + 1].x) / 2;
    //                 const d = (ppts[i].y + ppts[i + 1].y) / 2;

    //                 tmp_ctx.quadraticCurveTo(ppts[i].x, ppts[i].y, c, d);
    //             }

    //             // For the last 2 points
    //             tmp_ctx.quadraticCurveTo(
    //                 ppts[i].x,
    //                 ppts[i].y,
    //                 ppts[i + 1].x,
    //                 ppts[i + 1].y
    //             );
    //             tmp_ctx.stroke();

    //         };


    //     }


    private _stopPaint(): void {
        if (this._pencilSubscription) {
            this._pencilSubscription.unsubscribe();
        }
        if (this.isDrawing) {
            this._MousemoveListen();
            this.isDrawing = false;
            const points = this._pencil.points.filter(x => x);
            this.renderer.setStyle(this._baseCanvas, 'cursor', 'default');
            this._pencil.reset();
            if (points) {
                this.addShape(points, true, false);
            }
        }
    }

    private _onMouseleave(event: any): boolean {
        if (typeof (this._activeShapePos) === 'number') {
            this.shapes[this._activeShapePos].setActive(false);
            this.setActiveShapePos(null);
        }
        if (!this.isDrawing) {
            this._MousemoveListen();
            this.renderer.setStyle(this._baseCanvas, 'cursor', 'default');
        }
        return false;
    }

    private _onMousedown(event: any): boolean {
        event.preventDefault();
        if (event.which === 1) {
            const mousePos = this._getMousePos(event);
            if (!this.isDrawing) {
                if (this.shapes.length > 0) {
                    for (let p = this.shapes.length - 1; p >= 0; --p) {
                        if (this.shapes[p].context.isPointInPath(mousePos.x, mousePos.y)) {
                            if (p !== this._activeShapePos) {
                                if (typeof (this._activeShapePos) === 'number') {
                                    this.shapes[this._activeShapePos].setActive(false);
                                }
                                this.setActiveShapePos(p);
                                this.shapes[p].setActive();
                            }
                            break;
                        }
                    }
                    if (typeof (this._activeShapePos) === 'number' && this.shapes.length > this._activeShapePos) {
                        this.shapes[this._activeShapePos].onMousedown(event, mousePos);
                    }
                }
            } else {
                this.renderer.setStyle(this._baseCanvas, 'cursor', 'move');
            }
            if (this.isAddingLegend && this.activeLegend) {
                this.addLegend([[mousePos.x, mousePos.y]]);
            }
        }

        // else if (event.which === 3) {
        // this.renderer.setStyle(this._baseCanvas , 'cursor', 'not-allowed');
        // }
        return false;
    }

    private _onMouseup(event: any): boolean {
        if (event.which === 1 || event.which === 3) {
            const mousePos = this._getMousePos(event);
            if (this.isDrawing) {
                this.renderer.setStyle(this._baseCanvas, 'cursor', 'copy');
                this._pencil.onMouseup(event, mousePos);
            } else {
                this.renderer.setStyle(this._baseCanvas, 'cursor', 'default');
                this._MousemoveListen();
                if (typeof (this._activeShapePos) === 'number' && this.shapes.length > this._activeShapePos) {
                    const action = this.shapes[this._activeShapePos].onMouseup(event, mousePos);
                    if (action === 'delete shape') {
                        this.renderer.removeChild(this.element.nativeElement, this.shapes[this._activeShapePos].canvas);
                        this.shapes.splice(this._activeShapePos, 1);
                        this._deleteShapeSubscription(this._activeShapePos);
                        this.removeShapeEvent.emit(this._activeShapePos);

                        if (this.shapes.length > 0) {
                            this.setActiveShapePos(this.shapes.length - 1);
                            this.shapes[this._activeShapePos].setActive();
                        } else {
                            this.setActiveShapePos(null);
                        }
                    } else {
                        this.activeShapeChangeEvent.emit(this._activeShapePos);
                    }
                }
            }
        }
        return false;
    }

    private _onContextmenu(event: any): boolean {
        event.preventDefault();
        return false;
    }

    private _onMoveShape(event: any): boolean {
        if (typeof (this._activeShapePos) === 'number') {
            const mousePos = this._getMousePos(event);
            if (this.eventWhileMoving) {
                this.activeShapeChangeEvent.emit(this._activeShapePos);
            }
            this.renderer.setStyle(this._baseCanvas, 'cursor', 'move');
            this.shapes[this._activeShapePos].onMoveShape(event, mousePos);
        }
        return false;
    }

    private _onMovePoint(event: any): boolean {
       
        const mousePos = this._getMousePos(event);
        if (this.isDrawing) {
            this._pencil.onMovePoint(event, mousePos);
        } else if (typeof (this._activeShapePos) === 'number') {
            if (this.eventWhileMoving) {
                this.activeShapeChangeEvent.emit(this._activeShapePos);
            }
            this.renderer.setStyle(this._baseCanvas, 'cursor', 'move');
            this.shapes[this._activeShapePos].onMovePoint(event, mousePos);
        }
        return false;
    }

    private _getMousePos(event): any {
       
        const rect = this._baseCanvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    }

    private _setStyle(element: any, zIndex: string): void {
        this.renderer.setStyle(element, 'position', 'absolute');
        this.renderer.setStyle(element, 'top', '0');
        this.renderer.setStyle(element, 'left', '0');
        this.renderer.setStyle(element, 'z-index', zIndex);
        if (this.height && this.width) {
            this.renderer.setAttribute(element, 'height', this.height);
            this.renderer.setAttribute(element, 'width', this.width);
        } else {
            this.renderer.setStyle(element, 'height', 'auto');
            this.renderer.setStyle(element, 'width', '100%');
        }
    }

    private _deleteAllShapesSubscriptions(): void {
        for (const subscriptions of this._shapesSubscription) {
            for (const subscription of subscriptions) {
                subscription.unsubscribe();
            }
        }
        this._shapesSubscription = [];
    }

    private _deleteShapeSubscription(pos: number): void {
        for (const subscription of this._shapesSubscription[pos]) {
            subscription.unsubscribe();
        }
        this._shapesSubscription.splice(pos, 1);
    }

    private _MousedownListen(): void {
    }

    private _MouseupListen(): void {
    }

    private _MouseLeaveListen(): void {
    }

    private _MousemoveListen(): void {
    }

    private _ContextmenuListen(): void {
    }

    private _ImageLoadListen(): void {
    }

    private _ImageErrorListen(): void {
    }
}
