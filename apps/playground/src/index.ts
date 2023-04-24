import { Observable } from 'rxjs';
// console.log('Moin');

const myObservable = new Observable(function subscribe(observer) {
  observer.next(1);
  observer.next(2);
  observer.error('Arrgh');
  observer.next(3);
  observer.next(4);
});

myObservable.subscribe({
  next: (data) => console.log(data),
  error: (err) => console.error(err),
  complete: () => console.info('Done')
});
