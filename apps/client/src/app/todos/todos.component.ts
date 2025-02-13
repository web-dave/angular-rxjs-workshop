import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { EMPTY, first, map, merge, Observable, of, skip, Subject, withLatestFrom } from 'rxjs';
import { Todo } from './models';
import { TodoService } from './todo.service';
import { TodosPinnedComponent } from './internals/components/todos-pinned/todos-pinned.component';
import { TodoUpdaterComponent } from './internals/components/todo-updater/todo-updater.component';
import { TodoCounterComponent } from './internals/components/todo-counter/todo-counter.component';
import { TodoCheckerComponent } from './internals/components/todo-checker/todo-checker.component';
import { TodoNavigationComponent } from './internals/components/todo-navigation/todo-navigation.component';

@Component({
  selector: 'dos-todos',
  imports: [
    TodosPinnedComponent,
    TodoUpdaterComponent,
    TodoCounterComponent,
    TodoCheckerComponent,
    TodoNavigationComponent,
    AsyncPipe
  ],
  templateUrl: './todos.component.html'
})
export class TodosComponent implements OnInit {
  private todosService = inject(TodoService);

  todos$ = new Observable<Todo[]>();
  todosSource$ = this.todosService.loadFrequently();
  todosInitial$ = this.todosSource$.pipe(first());
  todosMostRecent$: Observable<Todo[]> = EMPTY;

  update$$ = new Subject<void>();
  show$: Observable<true> = new Observable<true>();
  hide$: Observable<false> = new Observable<false>();
  showReload$: Observable<boolean> = of(true);

  ngOnInit(): void {
    // TODO: Control update of todos in App (back pressure)
    this.todosMostRecent$ = this.update$$.pipe(withLatestFrom(this.todosSource$), map((data: [void, Todo[]]) => data[1]))
    this.todos$ = merge(this.todosInitial$, this.todosMostRecent$)

    // TODO: Control display of refresh button
    this.show$ = this.todosSource$.pipe(skip(1), map(() => true))
    this.hide$ = this.update$$.pipe(map(() => false))
    this.showReload$ = merge(this.show$, this.hide$)
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
