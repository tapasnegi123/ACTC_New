import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ncc02Component } from './ncc02.component';

describe('Ncc02Component', () => {
  let component: Ncc02Component;
  let fixture: ComponentFixture<Ncc02Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Ncc02Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Ncc02Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
