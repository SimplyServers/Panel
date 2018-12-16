import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService} from '../../../core/services/authentication.service';
import {SelectedServerService} from '../../../core/services/selected-server.service';
import {ServerDetails} from '../../../core/models/server-details';
import {NotifierService} from 'angular-notifier';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-panel-subowners',
  templateUrl: './panel-subowners.component.html',
  styleUrls: ['./panel-subowners.component.scss']
})
export class PanelSubownersComponent implements OnInit, OnDestroy {
  @ViewChild('addModal', {read: ElementRef}) addModal: ElementRef;

  currentServer: ServerDetails;
  subUsers: any;

  loading = true;
  error: string;
  addLoading = false;
  addSubmitted = false;
  addForm: FormGroup;

  selectedServerEmitter: Subject<any>;

  constructor(private formBuilder: FormBuilder, private auth: AuthenticationService, private selectedServer: SelectedServerService, private notify: NotifierService, private router: Router) {
  }

  ngOnInit() {
    this.addForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email, Validators.maxLength(50)])],
    });

    if(this.selectedServer.getCurrentServer() !== undefined) {
      this.loadSubusers();

      //On server update
      this.selectedServerEmitter = this.selectedServer.serverEmitter.subscribe(() => {
        this.loadSubusers();
      });
    }
  }

  ngOnDestroy() {
    if(this.selectedServerEmitter !== undefined)
      this.selectedServerEmitter.unsubscribe();
  }

  loadSubusers(){
    this.currentServer = this.selectedServer.getCurrentServer();

    this.loading = false;
    if(!this.currentServer.isOwner){
      this.router.navigateByUrl('/panel');
    }

    this.subUsers = this.currentServer.sub_owners;
  }

  removeUser(id) {
    this.auth.removeSubuser(this.currentServer._id, id).subscribe(() => {
      this.selectedServer.updateCache(true, () => {
        this.selectedServer.reloadCurrentServer();
      });
    }, (err) => {
      this.notify.notify('error', 'Failed to remove subuser; ' + err.error.msg);
    });
  }

  addUser() {
    this.addSubmitted = true;
    if (this.addForm.invalid) {
      return;
    }
    this.addLoading = true;
    this.auth.addSubuser(this.currentServer._id, this.addForm.controls.email.value).subscribe(() => {
      this.selectedServer.updateCache(true, () => {
        this.selectedServer.reloadCurrentServer();
        this.addSubmitted = false;
        this.addLoading = false;
        this.addModal.nativeElement.click();
      })

    }, (err) => {
      this.error = err.error.msg;
    });
  }
}
