import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ServerSocketManagerService} from '../../../core/services/server-socket-manager.service';
import {SelectedServerService} from '../../../core/services/selected-server.service';
import {AuthenticationService} from '../../../core/services/authentication.service';
import {NotifierService} from 'angular-notifier';
import {ServerDetails} from '../../../core/models/server-details';
import {Subject} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-panel-file-editor',
  templateUrl: './panel-file-editor.component.html',
  styleUrls: ['./panel-file-editor.component.scss']
})
export class PanelFileEditorComponent implements OnInit {

  newFile: boolean;

  currentServer: ServerDetails;
  selectedServerEmitter: Subject<any>;

  loading = false;
  blocked = false;

  editName: string;

  editForm: FormGroup;
  editLoading = false;
  editSubmitted = false;

  error: string;

  constructor(public serverSocket: ServerSocketManagerService,
              private selectedServer: SelectedServerService,
              private formBuilder: FormBuilder,
              private auth: AuthenticationService,
              private notify: NotifierService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    if (this.serverSocket.lastBlocked) {
      this.blocked = true;
      return;
    }
    this.updateContents();

    //On server update
    this.selectedServerEmitter = this.selectedServer.serverUpdateEmitter.subscribe(() => {
      this.updateContents();
    });
  }

  updateContents() {
    this.editForm = this.formBuilder.group({
      content: ['', Validators.compose([Validators.required, Validators.maxLength(10000)])],
    });
    this.currentServer = this.selectedServer.getCurrentServer();
    this.getContents();
  }

  getContents() {
    this.loading = true;
    this.activatedRoute.queryParams.subscribe(params => {
      let filePath = params['f'];
      this.editName = filePath;
      this.auth.getContents(this.currentServer._id, filePath).subscribe(data => {
        this.newFile = false;
        this.editForm.controls.content.setValue(data);
        this.loading = false;
      }, (err) => {
        if (err === 'File not found.') {
          this.newFile = true;
          this.editForm.controls.content.setValue('');
        } else {
          this.notify.notify('error', 'Failed to get contents of file. It will be overwritten if you choose to edit it.');
        }
        this.loading = false;
      });

    });
  }

  onEdit() {
    console.log('on edit');
    console.log(this.editForm.controls.content.value);

    this.editSubmitted = true;
    if (this.editForm.invalid) {
      return;
    }
    this.editLoading = true;

    this.auth.writeContents(this.currentServer._id, this.editName, this.editForm.controls.content.value).subscribe(() => {
      this.router.navigateByUrl('/panel/files');
    }, (err) => {
      this.error = err;
      this.editLoading = false;
    });

  }

}
