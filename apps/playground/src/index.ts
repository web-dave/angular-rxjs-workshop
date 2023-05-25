import { Observable, timer } from 'rxjs';

// *****************************
// break down a observable
const myObservable_ = {
  observer: null,
  subscribe: function (obs) {
    myObservable_.observer = obs;
    myObservable_.observer.next(1);
  }
};
// *****************************

const myObservable__ = new Observable(function subscribe(observer) {
  // -----------
  // Producer
  // observer.next(1);
  // observer.next(2);
  // observer.next(3);
  // observer.complete();
  // observer.error('Huch!');
  // observer.next(4);
  // -----------
  const int = setInterval(() => {
    console.log('Interval');
    observer.next(1);
  }, 1000);
  return function unsubscribe() {
    clearInterval(int);
  };
  // -----------
});

const myObservable = timer(3000, 1000);

const foo = myObservable.subscribe({
  next: (data) => console.log(data)
});

setTimeout(() => {
  foo.unsubscribe();
}, 7000);
// setTimeout(() => {
//   const foo_ = myObservable.subscribe({
//     next: (data) => console.log(data)
//   });
// }, 2000);
// const foo__ = myObservable.subscribe({
//   next: (data) => console.log(data)
// });
