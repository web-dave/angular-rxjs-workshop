import { Component } from '@angular/core';

@Component({
  selector: 'dos-root',
  template: '<router-outlet></router-outlet>\n'
})
export class AppComponent {
  baz = '';
  bar() {
    this.baz = 'BAZ';
  }
  foo() {
    setTimeout(() => this.bar(), 1);
  }
  constructor() {
    //messen start
    this.foo();
    // messen ende
  }
}
