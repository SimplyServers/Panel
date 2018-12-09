import { TestBed } from '@angular/core/testing';

import { ServerSocketManagerService } from './server-socket-manager.service';

describe('ServerSocketManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ServerSocketManagerService = TestBed.get(ServerSocketManagerService);
    expect(service).toBeTruthy();
  });
});
