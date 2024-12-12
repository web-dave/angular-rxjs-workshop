import { Observable, timer } from 'rxjs';

// const number$ = new Observable(function (observer) {
//   let i = 0;
//   const int = setInterval(() => {
//     observer.next(i);
//     console.log('intern', i);
//     i++;
//   }, 1000);

//   return function () {
//     clearInterval(int);
//   };
// });

const number$ = timer(5000, 2000);

const sub = number$.subscribe({
  next: (data) => console.log(data),
  error: (err) => console.error(err),
  complete: () => console.info('Done')
});

setTimeout(() => sub.unsubscribe(), 11000);
