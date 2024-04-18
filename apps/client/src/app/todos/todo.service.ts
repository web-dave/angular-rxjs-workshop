import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, fromEvent, of, timer } from 'rxjs';
import {
  catchError,
  concatMap,
  delay,
  exhaustMap,
  filter,
  map,
  mergeMap,
  retry,
  shareReplay,
  switchMap,
  tap
} from 'rxjs/operators';
import { Toolbelt } from './internals';
import { Todo, TodoApi } from './models';
import { TodoSettings } from './todo-settings.service';

const todosUrl = 'http://localhost:3333/api';

@Injectable()
export class TodoService {
  isOnline$ = timer(10, 1000).pipe(
    map(() => navigator.onLine),
    tap((data) => console.log(data)),
    filter((online) => online),
    tap((data) => console.log(data))
  );

  constructor(
    private http: HttpClient,
    private toolbelt: Toolbelt,
    private settings: TodoSettings
  ) {}

  loadFrequently(): Observable<Todo[]> {
    // config$
    const interval$ = this.settings.settings$.pipe(
      switchMap((data) => {
        //     wenn polling?
        if (data.isPollingEnabled) {
          //     intervall
          return timer(500, data.pollingInterval);
        } else {
          //     ein value
          return of(1);
        }
      })
    );

    // TODO: Introduce error handled, configured, recurring, all-mighty stream
    return interval$.pipe(
      exhaustMap(() =>
        this.query().pipe(tap({ error: () => this.toolbelt.offerHardReload() }))
      ),
      shareReplay()
    );
  }

  // TODO: Fix the return type of this method
  private query(): Observable<Todo[]> {
    return this.http.get<TodoApi[]>(`${todosUrl}`).pipe(
      retry({
        count: 2,
        resetOnSuccess: true,
        delay: (error, cnt) => this.isOnline$
      }),
      catchError((error) => of([])),
      tap((data) => console.log(data[0])),
      map((data) => data.map((itm) => this.toolbelt.toTodo(itm))),
      tap((data) => console.log(data[0]))
    );
    // TODO: Apply mapping to fix display of tasks
  }

  create(todo: Todo): Observable<TodoApi> {
    return this.http.post<TodoApi>(todosUrl, todo);
  }

  remove(todoForRemoval: TodoApi): Observable<Todo> {
    return this.http
      .delete<TodoApi>(`${todosUrl}/${todoForRemoval.id}`)
      .pipe(map((todo) => this.toolbelt.toTodo(todo)));
  }

  completeOrIncomplete(todoForUpdate: Todo): Observable<Todo> {
    const updatedTodo = this.toggleTodoState(todoForUpdate);
    return this.http
      .put<TodoApi>(
        `${todosUrl}/${todoForUpdate.id}`,
        this.toolbelt.toTodoApi(updatedTodo)
      )
      .pipe(map((todo) => this.toolbelt.toTodo(todo)));
  }

  private toggleTodoState(todoForUpdate: Todo): Todo {
    todoForUpdate.isDone = todoForUpdate.isDone ? false : true;
    return todoForUpdate;
  }
}
