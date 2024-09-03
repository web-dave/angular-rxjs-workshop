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
    isPollingEnabled: true,
    pollingInterval: 5000
  });

  settings$ = this.settings$$.pipe(
    scan((prev, next) => ({ ...prev, ...next })),
    distinctUntilChanged(
      (prev, next) =>
        prev.isPollingEnabled === next.isPollingEnabled &&
        prev.pollingInterval === next.pollingInterval
    ),
    shareReplay(1),
    tap((data) => console.log(data))
  );

  update(updates: Partial<TodoSettingsOptions>) {
    this.settings$$.next(updates);
  }
}
