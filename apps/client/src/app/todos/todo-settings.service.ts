import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { WebSocketSubject } from 'rxjs/webSocket';
import { scan, shareReplay, tap } from 'rxjs/operators';

export interface TodoSettingsOptions {
  isPollingEnabled: boolean;
  pollingInterval: number;
}

@Injectable()
export class TodoSettings {
  // wss = new WebSocketSubject('ws://127.0.0.1:51499/');
  // sub = this.wss.subscribe((data) => console.log('wss:', data));
  private settings$$ = new BehaviorSubject<Partial<TodoSettingsOptions>>({
    isPollingEnabled: true,
    pollingInterval: 5000
  });

  send(data: Partial<TodoSettingsOptions>) {
    // this.wss.next(data);
  }

  settings$ = this.settings$$.pipe(
    scan((prev, next) => ({ ...prev, ...next })),
    shareReplay(1)
  );

  update(updates: Partial<TodoSettingsOptions>) {
    this.settings$$.next(updates);
  }
}
