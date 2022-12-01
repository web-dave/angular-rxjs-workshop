import { Observable } from 'rxjs';

const myObservable = {
  observer: null,
  subscribe: function (o) {
    myObservable.observer = o;

    // producer
    setInterval(() => {
      myObservable.observer.next(1);
    }, 1500);
  }
};

// myObservable.subscribe({ next: (i) => console.log(i) });

const O$ = new Observable(function subscribe(observer) {
  observer.next(1);
  observer.next(2);
  observer.next(3);
  observer.next(4);
  observer.error(new Error('Meeeeh!'));
  observer.next(5);
});
O$.subscribe({
  next: (data) => console.log('NEXT:', data),
  error: (data) => console.log('error:', data),
  complete: () => console.log('complet')
});
