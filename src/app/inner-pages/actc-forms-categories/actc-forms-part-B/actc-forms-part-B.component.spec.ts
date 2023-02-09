/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ActcFormsPartBComponent } from './actc-forms-part-B.component';

describe('ActcFormsPartBComponent', () => {
  let component: ActcFormsPartBComponent;
  let fixture: ComponentFixture<ActcFormsPartBComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActcFormsPartBComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActcFormsPartBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
