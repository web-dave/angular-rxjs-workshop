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
  observer.next(1);
  observer.next(2);
  observer.error('OH Fuuuuuck!');
  observer.next(3);
  observer.next(4);
});

numbers$.subscribe({
  next: (data) => console.log(data)
});
