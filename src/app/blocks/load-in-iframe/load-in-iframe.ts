
//our root app component
import { ViewContainerRef, ComponentFactoryResolver, ElementRef, Injectable, NgModule, ComponentRef, ViewChild, Component} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'
import{ CommonModule} from '@angular/common'

@Injectable()
export class Service {
  constructor() {
  }

  getData() {
    return  [
        {
          "name": "Name 1",
          "value": "Value 1"
        },
        {
          "name": "Name 2",
          "value": "Value 2"
        },
        {
          "name": "Name 2",
          "value": "Value 2"
        }
      ];
  }
}

@Component({
  selector: 'dynamic-comp',
  template: `
    <h2>Dynamic component</h2>
    <button (click)="counter = counter + 1">+</button> {{ counter }}
    
    <table>
      <tr *ngFor="let item of data | async">
        <td>{{ item.name }}</td>
        <td>{{ item.value }}</td>
      </tr>
    </table>
  `
})
export class DynamicComponent {
  counter = 1;

  data: any[];

  constructor(private service: Service) {}

  ngOnInit() {
    this.data = this.service.getData();
  }
}

@Component({
  selector: 'iframe-test',
  template: `
    <button (click)="createComponent()">Create component</button>
    <iframe #iframe (load)="onLoad()"></iframe>

  `,
})
export class MYTEST {
  @ViewChild('iframe', {static: false}) iframe: ElementRef;

  doc: any;
  compRef: ComponentRef<DynamicComponent>;

  constructor(
    private vcRef: ViewContainerRef,
    private resolver: ComponentFactoryResolver) {}


  createComponent() {
    const compFactory = this.resolver.resolveComponentFactory(DynamicComponent);
    this.compRef = this.vcRef.createComponent(compFactory);

    this.doc.body.appendChild(this.compRef.location.nativeElement);
  }

  onLoad() {
    this.doc = this.iframe.nativeElement.contentDocument || this.iframe.nativeElement.contentWindow;
  }

  ngAfterViewInit() {
    this.onLoad();
  }

  ngOnDestroy() {
    if(this.compRef) {
      this.compRef.destroy();
    }
  }
}



@NgModule({
    imports: [ CommonModule ],
    declarations: [ MYTEST , DynamicComponent ],
    exports:[MYTEST],
    entryComponents: [ DynamicComponent],
    providers: [Service]
  })
  export class LoadInIframeModule {}
  
