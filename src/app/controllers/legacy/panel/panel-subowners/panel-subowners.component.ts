import {Component, ElementRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ResponsiveServerPage} from '../../../panel-controller.serverpage';
import {Server} from '../../../../models/server.model';

@Component({
  selector: 'app-panel-subowners',
  templateUrl: './panel-subowners.component.html',
  styleUrls: ['./panel-subowners.component.scss']
})
export class PanelSubownersComponent extends ResponsiveServerPage {
  @ViewChild('addModal', {read: ElementRef}) addModal: ElementRef;

  subUsers: any;

  error: string;
  addLoading = false;
  addSubmitted = false;
  addForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    super();
  }

  loadData = async (): Promise<void> => {
    this.addForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email, Validators.maxLength(50)])],
    });

    if (!this.currentServer.currentServer.details.isOwner) {
      this.router.navigateByUrl('/panel');
    }

    this.subUsers = (await this.currentServer.getCurrentServer()).details.sub_owners;
  };

  private removeUser = async (id: String): Promise<void> => {

    const server: Server = await this.currentServer.getCurrentServer();
    try {
      await server.removeSubuser(id);
      await this.currentServer.updateCurrentServerData();
    } catch (e) {
      this.notify.notify('error', 'Failed to remove subuser; ' + e);
    }
  };

  private addUser = async (email: String): Promise<void> => {

    const server: Server = await this.currentServer.getCurrentServer();
    try {
      await server.addSubuser(email);
      await this.currentServer.updateCurrentServerData();
    } catch (e) {
      this.error = e;
    }
    this.addSubmitted = false;
    this.addLoading = false;
    this.addModal.nativeElement.click();
  };
}
