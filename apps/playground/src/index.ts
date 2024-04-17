import { Observable, Observer, timer } from 'rxjs';

// const counter$ = new Observable((observer: Observer<number>) => {
//   // console.log('Start');
//   let i = 0;
//   const intId = setInterval(() => {
//     console.log('Interval läuft');
//     observer.next(i);
//     i++;
//   }, 1000);
//   return () => {
//     clearInterval(intId);
//   };
//   // observer.next(1);
//   // observer.next(2);
//   // observer.next(3);
//   // observer.next(4);
//   // observer.complete();
//   // observer.error('Argh');
// });

const counter$ = timer(2000, 1000);

const sub = counter$.subscribe({
  next: (data) => console.log(data),
  error: (e) => console.log(e),
  complete: () => console.log('Fertig!')
});

setTimeout(() => {
  sub.unsubscribe();
}, 5000);

// Deprecated! removed in V8
// counter$.subscribe(
//   (data) => console.log(data),
//   (e) => console.log(e)
// );
