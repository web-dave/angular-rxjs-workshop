import { Observable, PartialObserver } from 'rxjs';
console.log('Hallo');
const myObs = new Observable(function (observer: PartialObserver<number>) {
  observer.next(1);
  observer.next(2);
  observer.next(3);
  observer.next(4);
  observer.next(5);
  observer.complete();
});

myObs.subscribe({
  next: (data) => console.log(data),
  error: (data) => console.error(data),
  complete: () => console.log('Done')
});
