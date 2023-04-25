import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { fromEvent, interval, Observable, of } from 'rxjs';
import {
  catchError,
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
  foo = 'bar';
  constructor(
    private http: HttpClient,
    private toolbelt: Toolbelt,
    private settings: TodoSettings
  ) {}

  onLine$ = fromEvent(window, 'online');

  loadFrequently(): Observable<Todo[]> {
    // TODO: Introduce error handled, configured, recurring, all-mighty stream

    const pollingInterval$ = this.settings.settings$.pipe(
      tap((data) => console.log(data)),
      switchMap((data) => {
        if (data.isPollingEnabled) {
          return interval(data.pollingInterval);
        } else {
          return of(0);
        }
      })
    );

    return pollingInterval$.pipe(
      exhaustMap(() =>
        this.query().pipe(
          // retry({ count: 2, delay: 2000 }),
          // retry({ count: 2, delay: () => this.onLine$ }),
          catchError(() => of([]))
        )
      ), //('',200)=>this.onLine$
      tap({ error: () => this.toolbelt.offerHardReload() }),
      // tap((data) => console.log(data)),
      shareReplay(1)
    );
  }

  // TODO: Fix the return type of this method
  private query(): Observable<Todo[]> {
    return this.http.get<TodoApi[]>(`${todosUrl}`).pipe(
      // tap((data) => console.log(data[0])),
      map((data) => data.map((todo) => this.toolbelt.toTodo(todo)))
      // tap((data) => console.log(data[0]))
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

  getTodo(id: any) {
    return this.http.get(`${todosUrl}/${id}`);
  }

  private toggleTodoState(todoForUpdate: Todo): Todo {
    todoForUpdate.isDone = todoForUpdate.isDone ? false : true;
    return todoForUpdate;
  }
}
