import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePasswordModalWindowComponent } from './change-password-modal-window.component';

describe('ChangePasswordModalWindowComponent', () => {
  let component: ChangePasswordModalWindowComponent;
  let fixture: ComponentFixture<ChangePasswordModalWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangePasswordModalWindowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangePasswordModalWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
