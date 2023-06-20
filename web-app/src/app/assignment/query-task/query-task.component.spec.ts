import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryTaskComponent } from './query-task.component';

describe('QueryTaskComponent', () => {
  let component: QueryTaskComponent;
  let fixture: ComponentFixture<QueryTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QueryTaskComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QueryTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
