import { Observable, timer } from 'rxjs';

// Create observable
const helloWorld$ = timer(5000, 2000);
// const helloWorld$ = new Observable(function subscribe(observer) {
//   //   observer.next(1);
//   //   observer.next(2);
//   //   observer.next(3);
//   //   observer.error('Aaaaargh');
//   //   observer.complete();
//   //   observer.next(4);
//   let i = 0;
//   const interv = setInterval(() => {
//     i++;
//     console.log('inter', i);
//     observer.next(i);
//   }, 1000);

//   return function unsubscribe() {
//     clearInterval(interv);
//   };
// });

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

setTimeout(() => sub.unsubscribe(), 8000);
