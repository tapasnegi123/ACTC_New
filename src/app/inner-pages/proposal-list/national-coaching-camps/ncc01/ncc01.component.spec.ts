import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ncc01Component } from './ncc01.component';

describe('Ncc01Component', () => {
  let component: Ncc01Component;
  let fixture: ComponentFixture<Ncc01Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Ncc01Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Ncc01Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
