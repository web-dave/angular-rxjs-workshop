import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'client-matcha',
  templateUrl: './matcha.component.html',
  styleUrls: ['./matcha.component.scss']
})
export class MatchaComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe((data) => console.log(data));
  }
}
