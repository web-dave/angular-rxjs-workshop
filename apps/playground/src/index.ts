import { Observable, PartialObserver } from 'rxjs';
console.log('Hallo');
const myObs = new Observable(function (observer: PartialObserver<string>) {
  const interval = setInterval(() => {
    observer.next('Hi');
    console.log(1);
  }, 1000);
  return function () {
    clearInterval(interval);
  };
  // observer.next(1);
  // observer.next(2);
  // observer.next(3);
  // observer.error('Arrrrgh!');
  // observer.next(4);
  // observer.next(5);
  // observer.complete();
});

const sub = myObs.pipe().subscribe({
  next: (data) => console.log(data),
  error: (data) => console.error(data),
  complete: () => console.log('Done')
});

setTimeout(() => sub.unsubscribe(), 5000);
