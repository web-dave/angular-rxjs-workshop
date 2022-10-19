import { Observable, timer } from 'rxjs';
const myObserver = {
  next: (data: number) => console.log(data),
  error: (err: Error) => console.error(err),
  complete: () => console.info('Done')
};

const myObs$ = new Observable(function subscribe(observer) {
  // producer
  //   console.log('Start');
  //   observer.next(1);
  //   observer.next(2);
  //   observer.error('Dough');

  //   observer.next(3);
  //   observer.next(4);
  //   observer.complete();

  //   observer.next(5);
  const int = setInterval(() => {
    observer.next('Ping');
  }, 1000);
  setTimeout(() => {
    clearInterval(int);
    observer.complete();
  }, 3000);

  return function unsubscribe() {
    clearInterval(int);
  };
});

// const myObservable$ = {
//   int: 0,
//   subscribe: function (observer) {
//     this.int =
//       setInterval(() => {
//         observer.next('Ping');
//       }, 1000) || 0;
//     return this.unsubscribe;
//   },
//   unsubscribe: function () {
//     clearInterval(this.int);
//   }
// };

// const sub = myObservable$.subscribe(myObserver);

const timer$ = timer(2000, 1000);
// const sub = timer$.subscribe(myObserver);
// timer$.subscribe((data) => console.log(data, 'first'));
// // timer$.subscribe((data) => console.log(data, 'second'));
// setTimeout(() => timer$.subscribe((data) => console.log(data, 'second')), 3000);
