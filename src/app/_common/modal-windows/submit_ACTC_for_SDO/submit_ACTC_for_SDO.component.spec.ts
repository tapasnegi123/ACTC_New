/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Submit_ACTC_for_SDOComponent } from './submit_ACTC_for_SDO.component';

describe('Submit_ACTC_for_SDOComponent', () => {
  let component: Submit_ACTC_for_SDOComponent;
  let fixture: ComponentFixture<Submit_ACTC_for_SDOComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Submit_ACTC_for_SDOComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Submit_ACTC_for_SDOComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
