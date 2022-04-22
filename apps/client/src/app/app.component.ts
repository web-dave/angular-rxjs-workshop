import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'dos-root',
  template: `
    <nav>
      <h1><a routerLink="start">start</a></h1>
      <h1><a routerLink="todos">todos</a></h1>
      <h1><a routerLink="matcha1">Matcha 1</a></h1>
      <h1><a routerLink="matcha2">Matcha 2</a></h1>
      <h1><a routerLink="matcha3">Matcha 3</a></h1>
    </nav>

    <input type="text" (input)="navigateTo($event)" />
    <router-outlet></router-outlet>
  `
})
export class AppComponent {
  constructor(private router: Router) {}
  navigateTo(event: InputEvent) {
    console.log((event.target as HTMLInputElement).value);
    this.router.navigate([
      'matcha-' + (event.target as HTMLInputElement).value
    ]);
  }
}
