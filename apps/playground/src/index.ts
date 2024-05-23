import { Observable } from 'rxjs';

// Create observable
const helloWorld$ = new Observable(function subscribe(observer) {
  observer.next(1);
  observer.next(2);
  observer.error('Ouch!');
  observer.next(3);
  observer.next(4);
});

// Subscribe to an observable
helloWorld$.subscribe({
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
