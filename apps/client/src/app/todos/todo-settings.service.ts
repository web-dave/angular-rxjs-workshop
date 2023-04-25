import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  debounce,
  debounceTime,
  distinctUntilChanged,
  scan,
  shareReplay
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
    scan((prev, next) => ({ ...prev, ...next })),
    // debounceTime(1000),
    distinctUntilChanged(
      (prev, curr) =>
        prev.isPollingEnabled === curr.isPollingEnabled &&
        prev.pollingInterval === curr.pollingInterval
    ),
    shareReplay(1)
  ) as Observable<TodoSettingsOptions>;

  update(updates: Partial<TodoSettingsOptions>) {
    this.settings$$.next(updates);
  }
}
