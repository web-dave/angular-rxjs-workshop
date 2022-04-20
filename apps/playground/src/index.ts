import { Observable, timer } from 'rxjs';

const obs$ = timer(3000, 2000);

const sub = obs$.subscribe({
  next: (data) => console.log(1, data),
  error: (err) => console.error(err),
  complete: () => console.info('Fertsch')
});
setTimeout(() => {
  const sub2 = obs$.subscribe({
    next: (data) => console.log(2, data),
    error: (err) => console.error(err),
    complete: () => console.info('Fertsch')
  });
  setTimeout(() => sub2.unsubscribe(), 6000);
}, 2000);

setTimeout(() => sub.unsubscribe(), 6000);
