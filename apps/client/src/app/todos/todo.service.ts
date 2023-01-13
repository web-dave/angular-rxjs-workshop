import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of, throwError, timer } from 'rxjs';
import {
  map,
  shareReplay,
  tap,
  mergeMap,
  concatMap,
  exhaustMap,
  switchMap,
  retry,
  catchError
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

  // myOp = (obs: Observable<any>): Observable<any> => {
  //   return new Observable(Data);
  // };
  // tap = (obs: Observable<any>): Observable<any> => {
  //   //
  //   return obs;
  // };

  loadFrequently() {
    // TODO: Introduce error handled, configured, recurring, all-mighty stream
    return timer(10, 1000).pipe(
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
