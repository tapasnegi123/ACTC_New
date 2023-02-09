import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartDSectionOneComponent } from './part-d-section-one.component';

describe('PartDSectionOneComponent', () => {
  let component: PartDSectionOneComponent;
  let fixture: ComponentFixture<PartDSectionOneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartDSectionOneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartDSectionOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
