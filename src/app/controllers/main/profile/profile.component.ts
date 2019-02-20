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
    this.loading = false;
    this.auth.getUserProfile().then(data => {
      this.loading = false;
      this.data = data;
    });
  }

}
