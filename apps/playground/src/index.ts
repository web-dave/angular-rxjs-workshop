import { on } from 'events';
import { writeSync } from 'fs';
import { Observable } from 'rxjs';

const obs$ = new Observable(function subscribe(observer) {
  let i = 0;
  const intv = setInterval(() => {
    i++;
    observer.next(i);
    console.log('inner', i);
  }, 1000);

  return function unsubscribe() {
    clearInterval(intv);
  };
});
const http$ = new Observable(function subscribe(observer) {
  // ws.open(
  //     on_evnt=>(data => observer.next(data)),
  //     on_closed=> observer.complete())
  fetch('').then((data) => {
    observer.next(data);
    observer.complete();
  });
});

const sub = obs$.subscribe({
  next: (data) => console.log(data),
  error: (err) => console.error(err),
  complete: () => console.info('Fertsch')
});

setTimeout(() => sub.unsubscribe(), 4000);
