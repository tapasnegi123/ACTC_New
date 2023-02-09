import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActcFormsPartBSummaryComponent } from './actc-forms-part-b-summary.component';

describe('ActcFormsPartBSummaryComponent', () => {
  let component: ActcFormsPartBSummaryComponent;
  let fixture: ComponentFixture<ActcFormsPartBSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActcFormsPartBSummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActcFormsPartBSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
