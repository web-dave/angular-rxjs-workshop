import { Observable } from 'rxjs';

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

const myObservable = new Observable(function subscribe(observer) {
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

const foo = myObservable.subscribe({
  next: (data) => console.log(data)
});

setTimeout(() => {
  foo.unsubscribe();
}, 4000);
// const foo_ = myObservable.subscribe({
//   next: (data) => console.log(data)
// });
// const foo__ = myObservable.subscribe({
//   next: (data) => console.log(data)
// });
