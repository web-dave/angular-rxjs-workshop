import { HttpClient } from '@angular/common/http';
import { TypeofExpr } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { iif, Observable, of, timer } from 'rxjs';
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
import { Toolbelt } from './internals';
import { Todo, TodoApi } from './models';
import { TodoSettings } from './todo-settings.service';

const todosUrl = 'http://localhost:3333/api';

@Injectable()
export class TodoService {
  private defaultValue: Todo[] = [];
  constructor(
    private http: HttpClient,
    private toolbelt: Toolbelt,
    private settings: TodoSettings
  ) {}

  loadFrequently() {
    // const myRequest = this.query().pipe(
    //   retry({ count: 2, delay: 600 }),
    //   // retry({ count: 2 }),
    //   tap((value) => (this.defaultValue = value)),
    //   catchError(() => of(this.defaultValue)),
    //   tap({ error: () => this.toolbelt.offerHardReload() })
    // );

    // // TODO: Introduce error handled, configured, recurring, all-mighty stream
    // return this.settings.settings$.pipe(
    //   switchMap((options) => {
    //     if (options.isPollingEnabled) {
    //       return timer(1000, options.pollingInterval).pipe(
    //         switchMap(() => myRequest)
    //       );
    //     } else {
    //       return myRequest;
    //     }
    //   }),
    //   shareReplay()
    // );
    return this.settings.settings$.pipe(
      switchMap((options) =>
        options.isPollingEnabled
          ? timer(1000, options.pollingInterval)
          : timer(1000)
      ),
      switchMap(() =>
        this.query().pipe(
          retry({ count: 2, delay: 600 }),
          // retry({ count: 2 }),
          tap((value) => (this.defaultValue = value)),
          catchError(() => of(this.defaultValue)),
          tap({ error: () => this.toolbelt.offerHardReload() })
        )
      ),
      shareReplay()
    );
    // return this.query().pipe(
    //   tap({ error: () => this.toolbelt.offerHardReload() }),
    //   shareReplay()
    // );

    // return this.settings.settings$.pipe(
    //   switchMap((options) =>
    //     options.isPollingEnabled ? timer(1000, options.pollingInterval) : of(1)
    //   ),

    //   switchMap(() =>
    //     this.query().pipe(
    //       retry({ count: 2, delay: 600 }),
    //       // retry({ count: 2 }),
    //       tap((value) => (this.defaultValue = value)),
    //       catchError(() => of(this.defaultValue)),
    //       tap({ error: () => this.toolbelt.offerHardReload() })
    //     )
    //   ),
    //   shareReplay()
    // );

    // return timer(1000, 3000).pipe(
    //   switchMap(() =>
    //     this.query().pipe(
    //       retry({ count: 2, delay: 600 }),
    //       // retry({ count: 2 }),
    //       tap((value) => (this.defaultValue = value)),
    //       catchError(() => of(this.defaultValue)),
    //       tap({ error: () => this.toolbelt.offerHardReload() })
    //     )
    //   ),
    //   shareReplay()
    // );

    // return this.query().pipe(
    //   tap({ error: () => this.toolbelt.offerHardReload() }),
    //   shareReplay()
    // );
  }

  // TODO: Fix the return type of this method
  private query(): Observable<Todo[]> {
    return this.http
      .get<TodoApi[]>(`${todosUrl}`)
      .pipe(map((data) => data.map((t) => this.toolbelt.toTodo(t))));
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
