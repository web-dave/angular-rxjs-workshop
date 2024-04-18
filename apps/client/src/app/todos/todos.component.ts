import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  filter,
  map,
  merge,
  Observable,
  of,
  skip,
  Subject,
  take,
  takeUntil,
  withLatestFrom
} from 'rxjs';
import { Todo } from './models';
import { TodoService } from './todo.service';

@Component({
  selector: 'dos-todos',
  templateUrl: './todos.component.html'
})
export class TodosComponent implements OnInit, OnDestroy {
  todos$: Observable<Todo[]>;
  todosSource$ = this.todosService.loadFrequently();

  todosInitial$: Observable<Todo[]> = this.todosSource$.pipe(
    filter((todos) => todos.length >= 1),
    take(1)
  );

  todosNotFirst$: Observable<Todo[]> = this.todosSource$.pipe(
    filter((todos) => todos.length >= 1),
    skip(1)
  );
  update$$ = new Subject();

  todosMostRecent$: Observable<Todo[]> = this.update$$.pipe(
    withLatestFrom(this.todosNotFirst$),
    map((data: [void, Todo[]]) => data[1])
    // map(([,todos]) => todos)
  );

  kill$$ = new Subject<boolean>();

  show$: Observable<boolean> = this.todosNotFirst$.pipe(map(() => true));
  hide$: Observable<boolean> = this.update$$.pipe(map(() => false));
  showReload$: Observable<boolean> = merge(this.show$, this.hide$);

  constructor(private todosService: TodoService) {}
  ngOnDestroy(): void {
    this.kill$$.next(true);
  }

  ngOnInit(): void {
    // TODO: Control update of todos in App (back pressure)
    this.todos$ = merge(this.todosInitial$, this.todosMostRecent$);
    // this.todos$ = this.todosSource$;
    this.update$$.pipe(takeUntil(this.kill$$)).subscribe();
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
