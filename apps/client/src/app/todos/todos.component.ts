import { Component, OnInit } from '@angular/core';
import { merge, Observable, of, Subject } from 'rxjs';
import { first, map, mapTo, skip, tap, withLatestFrom } from 'rxjs/operators';
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
  show$: Observable<boolean> = this.todosSource$.pipe(skip(1), mapTo(true));
  hide$: Observable<boolean> = this.update$$.pipe(mapTo(false));
  showReload$: Observable<boolean> = merge(this.show$, this.hide$);

  constructor(private todosService: TodoService) {}

  ngOnInit(): void {
    // TODO: Control update of todos in App (back pressure)
    this.todosInitial$ = this.todosSource$.pipe(first());

    this.todosMostRecent$ = this.update$$.pipe(
      withLatestFrom(this.todosSource$.pipe(skip(1))),
      map((data) => data[1])
    );
    this.todos$ = merge(this.todosInitial$, this.todosMostRecent$); // this.todosSource$;

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
