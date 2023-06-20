import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SketchMapComponent } from './sketch-map.component';

describe('SketchMapComponent', () => {
  let component: SketchMapComponent;
  let fixture: ComponentFixture<SketchMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SketchMapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SketchMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
