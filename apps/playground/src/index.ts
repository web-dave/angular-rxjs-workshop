import { Observable, Observer, timer } from 'rxjs';

console.log('Moin');

const obs = {
    value: null,
    observer: null,
    subscribe: function (observer) {
        obs.observer = observer;
    },
    next: (value) => {
        obs.observer.next(value);
    },
    complete: () => {
        obs.observer.complete();
        obs.observer = null;
    },
};

// const number$ = new Observable(
//     (observer: Observer<number>) => {
//         let i = 0;
//         // observer.next(1)
//         // observer.next(2)
//         // observer.error('Ouch')
//         // observer.next(3)
//         // observer.next(4)
//         const interval = setInterval(() => {
//             observer.next(i);
//             console.log('intern', i)

//             if (i >= 60) {
//                 observer.complete()
//                 clearInterval(interval)
//             }
//             i++;
//         }, 1000)

//         return function foo() {
//             clearInterval(interval)
//         }
//     }
// )

const number$ = timer(5000, 2000)

const sub = number$.subscribe({
    next: data => console.log(data),
    error: data => console.log(data),
    complete: () => console.log('Done'),
})

setTimeout(() => sub.unsubscribe(), 11000)
