import { Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarRef,
  TextOnlySnackBar
} from '@angular/material/snack-bar';
import { Todo, TodoApi } from '../models';

@Injectable()
export class Toolbelt {
  openDialog: MatSnackBarRef<TextOnlySnackBar>;
  constructor(private snackbar: MatSnackBar) {}

  toTodoApi(todo: Todo): TodoApi {
    const mappedTodo = {
      ...todo,
      isComplete: todo.isDone
    };
    delete mappedTodo.isDone;
    return mappedTodo;
  }

  toTodo(todoApi: TodoApi): Todo {
    const mappedTodo = {
      ...todoApi,
      isDone: todoApi.isComplete
    };
    delete mappedTodo.isComplete;
    return mappedTodo;
  }

  closeDialog() {
    if (this.openDialog) {
      this.snackbar.dismiss();
    }
  }

  offerHardReload() {
    this.openDialog = this.snackbar.open('Was not able loading todos', 'Retry');

    const afterAction = this.openDialog.onAction().subscribe(() => {
      location.reload();
      afterAction.unsubscribe();
    });
  }
}
