import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, scan, shareReplay, tap } from 'rxjs/operators';

export interface TodoSettingsOptions {
  isPollingEnabled: boolean;
  pollingInterval: number;
}

@Injectable()
export class TodoSettings {
  private settings$$ = new BehaviorSubject<Partial<TodoSettingsOptions>>({
    isPollingEnabled: false,
    pollingInterval: 5000
  });

  settings$ = this.settings$$.pipe(
    scan((prev, next) => ({ ...prev, ...next })),
    tap((data) => console.table(data)),
    distinctUntilChanged((previous, current) => {
      return (
        previous.isPollingEnabled === current.isPollingEnabled &&
        previous.pollingInterval === current.pollingInterval
      );
    }),
    shareReplay(1)
  );

  update(updates: Partial<TodoSettingsOptions>) {
    this.settings$$.next(updates);
  }
}
