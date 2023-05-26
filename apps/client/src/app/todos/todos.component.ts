import { Component, OnInit } from '@angular/core';
import {
  first,
  map,
  merge,
  Observable,
  of,
  skip,
  Subject,
  withLatestFrom
} from 'rxjs';
import { Todo } from './models';
import { TodoService } from './todo.service';

@Component({
  selector: 'dos-todos',
  templateUrl: './todos.component.html'
})
export class TodosComponent implements OnInit {
  update$$ = new Subject();
  todosSource$ = this.todosService.loadFrequently();
  todosInitial$: Observable<Todo[]> = this.todosSource$.pipe(first());
  todosMostRecent$: Observable<Todo[]> = this.update$$.pipe(
    withLatestFrom(this.todosSource$),
    map((data) => data[1])
  );
  todos$: Observable<Todo[]>;

  show$: Observable<boolean> = this.todosSource$.pipe(
    skip(1),
    map(() => true)
  );
  hide$: Observable<boolean> = this.update$$.pipe(map(() => false));
  showReload$: Observable<boolean> = merge(this.show$, this.hide$);

  constructor(private todosService: TodoService) {}

  ngOnInit(): void {
    // TODO: Control update of todos in App (back pressure)
    this.todos$ = merge(this.todosInitial$, this.todosMostRecent$);

    // TODO: Control display of refresh button
  }

  completeOrIncompleteTodo(todoForUpdate: Todo) {
    /*
     * Note in order to keep the code clean for the workshop we did not
     * handle the following subscription.
     * Normally you want to unsubscribe.
     *
     * We just want to focus you on RxJS.
     */
    this.todosService.completeOrIncomplete(todoForUpdate).subscribe();
  }
}
