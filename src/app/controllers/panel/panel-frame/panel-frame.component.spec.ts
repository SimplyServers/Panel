import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelFrameComponent } from './panel-frame.component';

describe('PanelFrameComponent', () => {
  let component: PanelFrameComponent;
  let fixture: ComponentFixture<PanelFrameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelFrameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
