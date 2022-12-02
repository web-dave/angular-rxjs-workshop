import { Observable, timer } from 'rxjs';

const myObservable = {
  observer: [],
  subscribe: function (o) {
    myObservable.observer.push(o);
  },
  next: (v) => myObservable.observer.forEach((o) => o.next(v))
};

// proucer
myObservable.next('Hallo');

// myObservable.subscribe({ next: (i) => console.log(i) });

// const O$ = new Observable(function subscribe(observer) {
//   // observer.next(1);
//   // observer.next(2);
//   // observer.next(3);
//   // observer.next(4);
//   // observer.error(new Error('Meeeeh!'));
//   // observer.next(5);
//   const interval = setInterval(() => {
//     console.log('Interval!');

//     observer.next('Moin');
//   }, 1000);
//   return function unsunbscribe() {
//     console.log('Unsubscribe');

//     clearInterval(interval);
//   };
// });
const O$ = timer(5000, 2000);
const o$ = O$.subscribe({
  next: (data) => console.log('NEXT:', data),
  error: (data) => console.log('error:', data),
  complete: () => console.log('complet')
});

setTimeout(() => o$.unsubscribe(), 15000);
