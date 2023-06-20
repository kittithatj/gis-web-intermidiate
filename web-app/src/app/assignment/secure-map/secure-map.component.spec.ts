import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecureMapComponent } from './secure-map.component';

describe('SecureMapComponent', () => {
  let component: SecureMapComponent;
  let fixture: ComponentFixture<SecureMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecureMapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecureMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
