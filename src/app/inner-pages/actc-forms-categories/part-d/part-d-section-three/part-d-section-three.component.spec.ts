import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartDSectionThreeComponent } from './part-d-section-three.component';

describe('PartDSectionThreeComponent', () => {
  let component: PartDSectionThreeComponent;
  let fixture: ComponentFixture<PartDSectionThreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartDSectionThreeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartDSectionThreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
