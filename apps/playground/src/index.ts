import { Observable, timer } from 'rxjs';

const numbers$ = timer(10, 2000);

const sub = numbers$.subscribe({
  next: (data) => console.log('N', data),
  error: (data) => console.log('E', data),
  complete: () => console.log('C')
});

setTimeout(() => sub.unsubscribe(), 5000);
