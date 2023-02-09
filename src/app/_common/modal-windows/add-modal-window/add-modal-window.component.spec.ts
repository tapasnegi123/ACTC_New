import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddModalWindowComponent } from './add-modal-window.component';

describe('AddModalWindowComponent', () => {
  let component: AddModalWindowComponent;
  let fixture: ComponentFixture<AddModalWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddModalWindowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddModalWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
