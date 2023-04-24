import { Component, OnInit } from '@angular/core';
import { fromEvent, map, mergeMap, Observable, of, Subject, tap } from 'rxjs';
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

  update$$ = new Subject();
  show$: Observable<boolean>;
  hide$: Observable<boolean>;
  showReload$: Observable<boolean> = of(true);

  constructor(private todosService: TodoService) {}

  ngOnInit(): void {
    // TODO: Control update of todos in App (back pressure)
    this.todos$ = this.todosSource$;

    // TODO: Control display of refresh button
    setTimeout(() => {
      const input = document.getElementsByClassName(
        'myinput'
      )[0] as HTMLInputElement;
      fromEvent(input, 'input')
        .pipe(
          map((e) => (e as any).data),
          tap((data) => console.log('input', data)),
          mergeMap((data) => this.todosService.getTodo(data))
        )
        .subscribe();
    }, 2000);
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
