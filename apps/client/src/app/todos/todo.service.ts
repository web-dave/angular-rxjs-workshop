import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { interval, Observable, of, timer } from 'rxjs';
import {
  catchError,
  concatMap,
  delay,
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
  lastData: Todo[] = [];
  constructor(
    private http: HttpClient,
    private toolbelt: Toolbelt,
    private settings: TodoSettings
  ) {}

  loadFrequently(): Observable<Todo[]> {
    return this.settings.settings$.pipe(
      tap((data) => console.log(data)),
      // Wichtig!! Muss ein switchMap sein, da dieses den vorherigen Timer cancelt
      switchMap((option) => {
        return option.isPollingEnabled
          ? timer(10, option.pollingInterval)
          : timer(10);
      }),
      exhaustMap((i) => this.query()),
      retry({
        count: 2,
        resetOnSuccess: true,
        delay: () => this.logError('retry delay') //waiting for logError
      }),
      tap((data) => (this.lastData = data)),
      // tap({ error: () => this.toolbelt.offerHardReload() }),
      catchError(() => of(this.lastData)),
      shareReplay()
    );
    // TODO: Introduce error handled, configured, recurring, all-mighty stream
    // return timer(10, 1000).pipe(
    //   exhaustMap((i) => this.query().pipe()),
    //   retry({
    //     count: 2,
    //     resetOnSuccess: true,
    //     delay: () => this.logError('retry delay') //waiting for logError
    //   }),
    //   tap((data) => (this.lastData = data)),
    //   // tap({ error: () => this.toolbelt.offerHardReload() }),
    //   catchError(() => of(this.lastData)),
    //   shareReplay()
    // );
  }

  private logError(err: string) {
    return of(err).pipe(delay(3000));
  }

  // TODO: Fix the return type of this method
  private query(): Observable<Todo[]> {
    return this.http.get<TodoApi[]>(`${todosUrl}`).pipe(
      tap((data) => console.table(data)),
      map((data: TodoApi[]) =>
        // TODO: Apply mapping to fix display of tasks
        data.map((value) => this.toolbelt.toTodo(value))
      ),
      tap((data) => console.table(data))
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
