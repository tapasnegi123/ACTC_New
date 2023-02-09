/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EnableACTCSubmissionForNSFComponent } from './enable-ACTC-submission-for-NSF.component';

describe('EnableACTCSubmissionForNSFComponent', () => {
  let component: EnableACTCSubmissionForNSFComponent;
  let fixture: ComponentFixture<EnableACTCSubmissionForNSFComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnableACTCSubmissionForNSFComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnableACTCSubmissionForNSFComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
