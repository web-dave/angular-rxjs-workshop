import { Observable } from 'rxjs';

const numbers$ = new Observable((observer) => {
  let i = -1;
  const int = setInterval(() => {
    i++;
    observer.next(i);
    console.log('interval', i);
  }, 1000);

  return () => {
    clearInterval(int);
  };
});

const sub = numbers$.subscribe({
  next: (data) => console.log('N', data),
  error: (data) => console.log('E', data),
  complete: () => console.log('C')
});

setTimeout(() => sub.unsubscribe(), 3000);
