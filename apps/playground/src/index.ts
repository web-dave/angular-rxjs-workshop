import { Observable, timer } from 'rxjs';

// const obs = {
//   value: 0,
//   observer: (v) => {},
//   subscribe: function (observer) {
//     obs.observer = observer;
//     obs.next(0);
//   },
//   next: function (v) {
//     obs.value = v;
//     obs.observer(obs.value);
//   }
// };
// obs.subscribe((value) => console.log(value));

// obs.next(1);

// Create observable
// const helloWorld$ = new Observable(function subscribe(observer) {
//   let i = 0;
//   const interval = setInterval(() => {
//     i++;
//     observer.next(i);
//     console.log('Interval value', i);
//   }, 1000);

//   return () => {
//     clearInterval(interval);
//   };
//   // observer.next(1);
//   // observer.next(2);
//   // observer.next(3);
//   // observer.next(4);
//   // observer.complete();
//   // observer.error('Help!');
// });

const helloWorld$ = timer(2000, 1000);
// Subscribe to an observable
const sub = helloWorld$.subscribe({
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

setTimeout(() => {
  sub.unsubscribe();
}, 5000);
