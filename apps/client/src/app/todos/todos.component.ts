import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  first,
  map,
  merge,
  Observable,
  of,
  skip,
  skipUntil,
  startWith,
  Subject,
  takeUntil,
  withLatestFrom
} from 'rxjs';
import { Todo } from './models';
import { TodoService } from './todo.service';
import { kill } from 'process';

@Component({
  selector: 'dos-todos',
  templateUrl: './todos.component.html'
})
export class TodosComponent implements OnInit, OnDestroy {
  kill$ = new Subject();
  update$$ = new Subject();

  todosSource$ = this.todosService.loadFrequently();
  todosInitial$: Observable<Todo[]> = this.todosSource$.pipe(first());
  todosMostRecent$: Observable<Todo[]> = this.update$$.pipe(
    withLatestFrom(this.todosSource$),
    map((data) => data[1])
  );
  todos$: Observable<Todo[]> = merge(this.todosInitial$, this.todosMostRecent$);

  show$: Observable<true> = this.todosSource$.pipe(
    skip(1),
    map(() => true)
  );
  hide$: Observable<false> = this.update$$.pipe(
    startWith(false),
    map(() => false)
  );
  showReload$: Observable<boolean> = merge(this.show$, this.hide$);

  foo = false;

  constructor(private todosService: TodoService) {
    setTimeout(() => {
      this.foo = true;
    }, 6000);
  }
  ngOnDestroy(): void {
    this.kill$.next(1);
  }

  ngOnInit(): void {
    // TODO: Control update of todos in App (back pressure)
    // this.todos$ = this.todosSource$;
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
    this.todosService
      .completeOrIncomplete(todoForUpdate)
      .pipe(takeUntil(this.kill$))
      .subscribe();
  }
}
