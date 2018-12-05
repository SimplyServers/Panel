import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
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
  returnUrlSet = false;

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute,
              private router: Router, private auth: AuthenticationService) {
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.required]
    });
    if(this.route.snapshot.queryParams['returnUrl'])
      this.returnUrlSet = true;

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/panel';

    //Watch the router for changes (since the page isnt reloaded)
    this.router.events.subscribe((val) => {
      if(val instanceof NavigationEnd){
        this.returnUrlSet = this.route.snapshot.queryParams['returnUrl'];
      }
    });
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
      this.router.navigateByUrl(this.returnUrl); //Good login! Return to dash.
    }, (err) => {
      this.loading = false;
      this.submitted = false;
      this.error = err.error.msg;
    });

  }

}
