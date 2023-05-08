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
  observer.next(1);
  observer.next(2);
  observer.next(3);
  observer.error('UFF!');
  observer.next(4);
  observer.next(5);
});

const sub = numbers$.subscribe({
  next: (data) => console.log(data),
  error: (err) => console.error('ERROR', err),
  complete: () => console.info('DONE')
});
