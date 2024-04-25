import { Observable, Observer, Subscriber } from 'rxjs';

const numbers$ = new Observable(function subscribe(
  observer: Partial<Observer<number>>
) {
  let i = 0;
  const int = setInterval(() => {
    observer.next(i);
    console.log('internal', i);
    i++;
  }, 1000);

  return () => {
    clearInterval(int);
  };
});

const sub = numbers$.subscribe({
  next: (v) => console.log(v),
  error: (err) => console.error(err),
  complete: () => console.info('Done')
});

setTimeout(() => {
  sub.unsubscribe();

  console.log(sub);
}, 5000);
