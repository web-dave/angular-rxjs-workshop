import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, iif, interval, of } from 'rxjs';
import { WebSocketSubject } from 'rxjs/webSocket';
import {
  catchError,
  concatMap,
  exhaustMap,
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
  ws: WebSocketSubject<any>;
  constructor(
    private http: HttpClient,
    private toolbelt: Toolbelt,
    private settings: TodoSettings
  ) {
    this.ws = new WebSocketSubject('ws://127.0.0.1:60146/');

    setTimeout(() => {
      this.ws.subscribe((data) => console.log(data));
      this.ws.next('Hallo Adesso');
    }, 3000);
  }

  loadFrequently() {
    // TODO: Introduce error handled, configured, recurring, all-mighty stream

    const myInterval$: Observable<number> = this.settings.settings$.pipe(
      tap((data) => console.log(data)),
      // switchMap((data) =>
      //   iif(() => data.isPollingEnabled, interval(data.pollingInterval), of(0))
      // )
      switchMap((data) => {
        if (data.isPollingEnabled) {
          return interval(data.pollingInterval);
        } else {
          return of(0);
        }
      })
    );

    return myInterval$.pipe(
      exhaustMap(() => this.query()),
      shareReplay()
    );
  }

  // TODO: Fix the return type of this method
  private query(): Observable<Todo[]> {
    return (
      this.http
        .get<TodoApi[]>(`${todosUrl}`)
        // TODO: Apply mapping to fix display of tasks
        .pipe(
          retry({
            count: 3,
            delay: 300,
            resetOnSuccess: true
          }),
          catchError((err) => of([])),
          map((data) => data.map((t) => this.toolbelt.toTodo(t)))
        )
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
