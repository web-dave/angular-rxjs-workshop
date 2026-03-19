import { Observable } from 'rxjs';

// Create observable
const helloWorld$ = new Observable(function subscribe(observer) {
  let i = 0;
  setInterval(() => {
    observer.next(i++);
  }, 1000);
});

// Subscribe to an observable
helloWorld$.subscribe({
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
