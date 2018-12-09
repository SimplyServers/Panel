import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelServerstatusComponent } from './panel-serverstatus.component';

describe('PanelServerstatusComponent', () => {
  let component: PanelServerstatusComponent;
  let fixture: ComponentFixture<PanelServerstatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelServerstatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelServerstatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
