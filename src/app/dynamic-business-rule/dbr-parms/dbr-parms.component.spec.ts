import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DbrParmsComponent } from './dbr-parms.component';

describe('DbrParmsComponent', () => {
  let component: DbrParmsComponent;
  let fixture: ComponentFixture<DbrParmsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DbrParmsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DbrParmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
