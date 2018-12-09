import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelSidebarComponent } from './panel-sidebar.component';

describe('PanelSidebarComponent', () => {
  let component: PanelSidebarComponent;
  let fixture: ComponentFixture<PanelSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
