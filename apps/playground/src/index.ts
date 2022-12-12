import { Observable, Observer } from 'rxjs';

const myO$ = {
  subscribe: (observer) => {
    let i = 0;
    setInterval(() => {
      observer.next(i);
      i++;
    }, 1000);
  }
};

const myObs$ = new Observable((observer) => {
  let i = 0;
  setInterval(() => {
    observer.next(i);
    i++;
  }, 1000);
  // observer.next(1);
  // observer.next(2);
  // observer.next(3);
  // observer.next(4);
  // observer.complete();
  // // observer.error(new Error('Ouch!'));
  // observer.next(5);
});

const myObserver: Observer<number> = {
  next: (data) => console.log(data),
  error: (err) => console.error(err),
  complete: () => console.info('Done')
};

myO$.subscribe(myObserver);
