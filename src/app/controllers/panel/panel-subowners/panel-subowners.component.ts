import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ResponsiveServerPage} from '../../panel-controller.serverpage';
import {Server} from '../../../models/server.model';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-panel-subowners',
  templateUrl: './panel-subowners.component.html',
  styleUrls: ['./panel-subowners.component.scss']
})
export class PanelSubownersComponent extends ResponsiveServerPage implements OnInit, OnDestroy{
  @ViewChild('addModal', {read: ElementRef}) addModal: ElementRef;
  subUsers: any;
  error: string;
  addLoading = false;
  addSubmitted = false;
  addForm: FormGroup;

  ngOnInit(): void {
    super.ngInit();
  }
  ngOnDestroy(): void {
    super.ngUnload();
  }

  loadData = async (): Promise<void> => {
    this.addForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email, Validators.maxLength(50)])],
    });

    if (!(this.currentServer.selectedServer.value.details._owner._id === this.auth.user.id)) {
      this.router.navigateByUrl('/panel');
    }

    this.subUsers = this.currentServer.selectedServer.value.details.sub_owners;
  };

  private removeUser = async (id: String): Promise<void> => {

    try {
      await this.currentServer.selectedServer.value.removeSubuser(id);
      await this.currentServer.reloadCurrentServer();
    } catch (e) {
      this.notify.notify('error', 'Failed to remove subuser; ' + e);
    }
  };

  private addUser = async (email: String): Promise<void> => {

    try {
      await this.currentServer.selectedServer.value.addSubuser(email);
      await this.currentServer.reloadCurrentServer();
      this.addModal.nativeElement.click();
    } catch (e) {
      this.error = e;
    }
    this.addSubmitted = false;
    this.addLoading = false;
  };
}
