import { Observable, Observer, Subscriber } from 'rxjs';

const numbers$ = new Observable(function subscribe(
  observer: Partial<Observer<number>>
) {
  observer.next(1);
  observer.next(2);
  // observer.complete();
  observer.error('Ouch');
  observer.next(3);
  observer.next(4);
});

numbers$.subscribe({
  next: (v) => console.log(v),
  error: (err) => console.error(err),
  complete: () => console.info('Done')
});
