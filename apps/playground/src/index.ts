import { Observable, Observer, Subscriber } from 'rxjs';

const numbers$ = new Observable(function subscribe(
  observer: Partial<Observer<number>>
) {
  let i = 0;
  setInterval(() => {
    observer.next(i);
    i++;
  }, 1000);
});

numbers$.subscribe({
  next: (v) => console.log(v),
  error: (err) => console.error(err),
  complete: () => console.info('Done')
});
