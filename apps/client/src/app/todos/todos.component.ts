import { Component, OnInit } from '@angular/core';
import {
  first,
  map,
  merge,
  Observable,
  of,
  Subject,
  tap,
  withLatestFrom
} from 'rxjs';
import { Todo } from './models';
import { TodoService } from './todo.service';

@Component({
  selector: 'dos-todos',
  templateUrl: './todos.component.html'
})
export class TodosComponent implements OnInit {
  todos$: Observable<Todo[]>;
  todosSource$ = this.todosService.loadFrequently();
  todosInitial$: Observable<Todo[]>;
  todosMostRecent$: Observable<Todo[]>;

  update$$ = new Subject<void>();
  show$: Observable<boolean>;
  hide$: Observable<boolean>;
  showReload$: Observable<boolean> = of(true);

  constructor(private todosService: TodoService) {}

  ngOnInit(): void {
    this.todosInitial$ = this.todosSource$.pipe(
      first(),
      tap(() => console.log('First'))
    );
    this.todosMostRecent$ = this.update$$.pipe(
      withLatestFrom(this.todosSource$),
      tap((data) => console.log('Reload', data)),
      map(([, todos]) => todos)
    );

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
