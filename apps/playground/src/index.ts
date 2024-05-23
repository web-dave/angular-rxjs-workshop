import { Observable, timer } from 'rxjs';

// Create observable
const helloWorld$ = new Observable(function subscribe(observer) {
  let i = -1;
  const intRef = setInterval(() => {
    i++;
    observer.next(i);
    console.log('subcribe', i);
  }, 1000);
  return function () {
    clearInterval(intRef);
  };
});

// Subscribe to an observable
// const sub = helloWorld$.subscribe({
//   next(x) {
//     console.log('Oberserver', x);
//   },
//   error(err) {
//     console.error(err);
//   },
//   complete() {
//     console.log('done');
//   }
// });
// setTimeout(() => sub.unsubscribe(), 5000);

const timer$ = timer(5000, 2000);

const sub = timer$.subscribe({
  next: (v) => console.log(v)
});

setTimeout(() => sub.unsubscribe(), 9200);
//timer(9200).subscribe(() => sub.unsubscribe());
