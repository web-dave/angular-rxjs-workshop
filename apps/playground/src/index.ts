import { Observable, Subscriber } from 'rxjs';

const observable = {
  observer: null
};

const cnt = new Observable(function (observer: Subscriber<number>) {
  observer.next(1);
  observer.next(2);
  observer.next(3);
  observer.error('Ouch!');
  observer.next(4);
});

cnt.subscribe({
  error: (e) => console.error(e),
  complete: () => console.log('Done!'),
  next: (data) => console.log(data)
});
