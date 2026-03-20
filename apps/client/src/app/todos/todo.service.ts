import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, timer } from 'rxjs';
import {
  catchError,
  concatMap,
  delay,
  exhaustMap,
  map,
  mergeMap,
  retry,
  share,
  shareReplay,
  switchMap,
  tap
} from 'rxjs/operators';
import { WebSocketSubject } from 'rxjs/webSocket';
import { Toolbelt } from './internals';
import { Todo, TodoApi } from './models';
import { TodoSettings } from './todo-settings.service';

const todosUrl = '/api';

@Injectable({ providedIn: 'root' })
export class TodoService {
  constructor(
    private http: HttpClient,
    private toolbelt: Toolbelt,
    private settings: TodoSettings
  ) {}

  loadFrequently() {
    // TODO: Introduce error handled, configured, recurring, all-mighty stream

    return this.settings.settings$.pipe(
      switchMap(({ pollingInterval, isPollingEnabled }) => {
        if (isPollingEnabled) {
          return timer(0, pollingInterval || 5000);
        } else {
          return of(0);
        }
      }),
      exhaustMap(() =>
        // mergeMap(() =>
        // concatMap(() =>
        // switchMap(() =>
        this.query().pipe(tap({ error: () => this.toolbelt.offerHardReload() }))
      ),
      shareReplay()
    );
  }

  // TODO: Fix the return type of this method
  private query(): Observable<Todo[]> {
    return this.http.get<TodoApi[]>(`${todosUrl}`).pipe(
      // retry({
      //   count: 3,
      //   resetOnSuccess: true,
      //   delay: 2000
      // }),
      retry({
        count: 3,
        resetOnSuccess: true,
        delay: () => of(true).pipe(delay(2000))
      }),
      catchError(() => of([])),
      tap((list) => console.log(list)),
      map((list) => list.map((t) => this.toolbelt.toTodo(t))),
      tap((list) => console.log(list))
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
