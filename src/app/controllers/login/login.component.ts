import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {TokenPayload} from "../../core/models/token-payload";
import {AuthenticationService} from "../../core/services/authentication.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  credentials: TokenPayload = {
    email: '',
    password: ''
  };

  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error: string;

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute,
              private router: Router, private auth: AuthenticationService) {
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.required]
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/panel';
  }

  onSubmit() {
    this.submitted = true;
    if(this.loginForm.invalid){
      return;
    }
    this.loading = true;
    this.credentials.email = this.loginForm.controls.email.value;
    this.credentials.password = this.loginForm.controls.password.value;
    this.auth.login(this.credentials).subscribe((data) => {

      console.log(data.status);

      //this.router.navigateByUrl(this.returnUrl); //Good login! Return to dash.
    }, (err) => {
      if(err.error.error) { //lol i love http
        this.error = err.error.msg;
      }
      this.loading = false;
    });

  }

}
