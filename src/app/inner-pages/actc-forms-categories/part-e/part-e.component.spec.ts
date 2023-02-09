import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartEComponent } from './part-e.component';

describe('PartEComponent', () => {
  let component: PartEComponent;
  let fixture: ComponentFixture<PartEComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartEComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
