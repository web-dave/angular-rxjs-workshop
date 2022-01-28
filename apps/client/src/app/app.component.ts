import { Component } from '@angular/core';

@Component({
  selector: 'dos-root',
  template: `
    <router-outlet></router-outlet>

    <router-outlet name="footer"></router-outlet>
  `
})
export class AppComponent {}
