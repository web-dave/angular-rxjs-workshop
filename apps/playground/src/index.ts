import { Observable } from 'rxjs';

const obs$ = new Observable(function subscribe(observer) {
  observer.next(1);
  observer.next(2);
  observer.next(3);
  observer.next(4);
  observer.complete();
  observer.error(new Error('Meeeeh'));
  observer.next(4.1);
});

obs$.subscribe({
  next: (data) => console.log(data),
  error: (err) => console.error(err),
  complete: () => console.info('Fertsch')
});
