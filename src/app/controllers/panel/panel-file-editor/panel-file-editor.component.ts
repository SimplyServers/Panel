import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ResponsiveServerPage} from '../../panel-controller.serverpage';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-panel-file-editor',
  templateUrl: './panel-file-editor.component.html',
  styleUrls: ['./panel-file-editor.component.scss']
})
export class PanelFileEditorComponent extends ResponsiveServerPage implements OnInit, OnDestroy {
  loading = false;
  blocked = false;
  editName: string;
  newFile: boolean;
  editForm: FormGroup;
  editLoading = false;
  editSubmitted = false;
  error: string;

  ngOnInit(): void {
    super.ngInit();
  }
  ngOnDestroy(): void {
    super.ngUnload();
  }
  loadData = async (): Promise<void> => {
    this.editForm = this.formBuilder.group({
      content: ['', Validators.compose([Validators.required, Validators.maxLength(10000)])],
    });
    await this.getContents();
  };

  private getContents = async (): Promise<void> => {
    this.loading = true;
    this.editName = this.activatedRoute.snapshot.queryParams['f'];
    console.log("edit name: " + this.editName);

    try {
      this.editForm.controls.content.setValue(await this.serverActions.getFileContents(this.editName));
    } catch (e) {
      if (e === 'File not found.') {
        this.newFile = true;
        this.editForm.controls.content.setValue('');
      } else {
        this.notify.notify('error', 'Failed to get contents of file. It will be overwritten if you choose to edit it.');
      }
    }

    this.newFile = false;
    this.loading = false;
  };

  private onEdit = async (): Promise<void> => {
    console.log(this.editForm.controls.content.value);

    this.editSubmitted = true;
    if (this.editForm.invalid) {
      return;
    }
    this.editLoading = true;

    try {
      await this.serverActions.writeContents(this.editName, this.editForm.controls.content.value);
      this.router.navigateByUrl('/panel/files');
    } catch (e) {
      this.error = e;
      this.editLoading = false;
    }
  };

}
