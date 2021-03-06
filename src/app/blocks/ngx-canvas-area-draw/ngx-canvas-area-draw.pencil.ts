import {ElementRef, EventEmitter, Renderer2} from "@angular/core";

export class Pencil {
    canvas: any;
    context: any;
    points: Array<Array<number>>;
    completed: EventEmitter<any> = new EventEmitter();

    private _activePointPos: number;
    private _complete: boolean;

    constructor(private renderer: Renderer2,
                private parent: ElementRef,
                public strokeColor: string,
                public handleFillColor: string,
                public handleStrokeColor: string) {
        this.points = [];
        this._activePointPos = 0;
        this._complete = false;

        this.canvas = this.renderer.createElement('canvas');
        this.context = this.canvas.getContext('2d');
        this.renderer.setStyle(this.canvas, 'display', 'none');
        this.renderer.appendChild(this.parent.nativeElement, this.canvas);
    }

    reset(): void {
        this.points = [];
        this._activePointPos = 0;
        this._complete = false;
        this.renderer.setStyle(this.canvas, 'display', 'none');
        this.context.canvas.width = this.context.canvas.width;
    }

    onMouseup(event: any, mousePos: any): void {
        if (!this._complete) {
            if (event.which === 1) {
                let dis,
                    minDis = 0,
                    minDisIndex = -1;

                for (let i = 0; i < this.points.length - 1; ++i) {
                    if (this.points[i]) {
                        dis = Math.sqrt(
                            Math.pow(mousePos.x - this.points[i][0], 2) + Math.pow(mousePos.y - this.points[i][1], 2)
                        );
                        if (minDisIndex === -1 || minDis > dis) {
                            minDis = dis;
                            minDisIndex = i;
                        }
                    }
                }

                if (minDis < 6 && minDisIndex === 0 && this.points.length > 3) {
                    // close shape
                    this.points.splice(this.points.length - 1, 1);
                    this._activePointPos -= 1;
                    this._complete = true;
                } else if (minDis >= 6 || this.points.length === 1) {
                    // add new point
                    this._activePointPos += 1;
                }
            } else {
                // remove last point
                this.points.splice(this.points.length - 2, 1);
                this._activePointPos -= 1;

                if (this._activePointPos === -1) {
                    this.completed.emit();
                }
            }
            this._draw();
        }
    }

    onMovePoint(event: any, mousePos: any): void {
        if (!this._complete && typeof (this._activePointPos) === 'number') {
            this.points[this._activePointPos] = [mousePos.x, mousePos.y];
            this._draw();
        }
    }

    onCompleted(): any {
        return this.completed;
    }

    setColors(strokeColor: string, handleFillColor: string, handleStrokeColor: string): void {
        if (strokeColor) {
            this.strokeColor = strokeColor;
        }
        if (handleFillColor) {
            this.handleFillColor = handleFillColor;
        }
        if (handleStrokeColor) {
            this.handleStrokeColor = handleStrokeColor;
        }
        this._draw();
    }

    private _draw(): void {
        this.context.canvas.width = this.context.canvas.width;

        this.context.globalCompositeOperation = 'destination-over';
        this.context.lineWidth = 1;

        this.context.beginPath();
        for (let i = 0; i < this.points.length; ++i) {
            if (this.points[i]) {
                this.context.fillStyle = this.handleFillColor;
                this.context.strokeStyle = this.handleStrokeColor;
                this.context.fillRect(this.points[i][0] - 3, this.points[i][1] - 3, 6, 6);
                this.context.strokeRect(this.points[i][0] - 3, this.points[i][1] - 3, 6, 6);

                this.context.strokeStyle = this.strokeColor;
                this.context.lineTo(this.points[i][0], this.points[i][1]);
            }
        }
        if (this._complete) {
            this.context.closePath();
            this.completed.emit();
        }
        this.context.stroke();
    }
}
