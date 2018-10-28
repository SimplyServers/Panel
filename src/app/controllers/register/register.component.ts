import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PasswordValidation} from "../../core/password-validation";
import {TokenPayload} from "../../core/models/token-payload";
import {AuthenticationService} from "../../core/services/authentication.service";
import {ActivatedRoute, Router} from "@angular/router";

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

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute,
              private router: Router, private auth: AuthenticationService) {
  }

  newUser: TokenPayload = {
    email: '',
    password: '',
    username: ''
  };

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      username: ['', Validators.required],
    }, {
      validator: PasswordValidation.MatchPassword
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/panel';
  }

  onSubmit(){
    this.submitted = true;
    if(this.registerForm.invalid){
      return;
    }
    this.loading = true;
    this.newUser.username = this.registerForm.controls.username.value;
    this.newUser.email = this.registerForm.controls.email.value;
    this.newUser.password = this.registerForm.controls.password.value;
    this.auth.register(this.newUser).subscribe((data) => {
      this.router.navigateByUrl('/login?returnUrl=' + this.returnUrl); //Good login! Return to dash.
    }, (err) => {
      this.error = err.error.msg;
    });
  }

}
