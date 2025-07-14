import { NgClass } from '@angular/common';
import { Component, input, output, Signal } from '@angular/core';
import { Filter } from '../../models/task.model';

@Component({
  selector: 'app-task-filter-button',
  imports: [NgClass],
  templateUrl: './task-filter-button.component.html',
})
export class TaskFilterButtonComponent {
  activeFilter = input.required<Filter>()
  filterChange = output<Filter>()

  Filter = Filter
}
