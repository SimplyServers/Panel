import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../../core/services/authentication.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  data: any;
  loading = true;

  constructor(private auth: AuthenticationService) {
  }

  ngOnInit() {
    this.auth.getUserData().subscribe(data => {
      this.loading = false;
      this.data = data;
    });
  }

}
