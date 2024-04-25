import { timer } from 'rxjs';

const numbers$ = timer(5000, 2000);

const sub = numbers$.subscribe({
  next: (v) => console.log(v),
  error: (err) => console.error(err),
  complete: () => console.info('Done')
});

setTimeout(() => {
  sub.unsubscribe();
}, 11000);
