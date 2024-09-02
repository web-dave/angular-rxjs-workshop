import { Observable } from 'rxjs';

const numbers$ = new Observable((observer) => {
  observer.next(1);
  observer.next(2);
  observer.next(3);
  observer.complete();
  observer.next(4);
});

numbers$.subscribe({
  next: (data) => console.log('N', data),
  error: (data) => console.log('E', data),
  complete: () => console.log('C')
});
