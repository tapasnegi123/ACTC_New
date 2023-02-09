/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ActcFormsPartBSectionTwoComponent } from './actc-forms-part-B-section-two.component';

describe('ActcFormsPartBSectionTwoComponent', () => {
  let component: ActcFormsPartBSectionTwoComponent;
  let fixture: ComponentFixture<ActcFormsPartBSectionTwoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActcFormsPartBSectionTwoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActcFormsPartBSectionTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
