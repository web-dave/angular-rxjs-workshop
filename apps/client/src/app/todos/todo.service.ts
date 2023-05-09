import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { interval, Observable } from 'rxjs';
import {
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
  constructor(
    private http: HttpClient,
    private toolbelt: Toolbelt,
    private settings: TodoSettings
  ) {}

  loadFrequently() {
    // TODO: Introduce error handled, configured, recurring, all-mighty stream
    return interval(4000).pipe(
      tap((data) => console.log(data)),
      exhaustMap((b) =>
        this.query().pipe(
          retry({ delay: 2000, count: 3, resetOnSuccess: true }),
          tap({ error: () => this.toolbelt.offerHardReload() })
        )
      ),
      shareReplay({ refCount: true })
    );
    // return this.query().pipe(
    //   tap((data) => console.log(data)),
    //   shareReplay({ refCount: true }),
    //   tap({ error: () => this.toolbelt.offerHardReload() })
    // );
  }

  // TODO: Fix the return type of this method
  private query(): Observable<Todo[]> {
    return (
      this.http
        .get<TodoApi[]>(`${todosUrl}`)
        // TODO: Apply mapping to fix display of tasks
        .pipe(map((data) => data.map((elem) => this.toolbelt.toTodo(elem))))
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
