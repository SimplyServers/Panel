import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../../../core/services/authentication.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TokenPayload} from '../../../core/models/token-payload';
import {ServerDetails} from '../../../core/models/server-details';
import {Router} from '@angular/router';

@Component({
  selector: 'app-panel-create',
  templateUrl: './panel-create.component.html',
  styleUrls: ['./panel-create.component.scss']
})
export class PanelCreateComponent implements OnInit {

  serverPlans: object;

  createForm: FormGroup;
  loading = false;
  submitted = false;
  error: string;

  server: ServerDetails = {
    preset: '',
    name: '',
    motd: ''
  };

  constructor(private formBuilder: FormBuilder, private auth: AuthenticationService, private router: Router) {
  }

  ngOnInit() {
    this.createForm = this.formBuilder.group({
      preset: ['', Validators.compose([Validators.required, Validators.maxLength(30)])],
      name: ['', Validators.compose([Validators.required, Validators.maxLength(20)])],
      motd: ['', Validators.compose([Validators.required, Validators.maxLength(100)])]
    });

    this.auth.getPresets().subscribe((data) => {
      this.serverPlans = data;
    });
  }

  onSubmit() {
    console.log("hey!");

    this.submitted = true;
    if(this.createForm.invalid){
      console.log(this.createForm);
      return;
    }
    this.loading = true;
    this.server.preset = this.createForm.controls.preset.value;
    this.server.name = this.createForm.controls.name.value;
    this.server.motd = this.createForm.controls.motd.value;

    console.log("passed");


    this.auth.createServer(this.server).subscribe(() => {
      this.router.navigateByUrl('/panel');
    }, (err) => {
      this.loading = false;
      this.submitted = false;
      this.error = err.error.msg;
    });

  }
}
