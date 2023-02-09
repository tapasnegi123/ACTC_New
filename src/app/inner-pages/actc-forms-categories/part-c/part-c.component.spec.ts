import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartCComponent } from './part-c.component';

describe('PartCComponent', () => {
  let component: PartCComponent;
  let fixture: ComponentFixture<PartCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartCComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
