import { Observable } from 'rxjs';

// Create observable
const helloWorld$ = new Observable(function (observer) {
  let i = 0;
  const int = setInterval(() => {
    console.log('intern', i);
    observer.next(i++);
  }, 1000);

  return () => {
    clearInterval(int);
  };
});

// Subscribe to an observable
const sub = helloWorld$.subscribe({
  next(x) {
    console.log(x);
  },
  error(err) {
    console.error('ERROR', err);
  },
  complete() {
    console.log('done');
  }
});

setTimeout(() => sub.unsubscribe(), 3000);
