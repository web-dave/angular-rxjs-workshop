import { Component, OnInit } from '@angular/core';
import {
  first,
  map,
  merge,
  NEVER,
  Observable,
  of,
  skip,
  Subject,
  withLatestFrom
} from 'rxjs';
import { WebSocketSubject } from 'rxjs/webSocket';
import { Todo } from './models';
import { TodoService } from './todo.service';

@Component({
  selector: 'dos-todos',
  templateUrl: './todos.component.html'
})
export class TodosComponent implements OnInit {
  todos$: Observable<Todo[]> = NEVER;
  todosSource$ = this.todosService.loadFrequently();
  todosInitial$: Observable<Todo[]> = this.todosSource$.pipe(first());
  todosMostRecent$: Observable<Todo[]> = this.todosSource$.pipe(skip(1));

  update$$ = new Subject<string>();

  show$: Observable<boolean> = this.todosMostRecent$.pipe(map(() => true));
  hide$: Observable<boolean> = this.update$$.pipe(map(() => false));
  showReload$: Observable<boolean> = merge(this.show$, this.hide$);

  constructor(private todosService: TodoService) {}

  ngOnInit(): void {
    // const ws = new WebSocketSubject('wss://')
    // TODO: Control update of todos in App (back pressure)
    const updatedTodos$ = this.update$$.pipe(
      withLatestFrom(this.todosMostRecent$),
      map((data) => data[1])
    );

    this.todos$ = merge(this.todosInitial$, updatedTodos$);

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
    this.todosService.completeOrIncomplete(todoForUpdate).subscribe();
  }
}

// const _fun = (obs$)=>{
//   fun()
//   newObs$
// }
// const tap = (obs$)=>{
//   fun()
//   obs$
// }
