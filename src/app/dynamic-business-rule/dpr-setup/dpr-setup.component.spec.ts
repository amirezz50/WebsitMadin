import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DprSetupComponent } from './dpr-setup.component';

describe('DprSetupComponent', () => {
  let component: DprSetupComponent;
  let fixture: ComponentFixture<DprSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DprSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DprSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
