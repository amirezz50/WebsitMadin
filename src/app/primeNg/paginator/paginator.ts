import { NgModule, Component, ElementRef, Input, Output, SimpleChange, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'p-paginator',
    template: `
<div class="text-sm-center p-2">
    <a href="#"
       #firstlink
       class="paginator_btn"
       (mouseenter)="hoveredItem = $event.target"
       (mouseleave)="hoveredItem = null"
       (click)="changePageToFirst($event)"
       [ngClass]="{'ui-state-disabled':isFirstPage(),'ui-state-hover':(firstlink === hoveredItem && !isFirstPage())}"
       [tabindex]="isFirstPage() ? -1 : null">
        <span class="fa fa-step-{{lang == 'ar' ? 'for' : 'back'}}ward"></span>
    </a>
    <a href="#"
       #prevlink
       class="paginator_btn"
       (mouseenter)="hoveredItem = $event.target"
       (mouseleave)="hoveredItem = null"
       (click)="changePageToPrev($event)"
       [ngClass]="{'ui-state-disabled':isFirstPage(),'ui-state-hover':(prevlink === hoveredItem && !isFirstPage())}"
       [tabindex]="isFirstPage() ? -1 : null">
        <span class="fa fa-{{lang == 'ar' ? 'for' : 'back'}}ward"></span>
    </a>
    <span class="ui-paginator-pages">
        <button href="#"
           #plink
           *ngFor="let pageLink of pageLinks"
           class="paginator_btn"
           (mouseenter)="hoveredItem = $event.target"
           (mouseleave)="hoveredItem = null"
           (click)="changePage(pageLink - 1, $event)"
           [ngClass]="{'btn-warning':(plink === hoveredItem), 'btn-info': (pageLink-1 == getPage())}">{{pageLink}}</button>
    </span>
    <a href="#"
       #nextlink
       class="paginator_btn"
       (mouseenter)="hoveredItem = $event.target"
       (mouseleave)="hoveredItem = null"
       (click)="changePageToNext($event)"
       [ngClass]="{'ui-state-disabled':isLastPage(),'ui-state-hover':(nextlink === hoveredItem  && !isLastPage())}"
       [tabindex]="isLastPage() ? -1 : null">
        <span class="fa fa-{{lang == 'ar' ? 'back' : 'for'}}ward"></span>
    </a>
    <a href="#" #lastlink
       class="paginator_btn"
       (mouseenter)="hoveredItem = $event.target"
       (mouseleave)="hoveredItem = null"
       (click)="changePageToLast($event)"
       [ngClass]="{'ui-state-disabled':isLastPage(),'ui-state-hover':(lastlink === hoveredItem  && !isLastPage())}"
       [tabindex]="isLastPage() ? -1 : null">
        <span class="fa fa-step-{{lang == 'ar' ? 'back' : 'for'}}ward"></span>
    </a>
    <select class="ui-paginator-rpp-options ui-widget ui-state-default" *ngIf="rowsPerPageOptions" (change)="onRppChange($event)">
        <option *ngFor="let opt of rowsPerPageOptions" [value]="opt" [selected]="rows == opt">{{opt}}</option>
    </select>
</div>

    `,
    styleUrls: ["./paginator.css"]
})
export class Paginator {

    @Input() pageLinkSize: number = 5;

    @Input() lang: string = 'ar';

    @Output() onPageChange: EventEmitter<any> = new EventEmitter();

    @Input() style: any;

    @Input() styleClass: string;

    @Input() rowsPerPageOptions: number[];

    public pageLinks: number[];

    public _totalRecords: number = 0;

    public _first: number = 0;

    public _rows: number = 0;
    hoveredItem;
    @Input() get totalRecords(): number {
        return this._totalRecords;
    }

    set totalRecords(val: number) {
        this._totalRecords = val;
        this.updatePageLinks();
    }

    @Input() get first(): number {
        return this._first;
    }

    set first(val: number) {
        this._first = val;
        this.updatePageLinks();
    }

    @Input() get rows(): number {
        return this._rows;
    }

    set rows(val: number) {
        this._rows = val;
        this.updatePageLinks();
    }

    isFirstPage() {
        return this.getPage() === 0;
    }

    isLastPage() {
        return this.getPage() === this.getPageCount() - 1;
    }

    getPageCount() {
        return Math.ceil(this.totalRecords / this.rows) || 1;
    }

    calculatePageLinkBoundaries() {
        let numberOfPages = this.getPageCount(),
            visiblePages = Math.min(this.pageLinkSize, numberOfPages);

        //calculate range, keep current in middle if necessary
        let start = Math.max(0, Math.ceil(this.getPage() - ((visiblePages) / 2))),
            end = Math.min(numberOfPages - 1, start + visiblePages - 1);

        //check when approaching to last page
        var delta = this.pageLinkSize - (end - start + 1);
        start = Math.max(0, start - delta);

        return [start, end];
    }

    updatePageLinks() {
        this.pageLinks = [];
        let boundaries = this.calculatePageLinkBoundaries(),
            start = boundaries[0],
            end = boundaries[1];

        for (let i = start; i <= end; i++) {
            this.pageLinks.push(i + 1);
        }
    }

    changePage(p: number, event) {
        var pc = this.getPageCount();

        if (p >= 0 && p < pc) {
            this.first = this.rows * p;
            var state = {
                page: p,
                first: this.first,
                rows: this.rows,
                pageCount: pc
            };
            this.updatePageLinks();

            this.onPageChange.emit(state);
        }

        if (event) {
            event.preventDefault();
        }
    }

    getPage(): number {
        return Math.floor(this.first / this.rows);
    }

    changePageToFirst(event) {
        this.changePage(0, event);
    }

    changePageToPrev(event) {
        this.changePage(this.getPage() - 1, event);
    }

    changePageToNext(event) {
        this.changePage(this.getPage() + 1, event);
    }

    changePageToLast(event) {
        this.changePage(this.getPageCount() - 1, event);
    }

    onRppChange(event) {
        this.rows = this.rowsPerPageOptions[event.target.selectedIndex];
        this.changePageToFirst(event);
    }
}

@NgModule({
    imports: [CommonModule],
    exports: [Paginator],
    declarations: [Paginator]
})
export class PaginatorModule { }
