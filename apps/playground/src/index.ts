import { Observable } from 'rxjs';

// Create observable
const helloWorld$ = new Observable(function subscribe(observer) {
  observer.next(1);
  observer.next(2);
  observer.next(3);
  observer.next(4);
  observer.error('Ouch!');
  observer.next(5);
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
