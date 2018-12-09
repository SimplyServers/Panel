import { TestBed } from '@angular/core/testing';

import { SelectedServerService } from './selected-server.service';

describe('SelectedServerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SelectedServerService = TestBed.get(SelectedServerService);
    expect(service).toBeTruthy();
  });
});
