import { Observable, Subscriber } from 'rxjs';

const observable = {
  observer: null
};

const cnt = new Observable(function (observer: Subscriber<number>) {
  let i = 0;
  const int = setInterval(() => {
    observer.next(i);
    console.log('intern', i);
    i++;
  }, 1000);

  return () => {
    clearInterval(int);
  };
  // observer.next(1);
  // observer.next(2);
  // observer.next(3);
  // observer.error('Ouch!');
  // observer.next(4);
});

const sub = cnt.subscribe({
  error: (e) => console.error(e),
  complete: () => console.log('Done!'),
  next: (data) => console.log(data)
});
setTimeout(() => sub.unsubscribe(), 4000);
