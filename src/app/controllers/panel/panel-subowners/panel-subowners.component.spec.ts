import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelSubownersComponent } from './panel-subowners.component';

describe('PanelSubownersComponent', () => {
  let component: PanelSubownersComponent;
  let fixture: ComponentFixture<PanelSubownersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelSubownersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelSubownersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
