import { Observable } from 'rxjs';

// Create observable
const helloWorld$ = new Observable(function subscribe(observer) {
  let i = 0;
  const interval = setInterval(() => {
    i++;
    observer.next(i);
    console.log('Interval value', i);
  }, 1000);

  return () => {
    clearInterval(interval);
  };
  // observer.next(1);
  // observer.next(2);
  // observer.next(3);
  // observer.next(4);
  // observer.complete();
  // observer.error('Help!');
});

// Subscribe to an observable
const sub = helloWorld$.subscribe({
  next(x) {
    console.log(x);
  },
  error(err) {
    console.error(err);
  },
  complete() {
    console.log('done');
  }
});

setTimeout(() => {
  sub.unsubscribe();
}, 3000);
