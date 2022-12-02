import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { scan, shareReplay } from 'rxjs/operators';

export interface TodoSettingsOptions {
  isPollingEnabled: boolean;
  pollingInterval: number;
}
const TodoSettingsDefaultOptions = {
  isPollingEnabled: true,
  pollingInterval: 5000
};

@Injectable()
export class TodoSettings {
  private settings$$ = new BehaviorSubject<Partial<TodoSettingsOptions>>(
    TodoSettingsDefaultOptions
  );

  settings$: Observable<TodoSettingsOptions> = this.settings$$.pipe(
    scan((prev, next) => ({ ...prev, ...next }), TodoSettingsDefaultOptions),
    shareReplay(1)
  );

  update(updates: Partial<TodoSettingsOptions>) {
    this.settings$$.next(updates);
  }
}
