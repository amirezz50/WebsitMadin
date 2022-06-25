import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DbrSetupUserComponent } from './dbr-setup-user.component';

describe('DbrSetupUserComponent', () => {
  let component: DbrSetupUserComponent;
  let fixture: ComponentFixture<DbrSetupUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DbrSetupUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DbrSetupUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
