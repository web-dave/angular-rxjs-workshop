import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, timer } from 'rxjs';
import {
  catchError,
  exhaustMap,
  filter,
  map,
  retry,
  share,
  shareReplay,
  tap
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

  loadFrequently() {
    return timer(10, 5000).pipe(
      exhaustMap(() => this.query()),
      shareReplay(1),
      tap({ error: () => this.toolbelt.offerHardReload() })
    );
    // // TODO: Introduce error handled, configured, recurring, all-mighty stream
    // return this.query().pipe(
    //   shareReplay(1),
    // tap({ error: () => this.toolbelt.offerHardReload() })
    // );
  }

  // TODO: Fix the return type of this method
  private query(): Observable<Todo[]> {
    return (
      this.http
        .get<TodoApi[]>(`${todosUrl}`)
        // TODO: Apply mapping to fix display of tasks
        .pipe(
          map((data) => data.map((itm) => this.toolbelt.toTodo(itm))),
          retry({ count: 2, delay: 500, resetOnSuccess: true }),
          catchError((error) => of(null)),
          filter((data) => !!data)
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
