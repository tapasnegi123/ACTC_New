import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartCSummaryComponent } from './part-c-summary.component';

describe('PartCSummaryComponent', () => {
  let component: PartCSummaryComponent;
  let fixture: ComponentFixture<PartCSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartCSummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartCSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
