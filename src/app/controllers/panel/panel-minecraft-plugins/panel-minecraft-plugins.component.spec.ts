import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelMinecraftPluginsComponent } from './panel-minecraft-plugins.component';

describe('PanelMinecraftPluginsComponent', () => {
  let component: PanelMinecraftPluginsComponent;
  let fixture: ComponentFixture<PanelMinecraftPluginsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelMinecraftPluginsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelMinecraftPluginsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
