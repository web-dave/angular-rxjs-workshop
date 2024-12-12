import { Observable } from 'rxjs';

const number$ = new Observable(function (observer) {
  let i = 0;
  const int = setInterval(() => {
    observer.next(i);
    console.log('intern', i);
    i++;
  }, 1000);

  return function () {
    clearInterval(int);
  };
  // observer.next(1);
  // observer.next(2);
  // observer.next(3);
  // observer.next(4);
  // observer.error('Ouch');
});

const sub = number$.subscribe({
  next: (data) => console.log(data),
  error: (err) => console.error(err),
  complete: () => console.info('Done')
});

setTimeout(() => sub.unsubscribe(), 3100);
