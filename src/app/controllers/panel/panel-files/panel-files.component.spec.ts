import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PanelFilesComponent} from './panel-files.component';

describe('PanelFilesComponent', () => {
  let component: PanelFilesComponent;
  let fixture: ComponentFixture<PanelFilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PanelFilesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
