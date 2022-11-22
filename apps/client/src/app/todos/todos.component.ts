import { Component, OnDestroy, OnInit } from '@angular/core';
import { ValueProvider } from '@nestjs/common';
import {
  first,
  map,
  mapTo,
  merge,
  Observable,
  of,
  skip,
  Subject,
  Subscription,
  switchMap,
  takeUntil,
  tap,
  withLatestFrom
} from 'rxjs';
import { WebSocketSubject } from 'rxjs/webSocket';
import { Todo } from './models';
import { TodoService } from './todo.service';

@Component({
  selector: 'dos-todos',
  templateUrl: './todos.component.html'
})
export class TodosComponent implements OnInit, OnDestroy {
  todos$: Observable<Todo[]>;
  todosSource$ = this.todosService.loadFrequently();
  todosInitial$: Observable<Todo[]>;
  todosMostRecent$: Observable<Todo[]>;

  update$$ = new Subject<void>();
  _showReload$ = new Subject<boolean>();

  show$: Observable<boolean> = this.todosSource$.pipe(
    skip(1),
    map(() => true)
  );
  hide$: Observable<boolean> = this.update$$.pipe(map(() => false));
  showReload$: Observable<boolean> = merge(this.show$, this.hide$);

  terminator$$ = new Subject<number>();
  sub = new Subscription();

  constructor(private todosService: TodoService) {}

  ngOnDestroy(): void {
    this.terminator$$.next(1);
    // this.terminator$$.complete()
    this.sub.unsubscribe();
  }

  ngOnInit(): void {
    // guter weg zum unsubscriben
    // this.sub.add(this.todosSource$.subscribe());
    // this.todosSource$.pipe(takeUntil(this.terminator$$)).subscribe();
    // TODO: Control update of todos in App (back pressure)
    this.todosInitial$ = this.todosSource$.pipe(first());

    // this.todosMostRecent$ = this.update$$.pipe(
    //   switchMap(() => this.todosSource$)
    // );

    this.todosMostRecent$ = this.update$$.pipe(
      withLatestFrom(this.todosSource$),
      tap(() => this._showReload$.next(false)),
      // map((values: [void, Todo[]]) => values[1]),
      map(([, todos]) => todos) // fancy aber evtl nicht gut lesbar
    );
    this.todos$ = merge(this.todosInitial$, this.todosMostRecent$);

    // TODO: Control display of refresh button

    this.todosSource$.pipe(tap(() => this._showReload$.next(true)));

    // _show$: Observable<boolean> = this.todosSource$.pipe(
    //   skip(1),
    //   map(() => true)
    // );
    // _hide$: Observable<boolean> = this.update$$.pipe(map(() => false));
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
