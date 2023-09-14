import { Observable, Observer } from 'rxjs';

const _myobs = {
  _observer: null,
  subscribe: (observer) => {
    _myobs._observer = observer;
    _myobs.next(7777);
  },
  next: (value) => {
    _myobs._observer.next(value);
  }
};

_myobs.subscribe({
  next: (data) => console.info(data)
});

const numbers$ = new Observable(function subscribe(observer: Observer<any>) {
  let i = 0;
  const interval = setInterval(() => {
    observer.next(i);
    i++;
  }, 1000);
  return function unsubscribe() {
    clearInterval(interval);
  };
});

const sub = numbers$.subscribe({
  next: (data) => console.log(data)
});
const sub_ = numbers$.subscribe(
  (data) => console.log(data),
  (err) => console.log(err),
  () => console.log()
);

setTimeout(() => {
  sub.unsubscribe();
}, 4000);
