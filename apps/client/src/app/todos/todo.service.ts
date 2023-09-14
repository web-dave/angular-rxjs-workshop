import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, NEVER, Observable, of, timer } from 'rxjs';
import {
  catchError,
  concatMap,
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
  myCache: Todo[] = [];
  constructor(
    private http: HttpClient,
    private toolbelt: Toolbelt,
    private settings: TodoSettings
  ) {}

  loadFrequently() {
    return timer(1000, 2000).pipe(
      exhaustMap(() =>
        this.query().pipe(
          retry({
            count: 2,
            delay: 2000,
            resetOnSuccess: true
          }),
          catchError((err) => {
            console.log('==>', err);
            return of(this.myCache); //EMPTY;
          })
        )
      ),
      share()
    );
    // TODO: Introduce error handled, configured, recurring, all-mighty stream
    // return this.query().pipe(
    //   tap({ error: () => this.toolbelt.offerHardReload() }),
    //   share()
    // );
  }

  // TODO: Fix the return type of this method
  private query(): Observable<Todo[]> {
    return (
      this.http
        .get<TodoApi[]>(`${todosUrl}`)
        // TODO: Apply mapping to fix display of tasks
        .pipe(
          map((list) => list.map((t) => this.toolbelt.toTodo(t))),
          tap((data) => (this.myCache = data))
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
