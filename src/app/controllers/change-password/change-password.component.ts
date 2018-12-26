import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {PasswordValidation} from '../../core/password-validation';
import {AuthenticationService} from '../../core/services/authentication.service';

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

  constructor(private formBuilder: FormBuilder, private router: Router, private auth: AuthenticationService) {
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

  onSubmit() {
    this.submitted = true;
    if (this.changeForm.invalid) {
      return;
    }
    this.loading = true;
    // this.auth.register(this.newUser).subscribe((data) => {
    //   if(this.returnUrl === undefined){
    //     this.router.navigateByUrl('/login'); //Good login! Return to dash w/o returnUrl
    //   }else{
    //     this.router.navigateByUrl('/login?returnUrl=' + this.returnUrl); //Good login! Return to dash /w returnUrl
    //   }
    // }, (err) => {
    //   this.error = err;
    // });
    this.auth.changePassword(this.changeForm.controls.cPassword.value, this.changeForm.controls.password.value).subscribe(data => {
      this.router.navigateByUrl('/account');
    }, (err) => {
      this.error = err;
      this.loading = false;
      this.submitted = false;
    });
  }

}
