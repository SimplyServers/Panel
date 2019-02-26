import {Component, OnInit} from '@angular/core';
import {AuthService, UserProfile} from '../../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  data: UserProfile;
  loading = true;

  constructor(private auth: AuthService) {
  }

  ngOnInit() {
    this.loadProfile();
  }

  private loadProfile = async () => {
    this.loading = true;
    this.data = await this.auth.getUserProfile();
    this.loading = false;

  }
}
