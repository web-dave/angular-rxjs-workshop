import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { interval, Observable, of } from 'rxjs';
import {
  map,
  share,
  delay,
  shareReplay,
  tap,
  mergeMap,
  concatMap,
  switchMap,
  exhaustMap,
  retry,
  catchError,
  retryWhen
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

  loadFrequently(): Observable<Todo[]> {
    // TODO: Introduce error handled, configured, recurring, all-mighty stream
    return this.settings.settings$.pipe(
      switchMap((settings) => {
        if (settings.isPollingEnabled) {
          return interval(settings.pollingInterval).pipe(
            exhaustMap(() =>
              this.query().pipe(
                retry({ delay: 2000, resetOnSuccess: true, count: 2 }),
                // retryWhen((error) => error.pipe(delay(2000))),
                tap({ error: () => this.toolbelt.offerHardReload() }),
                catchError((error: HttpErrorResponse) => {
                  console.error(error);
                  return of([]);
                })
              )
            )
          );
        } else {
          return this.query().pipe(
            retry({ delay: 2000, resetOnSuccess: true, count: 2 }),
            // retryWhen((error) => error.pipe(delay(2000))),
            tap({ error: () => this.toolbelt.offerHardReload() }),
            catchError((error: HttpErrorResponse) => {
              console.error(error);
              return of([]);
            })
          );
        }
      }),
      shareReplay()
    );
    // return interval(5000).pipe(
    //   exhaustMap(() =>
    //     this.query().pipe(
    //       retry({ delay: 2000, resetOnSuccess: true, count: 2 }),
    //       // retryWhen((error) => error.pipe(delay(2000))),
    //       tap({ error: () => this.toolbelt.offerHardReload() }),
    //       catchError((error: HttpErrorResponse) => {
    //         console.error(error);
    //         return of([]);
    //       })
    //     )
    //   ),
    //   shareReplay()
    // );
  }

  // TODO: Fix the return type of this method
  private query(): Observable<Todo[]> {
    return (
      this.http
        .get<TodoApi[]>(`${todosUrl}`)
        // TODO: Apply mapping to fix display of tasks
        .pipe(
          tap((data) => console.log('!!!!', data)),
          map((data) => data.map((elem) => this.toolbelt.toTodo(elem))),
          tap((data) => console.log(data))
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
