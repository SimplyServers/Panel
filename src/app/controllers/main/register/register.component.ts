import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PasswordValidation} from '../../../password-validation';
import {TokenPayload} from '../../../../core/models/legacy/token-payload';
import {AuthenticationService} from '../../../services/legacy/authentication.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error: string;
  newUser: TokenPayload = {
    email: '',
    password: '',
    username: ''
  };

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute,
              private router: Router, private auth: AuthenticationService) {
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      password: ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
      confirmPassword: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, Validators.email, Validators.maxLength(50)])],
      username: ['', Validators.compose([Validators.required, Validators.maxLength(20)])],
    }, {
      validator: PasswordValidation.MatchPassword
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || undefined;
  }

  onSubmit() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }
    this.loading = true;
    this.newUser.username = this.registerForm.controls.username.value;
    this.newUser.email = this.registerForm.controls.email.value;
    this.newUser.password = this.registerForm.controls.password.value;
    this.auth.register(this.newUser).subscribe((data) => {
      if (this.returnUrl === undefined) {
        this.router.navigateByUrl('/login'); // Good login! Return to dash w/o returnUrl
      } else {
        this.router.navigateByUrl('/login?returnUrl=' + this.returnUrl); // Good login! Return to dash /w returnUrl
      }
    }, (err) => {
      this.error = err;
      this.loading = false;
    });
  }

}
