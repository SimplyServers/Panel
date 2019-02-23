import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  data: any;
  loading = true;

  constructor(private auth: AuthService) {
  }

  ngOnInit() {
    this.loading = true;
    this.auth.getUserProfile().then(data => {
      console.log("got user!" + JSON.stringify(data));
      this.data = data.user;
      this.loading = false;
    });
  }

}
