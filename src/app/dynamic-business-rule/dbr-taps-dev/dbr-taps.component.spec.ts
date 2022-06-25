import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DbrTapsComponent } from './dbr-taps.component';

describe('DbrTapsComponent', () => {
  let component: DbrTapsComponent;
  let fixture: ComponentFixture<DbrTapsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DbrTapsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DbrTapsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
