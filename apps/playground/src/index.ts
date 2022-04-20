import { Observable } from 'rxjs';

const obs$ = new Observable(function subscribe(observer) {
  let i = 0;
  const intv = setInterval(() => {
    i++;
    observer.next(i);
    console.log('inner', i);
  }, 1000);

  setTimeout(() => {
    observer.complete();
    clearInterval(intv);
  }, 3000);
  //   observer.next(2);
  //   observer.next(3);
  //   observer.next(4);
  //   observer.complete();
  //   observer.error(new Error('Meeeeh'));
  //   observer.next(4.1);
});

obs$.subscribe({
  next: (data) => console.log(data),
  error: (err) => console.error(err),
  complete: () => console.info('Fertsch')
});

const obj = {
  antwort: 42,
  antworten: function () {
    return this.antwort;
  },
  antworten2: () => {
    return this?.antwort;
  }
};
