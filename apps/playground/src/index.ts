import { share, shareReplay, timer } from 'rxjs';

// Create observable
// const helloWorld$ = new Observable(function (observer) {
//   let i = 0;
//   const int = setInterval(() => {
//     console.log('intern', i);
//     observer.next(i++);
//   }, 1000);

//   return () => {
//     clearInterval(int);
//   };
// });

const helloWorld$ = timer(500, 1000).pipe(shareReplay(4));

// Subscribe to an observable
const sub = helloWorld$.subscribe({
  next(x) {
    console.log('ens', x);
  },
  error(err) {
    console.error('ERROR', err);
  },
  complete() {
    console.log('done');
  }
});
let sub1;
setTimeout(() => {
  sub1 = helloWorld$.subscribe({
    next(x) {
      console.log('ZWO', x);
    },
    error(err) {
      console.error('ERROR', err);
    },
    complete() {
      console.log('done');
    }
  });
}, 7000);

setTimeout(() => {
  sub.unsubscribe();
  sub1?.unsubscribe();
}, 6000);
