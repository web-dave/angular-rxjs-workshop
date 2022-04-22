import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, pipe, timer } from 'rxjs';
import {
  map,
  share,
  shareReplay,
  tap,
  exhaustMap,
  retry,
  retryWhen,
  delay,
  switchMap
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
  ) {
    settings.settings$.subscribe((data) => console.table(data));
  }

  loadFrequently(): Observable<Todo[]> {
    // TODO: Introduce error handled, configured, recurring, all-mighty stream
    return this.settings.settings$.pipe(
      switchMap((data) => {
        if (data.isPollingEnabled) {
          return timer(100, data.pollingInterval).pipe(
            exhaustMap(() => this.query()),
            tap((data) => console.log(data))
          );
        } else {
          return this.query();
        }
      }),

      tap({ error: () => this.toolbelt.offerHardReload() }),
      share()
    );

    //  this.query().pipe(
    //   tap({ error: () => this.toolbelt.offerHardReload() }),
    //   share()
    // );
  }

  // TODO: Fix the return type of this method
  private query(): Observable<Todo[]> {
    return this.http.get<TodoApi[]>(`${todosUrl}`).pipe(
      retry(20),
      map((tds) => tds.map((t) => this.toolbelt.toTodo(t)))
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
