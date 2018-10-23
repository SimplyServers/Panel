import { Component } from '@angular/core';
import {Router, RoutesRecognized} from "@angular/router";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private router: Router, private titleService: Title) {
    router.events.subscribe(event => { //Check for route change.
      if (event instanceof RoutesRecognized) {
        let route = event.state.root.firstChild;
        if(route.data.title) { //Check to see if the route is assigned a title
          this.titleService.setTitle("Simply Servers | " + route.data.title); //Yes, update the window.title to reflect it.
        }else{
          this.titleService.setTitle("Simply Servers"); //No? Well, firstly i must of messed up. Just set it to the default.
        }
      }
    });
  }
}
