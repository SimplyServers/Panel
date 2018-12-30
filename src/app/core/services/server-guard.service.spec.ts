import {TestBed} from '@angular/core/testing';

import {ServerGuardService} from './server-guard.service';

describe('ServerGuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ServerGuardService = TestBed.get(ServerGuardService);
    expect(service).toBeTruthy();
  });
});
