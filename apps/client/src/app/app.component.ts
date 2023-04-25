import { Component, DoCheck } from '@angular/core';

@Component({
  selector: 'dos-root',
  template: '<router-outlet></router-outlet>\n'
})
export class AppComponent implements DoCheck {
  ngDoCheck(): void {
    console.log('DoCheck AppComponent');
  }
}
