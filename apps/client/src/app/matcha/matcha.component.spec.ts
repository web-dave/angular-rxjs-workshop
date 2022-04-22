import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchaComponent } from './matcha.component';

describe('MatchaComponent', () => {
  let component: MatchaComponent;
  let fixture: ComponentFixture<MatchaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatchaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
