import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { interval, Observable, timer } from 'rxjs';
import { WebSocketSubject } from 'rxjs/webSocket';
import {
  delay,
  map,
  retry,
  retryWhen,
  shareReplay,
  switchMap,
  tap
} from 'rxjs/operators';
import { Toolbelt } from './internals';
import { Todo, TodoApi } from './models';
import { TodoSettings } from './todo-settings.service';

const todosUrl = 'http://localhost:3333/api';
// const foo = new WebSocketSubject(
//   'ws://localhost:4200/sockjs-node/520/dd4kc5bt/websocket'
// );
// foo.subscribe((data) => console.log(data));
// foo.next('älyifvjodüifgjdsüogihs');
@Injectable()
export class TodoService {
  constructor(
    private http: HttpClient,
    private toolbelt: Toolbelt,
    private settings: TodoSettings
  ) {}

  loadFrequently(): Observable<Todo[]> {
    // TODO: Introduce error handled, configured, recurring, all-mighty stream
    return this.settings.settings$.pipe(
      tap((data) => console.table(data)),
      switchMap((settings) => {
        if (settings.isPollingEnabled) {
          return timer(0, settings.pollingInterval).pipe(
            switchMap(() => this.query())
          );
        } else {
          return this.query();
        }
      }),
      retryWhen((error) => error.pipe(delay(1500))),
      shareReplay(1)
    );

    return timer(0, 4000).pipe(
      switchMap(() =>
        this.query().pipe(
          retryWhen((error) => error.pipe(delay(1500))),
          tap((data) => console.table(data)),
          tap({ error: () => this.toolbelt.offerHardReload() })
        )
      ),
      shareReplay(1)
    );
  }

  // TODO: Fix the return type of this method
  private query(): Observable<Todo[]> {
    return this.http
      .get<TodoApi[]>(`${todosUrl}`)
      .pipe(map((liste) => liste.map((elm) => this.toolbelt.toTodo(elm))));
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
