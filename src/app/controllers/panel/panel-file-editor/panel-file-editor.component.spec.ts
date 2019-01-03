import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PanelFileEditorComponent} from './panel-file-editor.component';

describe('PanelFileEditorComponent', () => {
  let component: PanelFileEditorComponent;
  let fixture: ComponentFixture<PanelFileEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PanelFileEditorComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelFileEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
