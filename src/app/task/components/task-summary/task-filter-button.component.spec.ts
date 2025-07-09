import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskFilterButtonComponent } from './task-filter-button.component';

describe('TaskFilterButtonComponent', () => {
  let component: TaskFilterButtonComponent;
  let fixture: ComponentFixture<TaskFilterButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskFilterButtonComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TaskFilterButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
