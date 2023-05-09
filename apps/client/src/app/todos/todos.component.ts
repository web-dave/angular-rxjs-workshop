import { Component, OnInit } from '@angular/core';
import {
  first,
  map,
  merge,
  Observable,
  of,
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
  todos$: Observable<Todo[]>;
  todosSource$ = this.todosService.loadFrequently();

  todosInitial$: Observable<Todo[]> = this.todosSource$.pipe(first());

  todosMostRecent$: Observable<Todo[]> = this.update$$.pipe(
    withLatestFrom(this.todosSource$),
    map((data: [unknown, Todo[]]) => data[1])
  );

  show$: Observable<boolean>;
  hide$: Observable<boolean>;
  showReload$: Observable<boolean> = of(true);

  constructor(private todosService: TodoService) {
    // setTimeout(() => {
    //   this.todosService
    //     .loadFrequently()
    //     .subscribe((data) => console.table(data));
    // }, 1000);
  }

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
