import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DbrOutputsComponent } from './dbr-outputs.component';

describe('DbrOutputsComponent', () => {
  let component: DbrOutputsComponent;
  let fixture: ComponentFixture<DbrOutputsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DbrOutputsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DbrOutputsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
