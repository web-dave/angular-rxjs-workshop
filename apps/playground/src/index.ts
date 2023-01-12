import { Observable } from 'rxjs';

const myObserveable = new Observable(function subscribe(observer) {
  observer.next(1);
  observer.next(2);
  observer.next(3);
  // observer.complete();
  observer.error('Ouch!');
  observer.next(4);
});

const subscription = myObserveable.subscribe({
  next: (n) => console.log(n),
  error: (err) => console.error(err),
  complete: () => console.info('Complete!')
});

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
