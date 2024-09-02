import { Observable } from 'rxjs';

const numbers$ = new Observable((observer) => {
  let i = -1;
  setInterval(() => {
    i++;
    observer.next(i);
  }, 1000);
});

numbers$.subscribe({
  next: (data) => console.log('N', data),
  error: (data) => console.log('E', data),
  complete: () => console.log('C')
});
