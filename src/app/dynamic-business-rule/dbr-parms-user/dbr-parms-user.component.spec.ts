import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DbrParmsUserComponent } from './dbr-parms-user.component';

describe('DbrParmsUserComponent', () => {
  let component: DbrParmsUserComponent;
  let fixture: ComponentFixture<DbrParmsUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DbrParmsUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DbrParmsUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
