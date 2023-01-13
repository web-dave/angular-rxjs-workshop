import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, iif, interval, Observable, of, timer } from 'rxjs';
import {
  map,
  shareReplay,
  tap,
  exhaustMap,
  retry,
  catchError,
  switchMap
} from 'rxjs/operators';
import { Toolbelt } from './internals';
import { Todo, TodoApi } from './models';
import { TodoSettings } from './todo-settings.service';

const todosUrl = 'http://localhost:3333/api';

@Injectable()
export class TodoService {
  fallbackData: Todo[] = [];
  constructor(
    private http: HttpClient,
    private toolbelt: Toolbelt,
    private settings: TodoSettings
  ) {}

  loadFrequently() {
    // TODO: Introduce error handled, configured, recurring, all-mighty stream

    // const conditionialInterval_$ = this.settings.settings$.pipe(
    //   switchMap((settings) => of(settings.isPollingEnabled))
    // );
    const conditionialInterval$ = this.settings.settings$.pipe(
      switchMap((settings) => {
        if (!settings.isPollingEnabled) {
          return of(0);
        } else {
          return timer(10, settings.pollingInterval);
        }
      })
    );
    // const conditionialInterval__$ = this.settings.settings$.pipe(
    //   switchMap((settings) =>
    //     iif(
    //       () => settings.isPollingEnabled,
    //       interval(settings.pollingInterval),
    //       EMPTY
    //     )
    //   )
    // );

    return conditionialInterval$.pipe(
      exhaustMap(() => this.query()),
      shareReplay(),
      tap({
        error: (e) => {
          console.info(e);
          this.toolbelt.offerHardReload();
        }
      })
    );
    // return this.query().pipe(
    //   shareReplay(),
    //   tap({ error: () => this.toolbelt.offerHardReload() })
    // );
  }

  // TODO: Fix the return type of this method
  private query(): Observable<Todo[]> {
    return this.http.get<TodoApi[]>(`${todosUrl}`).pipe(
      // tap((data) => console.log(data[0])),
      map((data) => data.map((elem) => this.toolbelt.toTodo(elem))),
      tap((data) => (this.fallbackData = data)),
      retry({ count: 2, delay: 200, resetOnSuccess: false }),
      catchError((err) => {
        console.log('====>', err);
        // return throwError(() => new Error(err.message));
        return of(this.fallbackData);
      })
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
