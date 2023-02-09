import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartDSectionTwoComponent } from './part-d-section-two.component';

describe('PartDSectionTwoComponent', () => {
  let component: PartDSectionTwoComponent;
  let fixture: ComponentFixture<PartDSectionTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartDSectionTwoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartDSectionTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
