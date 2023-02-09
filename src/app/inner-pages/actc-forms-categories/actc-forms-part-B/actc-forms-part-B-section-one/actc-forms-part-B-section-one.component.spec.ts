/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ActcFormsPartBSectionOneComponent } from './actc-forms-part-B-section-one.component';

describe('ActcFormsPartBSectionOneComponent', () => {
  let component: ActcFormsPartBSectionOneComponent;
  let fixture: ComponentFixture<ActcFormsPartBSectionOneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActcFormsPartBSectionOneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActcFormsPartBSectionOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
