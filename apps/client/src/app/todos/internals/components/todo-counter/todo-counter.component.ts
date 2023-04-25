import { Component, DoCheck, Input } from '@angular/core';

@Component({
  selector: 'dos-todo-counter',
  templateUrl: './todo-counter.component.html',
  styleUrls: ['./todo-counter.component.scss']
})
export class TodoCounterComponent implements DoCheck {
  ngDoCheck(): void {
    console.log('DoCheck TodoCounterComponent');
  }
  @Input() count: number;
}
