import { Observable, Observer, Subscriber } from 'rxjs';

const numbers$ = new Observable(function subscribe(
  observer: Partial<Observer<number>>
) {
  setInterval(() => observer.next(1), 1000);
});

numbers$.subscribe({
  next: (v) => console.log(v),
  error: (err) => console.error(err),
  complete: () => console.info('Done')
});
