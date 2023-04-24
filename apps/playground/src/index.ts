import { Observable } from 'rxjs';
// console.log('Moin');

const myObservable = new Observable(function subscribe(observer) {
  const interval = setInterval(() => {
    observer.next(1);
  }, 1000);
  // observer.next(2);
  // observer.error('Arrgh');
  // observer.next(3);
  // observer.next(4);
  return function unsubscribe() {
    clearInterval(interval);
  };
});

const foo = myObservable.subscribe({
  next: (data) => console.log(data),
  error: (err) => console.error(err),
  complete: () => console.info('Done')
});

setTimeout(() => foo.unsubscribe(), 4000);
