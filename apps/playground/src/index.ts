import { Observable, timer } from 'rxjs';

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
  const interval = setInterval(() => {
    console.log('Interval');
    observer.next(1);
  }, 1000);
  return function unsubscribe() {
    clearInterval(interval);
  };
  // observer.complete();
  // observer.next(2);
  // observer.next(3);
  // observer.error('UFF!');
  // observer.next(4);
  // observer.next(5);
});

// const sub1 = numbers$.subscribe(
//   (data) => console.log('NEXT', data),
//   (err) => console.error('ERROR', err),
//   () => console.info('DONE')
// );

const numbers2$ = timer(300, 1000);
const sub = numbers2$.subscribe({
  next: (data) => console.log('NEXT', data),
  error: (err) => console.error('ERROR', err),
  complete: () => console.info('DONE')
});

setTimeout(() => {
  sub.unsubscribe();
}, 4000);
