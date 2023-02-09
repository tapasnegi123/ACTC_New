/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MapEventTournamnetComponent } from './map-event-tournamnet.component';

describe('MapEventTournamnetComponent', () => {
  let component: MapEventTournamnetComponent;
  let fixture: ComponentFixture<MapEventTournamnetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapEventTournamnetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapEventTournamnetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
