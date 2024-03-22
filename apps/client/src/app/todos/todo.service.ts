import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, fromEvent, of, timer } from 'rxjs';
import {
  catchError,
  concatMap,
  delay,
  exhaustMap,
  map,
  mergeMap,
  retry,
  shareReplay,
  startWith,
  switchMap,
  tap
} from 'rxjs/operators';
import { Toolbelt } from './internals';
import { Todo, TodoApi } from './models';
import { TodoSettings } from './todo-settings.service';

const todosUrl = 'http://localhost:3333/api';

@Injectable()
export class TodoService {
  cache: Todo[] = [];
  constructor(
    private http: HttpClient,
    private toolbelt: Toolbelt,
    private settings: TodoSettings
  ) {}

  loadFrequently() {
    // TODO: Introduce error handled, configured, recurring, all-mighty stream
    // if polling
    //      Poll
    // else
    //   ping

    return this.settings.settings$.pipe(
      switchMap((data) => {
        if (data.isPollingEnabled) {
          return timer(500, data.pollingInterval);
        } else {
          return of(0);
        }
      }),
      // ).pipe(
      // tap((i) => console.log(i)),
      exhaustMap((i) => {
        // console.log(i);
        return this.query().pipe(
          tap({ error: () => this.toolbelt.offerHardReload() })
        );
      }),
      shareReplay()
    );
  }
  isOnline$ = fromEvent(window, 'online').pipe(startWith(true), shareReplay());

  // TODO: Fix the return type of this method
  private query(): Observable<Todo[]> {
    return this.http.get<TodoApi[]>(`${todosUrl}`).pipe(
      // retry({
      //   count: 2,
      //   delay: (error, count) => this.isOnline$,
      //   resetOnSuccess: true
      // }),
      catchError(() => of(this.cache)),
      map((list) => list.map((item) => this.toolbelt.toTodo(item))),
      tap((data) => (this.cache = data))
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
