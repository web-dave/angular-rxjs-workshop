import { Observable } from 'rxjs';

const number$ = new Observable(function (observer) {
  observer.next(1);
  observer.next(2);
  observer.next(3);
  observer.next(4);
  observer.error('Ouch');
});

number$.subscribe({
  next: (data) => console.log(data),
  error: (err) => console.error(err),
  complete: () => console.info('Done')
});
