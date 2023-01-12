import { Observable, shareReplay, timer } from 'rxjs';

const _myObserveable = new Observable(function subscribe(observer) {
  const int = setInterval(() => {
    if (!subscription.closed) {
      observer.next(1);
      console.warn('Achtung');
    } else {
      clearInterval(int);
    }
  }, 1000);
  // observer.next(2);
  // observer.next(3);
  // observer.complete();
  // observer.error('Ouch!');
  // observer.next(4);
  // return function unsubscribe() {
  //   clearInterval(int);
  // };
});

const myObserveable = timer(10, 1000).pipe(
  shareReplay({ refCount: true, bufferSize: 1 })
);

const subscription = myObserveable.subscribe({
  next: (n) => console.log('A', n),
  error: (err) => console.error(err),
  complete: () => console.info('Complete!')
});
let sub2;
setTimeout(
  () =>
    subscription.add(
      myObserveable.subscribe({
        next: (n) => console.log('B', n),
        error: (err) => console.error(err),
        complete: () => console.info('Complete!')
      })
    ),
  3000
);
setTimeout(() => {
  subscription.unsubscribe();
  myObserveable.subscribe({
    next: (n) => console.log('C', n),
    error: (err) => console.error(err),
    complete: () => console.info('Complete!')
  });
}, 7000);
/*
const myObs = {
  observer: null,
  subscribe: (observer) => {
    myObs.observer = observer;
    setInterval(() => myObs.observer?.next('Hallo!'), 1500);
    // setTimeout(() => myObs.observer.next('Hallo!'), 1500);
    // setTimeout(() => myObs.observer.next('Adesso'), 1900);
    return () => (myObs.observer = null);
  }
};
const sub = myObs.subscribe({
  next: (i) => console.info(i)
});
setTimeout(() => sub(), 5000);
*/
