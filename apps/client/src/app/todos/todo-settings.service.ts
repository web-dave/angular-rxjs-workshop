import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, scan, shareReplay, tap } from 'rxjs/operators';

export interface TodoSettingsOptions {
  isPollingEnabled: boolean;
  pollingInterval: number;
}

@Injectable({ providedIn: 'root' })
export class TodoSettings {
  private settings$$ = new BehaviorSubject<Partial<TodoSettingsOptions>>({
    isPollingEnabled: true,
    pollingInterval: 5000
  });

  settings$ = this.settings$$.pipe(
    scan((prev, next) => ({ ...prev, ...next })),
    distinctUntilChanged(
      (prev, curr) =>
        curr.isPollingEnabled == prev.isPollingEnabled &&
        curr.pollingInterval == prev.pollingInterval
    ),
    tap((data) => console.log(data)),
    shareReplay(1)
  );

  update(updates: Partial<TodoSettingsOptions>) {
    this.settings$$.next(updates);
  }
}
