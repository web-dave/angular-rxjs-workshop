import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  distinctUntilChanged,
  distinctUntilKeyChanged,
  scan,
  shareReplay,
  tap
} from 'rxjs/operators';

export interface TodoSettingsOptions {
  isPollingEnabled: boolean;
  pollingInterval: number;
}

@Injectable()
export class TodoSettings {
  private settings$$ = new BehaviorSubject<Partial<TodoSettingsOptions>>({
    isPollingEnabled: true,
    pollingInterval: 5000
  });

  settings$ = this.settings$$.pipe(
    // distinctUntilKeyChanged('isPollingEnabled'),
    distinctUntilChanged((a, b) => JSON.stringify(a) !== JSON.stringify(b)),
    tap((settings) => console.log('=====>', settings)),
    scan((prev, next) => ({ ...prev, ...next })),
    shareReplay(1)
  );

  update(updates: Partial<TodoSettingsOptions>) {
    this.settings$$.next(updates);
  }
}
