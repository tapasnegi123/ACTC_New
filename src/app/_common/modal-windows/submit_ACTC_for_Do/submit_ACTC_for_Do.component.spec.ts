/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Submit_ACTC_for_DoComponent } from './submit_ACTC_for_Do.component';

describe('Submit_ACTC_for_DoComponent', () => {
  let component: Submit_ACTC_for_DoComponent;
  let fixture: ComponentFixture<Submit_ACTC_for_DoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Submit_ACTC_for_DoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Submit_ACTC_for_DoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
