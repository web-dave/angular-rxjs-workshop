import { Component, OnInit } from '@angular/core';
import {
  first,
  map,
  merge,
  Observable,
  of,
  skip,
  Subject,
  tap,
  withLatestFrom
} from 'rxjs';
import { Todo } from './models';
import { TodoService } from './todo.service';
import { WebSocketSubject } from 'rxjs/webSocket';

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
  show$$ = new Subject<boolean>();
  hide$$ = new Subject<boolean>();
  showReload$$ = new Subject<boolean>();
  showReload$: Observable<boolean> = of(true);

  constructor(private todosService: TodoService) {}

  ngOnInit(): void {
    // const ws = new WebSocketSubject(
    //   'wss://demo.piesocket.com/v3/channel_123?api_key=VCXCEuvhGcBDP7XhiJJUDvR1e1D3eiVjgZ9VRiaV&notify_self'
    // );
    // ws.subscribe((data) => console.table(data));

    // TODO: Control update of todos in App (back pressure)
    this.todosInitial$ = this.todosSource$.pipe(first());
    // trigger$.pipe(
    //   withLatestFrom(api$),
    //   map((data: [triggerData,ApiData] ) => data[1])
    // )
    this.todosMostRecent$ = this.update$$.pipe(
      withLatestFrom(
        this.todosSource$.pipe(
          skip(1),
          tap(() => this.showReload$$.next(true))
        )
      ),
      tap(() => this.showReload$$.next(false)),
      // map(([trigger, apiData]) => apiData)
      map((data) => data[1])
    );

    this.todos$ = merge(this.todosInitial$, this.todosMostRecent$);

    // TODO: Control display of refresh button

    this.show$ = this.todosSource$.pipe(
      skip(1),
      map(() => true)
    );
    this.hide$ = this.update$$.pipe(map(() => false));

    this.showReload$ = merge(this.show$$, this.hide$$);
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
