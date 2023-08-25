import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable, interval, of } from 'rxjs';
import {
  catchError,
  concatMap,
  delay,
  exhaustMap,
  map,
  mergeMap,
  retry,
  share,
  switchMap,
  tap
} from 'rxjs/operators';
import { Toolbelt } from './internals';
import { Todo, TodoApi } from './models';
import { TodoSettings } from './todo-settings.service';

const todosUrl = 'http://localhost:3333/api';

@Injectable()
export class TodoService {
  constructor(
    private http: HttpClient,
    private toolbelt: Toolbelt,
    private settings: TodoSettings
  ) {}

  loadFrequently() {
    const interval$: Observable<number> = this.settings.settings$.pipe(
      tap((data) => console.log(data)),
      switchMap((data) => {
        if (data.isPollingEnabled) {
          return interval(data.pollingInterval);
        } else {
          return of(0);
        }
      })
    );

    return interval$.pipe(
      exhaustMap(() => this.query()),
      share()
    );
  }

  private query(): Observable<Todo[]> {
    return this.http.get<TodoApi[]>(`${todosUrl}`).pipe(
      tap(console.log),
      retry({
        count: 1,
        delay: (error, retryCount) => of('').pipe(delay(3000))
      }),
      catchError(() => EMPTY), // sehr cool
      // tap({ error: () => this.toolbelt.offerHardReload() }),
      map((data) => data.map((value) => this.toolbelt.toTodo(value)))
    );
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
