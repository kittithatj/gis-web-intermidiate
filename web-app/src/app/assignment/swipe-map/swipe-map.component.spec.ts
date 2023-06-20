import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwipeMapComponent } from './swipe-map.component';

describe('SwipeMapComponent', () => {
  let component: SwipeMapComponent;
  let fixture: ComponentFixture<SwipeMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SwipeMapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SwipeMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
