import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DbrTapsUserComponent } from './dbr-taps-user.component';

describe('DbrTapsUserComponent', () => {
  let component: DbrTapsUserComponent;
  let fixture: ComponentFixture<DbrTapsUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DbrTapsUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DbrTapsUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
