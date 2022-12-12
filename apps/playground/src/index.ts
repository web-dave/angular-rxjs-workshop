import { Observable, Observer } from 'rxjs';

const myObs$ = new Observable((observer) => {
  observer.next(1);
  observer.next(2);
  observer.next(3);
  observer.next(4);
  observer.complete();
  // observer.error(new Error('Ouch!'));
  observer.next(5);
});

const myObserver: Observer<number> = {
  next: (data) => console.log(data),
  error: (err) => console.error(err),
  complete: () => console.info('Done')
};

myObs$.subscribe(myObserver);
