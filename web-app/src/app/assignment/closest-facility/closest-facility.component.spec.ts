import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClosestFacilityComponent } from './closest-facility.component';

describe('ClosestFacilityComponent', () => {
  let component: ClosestFacilityComponent;
  let fixture: ComponentFixture<ClosestFacilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClosestFacilityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClosestFacilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
