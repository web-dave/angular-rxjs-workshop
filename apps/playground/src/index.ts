import { Observable } from 'rxjs';

const myObservable = {
  observer: null,
  subscribe: function (obs) {
    myObservable.observer = obs;
    setTimeout(() => myObservable.next('Hallo'), 3000);
  },
  next: function (value: any) {
    myObservable.observer.next(value);
  },
  complete: function () {
    myObservable.observer.complete();
    myObservable.observer = null;
    myObservable.next(44);
  },
  error: function (err) {
    myObservable.observer.error(err);
    myObservable.observer = null;
  }
};

const foo = myObservable.subscribe({
  next: (data) => console.log(data),
  complete: () => console.info('Done'),
  error: (err) => console.error(err)
});
