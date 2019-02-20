import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../../../services/auth.service';
import {PasswordValidation} from '../../../password-validation';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  changeForm: FormGroup;
  loading = false;
  submitted = false;
  error: string;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private auth: AuthService) {
  }

  ngOnInit() {
    this.changeForm = this.formBuilder.group({
      cPassword: ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
      password: ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
      confirmPassword: ['', Validators.required],
    }, {
      validator: PasswordValidation.MatchPassword
    });
  }

  onSubmit = async (): Promise<void> => {
    this.submitted = true;
    if (this.changeForm.invalid) {
      return;
    }
    this.loading = true;

    try {
      await this.auth.changePassword(this.changeForm.controls.cPassword.value, this.changeForm.controls.password.value);
      this.router.navigateByUrl('/account');
    } catch (e) {
      this.error = e;
    }

    this.loading = false;
    this.submitted = false;
  };

}
