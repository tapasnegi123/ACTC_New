import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActcFormsPartBSectionFourComponent } from './actc-forms-part-b-section-four.component';

describe('ActcFormsPartBSectionFourComponent', () => {
  let component: ActcFormsPartBSectionFourComponent;
  let fixture: ComponentFixture<ActcFormsPartBSectionFourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActcFormsPartBSectionFourComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActcFormsPartBSectionFourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
