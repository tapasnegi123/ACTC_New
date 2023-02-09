/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ActcFormsPartBSectionThreeComponent } from './actc-forms-part-B-section-three.component';

describe('ActcFormsPartBSectionThreeComponent', () => {
  let component: ActcFormsPartBSectionThreeComponent;
  let fixture: ComponentFixture<ActcFormsPartBSectionThreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActcFormsPartBSectionThreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActcFormsPartBSectionThreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
