import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../../../../services/legacy/authentication.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ServerPayload} from '../../../../core/models/legacy/server-payload';
import {SelectedServerService} from '../../../../services/legacy/selected-server.service';

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

  constructor(private formBuilder: FormBuilder, private auth: AuthenticationService, private router: Router, private selectedServer: SelectedServerService) {
  }

  ngOnInit() {
    if (this.selectedServer.ownsOne) {
      this.router.navigateByUrl('/panel');
      return;
    }

    this.createForm = this.formBuilder.group({
      preset: ['', Validators.compose([Validators.required, Validators.maxLength(30)])],
      name: ['', Validators.compose([Validators.required, Validators.maxLength(20)])],
      motd: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
      recaptchaReactive: ['', [Validators.required]]
    });

    this.auth.getPresets().subscribe((data) => {
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

    this.auth.createServer(this.server).subscribe(() => {
      this.selectedServer.updateCache(false, () => {
        this.router.navigateByUrl('/panel');
      });
    }, (err) => {
      this.loading = false;
      this.error = err;
    });

  }
}