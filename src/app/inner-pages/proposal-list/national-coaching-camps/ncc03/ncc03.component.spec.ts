import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ncc03Component } from './ncc03.component';

describe('Ncc03Component', () => {
  let component: Ncc03Component;
  let fixture: ComponentFixture<Ncc03Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Ncc03Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Ncc03Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
