import { Observable, Subscriber } from 'rxjs';
import { threadId } from 'worker_threads';

const myObservable = {
  observer: null,
  subscribe: (o) => {
    myObservable.observer = o;
    // observer.next(1);
    myObservable.observer.next(2);
    myObservable.observer.next(3);
  },
  _complete: () => {
    myObservable.observer = null;
  }
};

const numbers$ = new Observable(function subscribe(observer) {
  setInterval(() => {
    console.log('Interval');
    observer.next(1);
  }, 1000);
  observer.complete();
  // observer.next(2);
  // observer.next(3);
  // observer.error('UFF!');
  // observer.next(4);
  // observer.next(5);
});

const sub = numbers$.subscribe({
  next: (data) => console.log('NEXT', data),
  error: (err) => console.error('ERROR', err),
  complete: () => console.info('DONE')
});
