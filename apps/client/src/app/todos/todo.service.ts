import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, interval, of } from 'rxjs';
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
  cache = [];
  constructor(
    private http: HttpClient,
    private toolbelt: Toolbelt,
    private settings: TodoSettings
  ) {}

  loadFrequently() {
    return interval(1500).pipe(
      concatMap(() => this.query()),
      share()
    );
  }

  // TODO: Fix the return type of this method
  private query(): Observable<Todo[]> {
    return this.http.get<TodoApi[]>(`${todosUrl}`).pipe(
      tap(console.log),
      retry({
        count: 1,
        delay: (error, retryCount) => of('').pipe(delay(3000))
      }),
      catchError(() => of(this.cache)),
      // tap({ error: () => this.toolbelt.offerHardReload() }),
      tap((liste) => (this.cache = liste)),
      map((data) => data.map((value) => this.toolbelt.toTodo(value)))
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
