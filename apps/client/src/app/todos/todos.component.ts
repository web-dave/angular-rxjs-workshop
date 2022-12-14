import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  first,
  map,
  merge,
  Observable,
  of,
  shareReplay,
  skip,
  Subject,
  take,
  takeUntil,
  takeWhile,
  tap,
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
  todosInitial$: Observable<Todo[]> = this.todosSource$.pipe(first());
  todosMostRecent$: Observable<Todo[]>;

  update$$ = new Subject<'update'>();

  show$: Observable<boolean> = this.todosSource$.pipe(
    skip(1),
    map(() => true)
  );

  hide$: Observable<boolean> = this.update$$.pipe(map(() => false));

  showReload$: Observable<boolean> = merge(this.show$, this.hide$);

  foo = 0;

  terminator$$ = new Subject<void>();

  constructor(private todosService: TodoService) {}
  ngOnDestroy(): void {
    this.foo = 1;
    this.terminator$$.next();
  }

  ngOnInit(): void {
    // TODO: Control update of todos in App (back pressure)
    this.todosMostRecent$ = this.update$$.pipe(
      map((data) => data), // 'update'
      withLatestFrom(this.todosSource$), // ['update', [..]]
      map((data) => data[1]), //  [..]
      // map(([btn, todos]: ['update', Todo[]]) => todos), //  [..]
      tap((data) => console.log(data))
    );

    this.todos$ = merge(this.todosInitial$, this.todosMostRecent$);

    // TODO: Control display of refresh button

    this.todosSource$.pipe(takeUntil(this.terminator$$)).subscribe();
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

  // r(){
  //   console.log([1,6,7].reduce((prev: number,curr: number)=>{
  //     return prev+curr
  //   }, 100))
  // }
}
