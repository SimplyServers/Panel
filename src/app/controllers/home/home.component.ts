import { Component, OnInit } from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {NotifierService} from 'angular-notifier';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('fade', [
      state('in', style({opacity: 1})),
      transition(':enter', [
        style({opacity: 0}),
        animate(2000 )
      ]),
      transition(':leave',
        animate(2000, style({opacity: 0})))
    ])
  ]
})
export class HomeComponent implements OnInit {

  constructor(private notify: NotifierService) { }

  ngOnInit() {
    this.notify.notify('info', "Hello there! We're currently in closed alpha. Bugs may occur.")
  }

}
