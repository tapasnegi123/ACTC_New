import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartDComponent } from './part-d.component';

describe('PartDComponent', () => {
  let component: PartDComponent;
  let fixture: ComponentFixture<PartDComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartDComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
