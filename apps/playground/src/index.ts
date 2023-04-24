import { Observable, timer } from 'rxjs';
// console.log('Moin');

// const myObservable = new Observable(function subscribe(observer) {
//   const interval = setInterval(() => {
//     observer.next(1);
//   }, 1000);
//   // observer.next(2);
//   // observer.error('Arrgh');
//   // observer.next(3);
//   // observer.next(4);
//   return function unsubscribe() {
//     clearInterval(interval);
//   };
// });

const myObservable = timer(3000, 1000);

const foo = myObservable.subscribe({
  next: (data) => console.log('first', data),
  error: (err) => console.error(err),
  complete: () => console.info('Done')
});
setTimeout(() => foo.unsubscribe(), 5000);

setTimeout(() => {
  const bar = myObservable.subscribe({
    next: (data) => console.log('second', data),
    error: (err) => console.error(err),
    complete: () => console.info('Done')
  });

  setTimeout(() => bar.unsubscribe(), 5000);
}, 3000);
