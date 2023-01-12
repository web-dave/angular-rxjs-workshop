import { Observable } from 'rxjs';

const myObs = {
  observer: null,
  subscribe: (observer) => {
    myObs.observer = observer;
    setInterval(() => myObs.observer?.next('Hallo!'), 1500);
    // setTimeout(() => myObs.observer.next('Hallo!'), 1500);
    // setTimeout(() => myObs.observer.next('Adesso'), 1900);
    return () => (myObs.observer = null);
  }
};
const sub = myObs.subscribe({
  next: (i) => console.info(i)
});
setTimeout(() => sub(), 5000);
