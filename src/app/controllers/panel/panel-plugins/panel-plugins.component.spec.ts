import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelPluginsComponent } from './panel-plugins.component';

describe('PanelPluginsComponent', () => {
  let component: PanelPluginsComponent;
  let fixture: ComponentFixture<PanelPluginsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelPluginsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelPluginsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
