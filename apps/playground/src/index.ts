import { Observable } from 'rxjs';

// Create observable
const helloWorld$ = new Observable(function subscribe(observer) {
  let i = -1;
  const intRef = setInterval(() => {
    i++;
    observer.next(i);
    console.log('subcribe', i);
  }, 1000);
  return function () {
    clearInterval(intRef);
  };
});

// Subscribe to an observable
const sub = helloWorld$.subscribe({
  next(x) {
    console.log('Oberserver', x);
  },
  error(err) {
    console.error(err);
  },
  complete() {
    console.log('done');
  }
});

setTimeout(() => sub.unsubscribe(), 5000);
