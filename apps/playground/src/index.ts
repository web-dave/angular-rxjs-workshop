import { Observable, timer } from 'rxjs';
// console.log(1, 2, 3, 4);

// const helloWorld$ = new Observable(function subscribe(observer) {
//   let i = 0;
//   const int = setInterval(() => {
//     console.info('producer', i);
//     observer.next(i);
//     i++;
//   }, 1000);
//   //   observer.next(1);
//   //   observer.next(2);
//   //   observer.next(3);
//   //   observer.next(4);
//   //   observer.complete();
//   return function unsubscribe() {
//     console.log('unsub');
//     clearInterval(int);
//   };
// });

const helloWorld$ = timer(5000, 2000);
// helloWorld$.
const sub = helloWorld$.subscribe({ next: (data) => console.log(data) });
setTimeout(() => sub.unsubscribe(), 10000);

const myObservable = {
  oberservers: [],
  subscribe: function (observer) {
    this.oberservers.push(observer);
    ////////////////////////////////////////
    // producer
    fetch('')
      .then((data) => {
        this.oberservers.forEach((element) => {
          element.next(data);
        });
      })
      .catch((err) =>
        this.oberservers.forEach((element) => {
          element.error(err);
        })
      );
    /////////////////////////////////////////////
  }
};
