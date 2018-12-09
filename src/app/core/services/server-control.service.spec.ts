import { TestBed } from '@angular/core/testing';

import { ServerControlService } from './server-control.service';

describe('ServerControlService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ServerControlService = TestBed.get(ServerControlService);
    expect(service).toBeTruthy();
  });
});
