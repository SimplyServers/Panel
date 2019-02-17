import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService, ServerPayload} from '../../../../services/auth.service';
import {CurrentServerService} from '../../../../services/current-server.service';

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

  server: ServerPayload = {
    preset: '',
    name: '',
    motd: '',
    captcha: ''
  };

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private currentServer: CurrentServerService) {
  }

  ngOnInit() {
    if (this.currentServer.ownsOne) {
      this.router.navigateByUrl('/panel');
      return;
    }

    this.createForm = this.formBuilder.group({
      preset: ['', Validators.compose([Validators.required, Validators.maxLength(30)])],
      name: ['', Validators.compose([Validators.required, Validators.maxLength(20)])],
      motd: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
      recaptchaReactive: ['', [Validators.required]]
    });

    this.auth.getPresets().then(data => {
      this.serverPlans = data;
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.createForm.invalid) {
      return;
    }
    this.loading = true;
    this.server.preset = this.createForm.controls.preset.value;
    this.server.name = this.createForm.controls.name.value;
    this.server.motd = this.createForm.controls.motd.value;
    this.server.captcha = this.createForm.controls.recaptchaReactive.value;

    this.auth.createServer(this.server).then(() => {
      this.currentServer.updateCache().then(() => {
        this.router.navigateByUrl('/panel');
      })
    }).catch((err) => {
      this.error = err;
      this.loading = false;
    })

  }
}
